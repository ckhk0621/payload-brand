import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

// Relative import on purpose: the Payload CLI resolves the package name through package.json
// `exports` (dist/, absent before a build) and ignores tsconfig paths. Next still resolves the
// importMap's '@ideastime/payload-brand/rsc' entries to ../src via dev/tsconfig.json paths.
import { brandPlugin } from '../src/index.js'
import { demoBrand } from './brands.js'
import { testEmailAdapter } from './helpers/testEmailAdapter.js'
import { seed } from './seed.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

if (!process.env.ROOT_DIR) {
  process.env.ROOT_DIR = dirname
}

export default buildConfig({
  admin: {
    importMap: {
      // Regenerate only via `pnpm generate:importmap`. Dev auto-regeneration would silently
      // restore removed entries and turn scripts/failsoft-check.mjs into a false green.
      autoGenerate: false,
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    {
      slug: 'posts',
      fields: [{ name: 'title', type: 'text' }],
    },
    {
      slug: 'media',
      fields: [],
      upload: {
        staticDir: path.resolve(dirname, 'media'),
      },
    },
  ],
  db: sqliteAdapter({ client: { url: process.env.DATABASE_URL || 'file:./dev/dev.db' } }),
  editor: lexicalEditor(),
  email: testEmailAdapter,
  onInit: async (payload) => {
    await seed(payload)
  },
  plugins: [brandPlugin(process.env.BRAND === 'demo' ? demoBrand : undefined)],
  secret: process.env.PAYLOAD_SECRET || 'dev-only-secret',
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
