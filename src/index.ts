import type { Config, Plugin } from 'payload'

export const brandPlugin =
  (): Plugin =>
  (config: Config): Config =>
    config
