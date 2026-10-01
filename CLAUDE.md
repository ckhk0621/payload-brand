@docs/HANDOFF.md

Payload 3 admin 品牌 plugin（`@ideastime/payload-brand`）。設計 spec 喺 `docs/superpowers/specs/`（gitignored，只喺本機）。

## 公開 repo

- ⚠️ **唔准喺任何 commit 入去嘅檔寫客戶名或者內部事故細節**，包括 `docs/HANDOFF.md`（佢會 commit）、fixture、commit message。第二個品牌 fixture 叫「iDeasTime Demo」，唔設 `colors`，行 Payload 原裝 dark mode，logo 白色（CK 2026-10-01 定，唔用虛構公司名、唔自訂顏色）；假 URL／email 用 `example.com`。⚠️ 個名唔可以改做淨係「iDeasTime」：同 preset 撞名，test 就分唔出客戶品牌生效定係靜靜退返 preset。
- `src/ideastime.ts` 係官網 `official-site-2027` 嘅鏡像（logo、色、聯絡、OG 圖）。官網改咗要兩邊一齊改，來源路徑寫咗喺檔頭。

## 唔准

- ⚠️ **唔准註冊 `admin.components.providers`。** 症狀：admin 成頁黑屏。點解：provider 喺 importMap 搵唔到，就成個 admin render 唔到；其他 slot 走失只係靜靜消失。釘住：`test/unit/apply.test.ts` 嘅 "never registers providers"。
- ⚠️ **`src/` 唔准 import `@payloadcms/ui`、唔准 `'use client'`。** 點解：Payload 改內部 component 就會跟住爛。釘住：`test/unit/guards.test.ts`。
- ⚠️ **CSS 只可以 override `--color-base-0…900` 同 `--font-body`，寫喺 unlayered `:root`。** 點解：Payload 喺 stylesheet 中段先宣告 `@layer payload-default,payload`，用 `@layer payload` 嘅話，次序可能反轉，變成 Payload 贏；unlayered 樣式一律贏有 layer 嘅樣式。唔准寫 Payload 內部 class selector。
- ⚠️ **Plugin 永遠唔 throw。** 有問題就經注入嘅 `warn` 報，只退嗰一部分。釘住：`test/unit/plugin.test.ts`。
- ⚠️ **`pb-logo__img` 唔准用百分比尺寸。** 症狀：客戶 logo 闊度變 0px，E2E `.pb-logo` 報 hidden。點解：Payload login 嘅 `.login__brand` 係 flex，shrink-to-fit 嘅子元素用 `%` max-width 會縮到 0。

## 陷阱

- ⚠️ **Dev config 用相對路徑 `../src/index.js` import plugin，唔好改做 package 名。** 症狀：`pnpm generate:importmap` 報 `ERR_MODULE_NOT_FOUND …/dist/index.js`。點解：Payload CLI 經 `exports` 解析 package 名（指 `dist/`），唔睇 tsconfig `paths`；Next 就會經 `dev/tsconfig.json` 將 importMap 嘅 `@ideastime/payload-brand/rsc` 指去 `src/`。
- ⚠️ **Dev app 永遠讀 `src/`，唔係讀出貨嗰份。** 真正驗到 `dist/` 同 `exports` 嘅只有 `pnpm test:consumer v<x.y.z>`。
- ⚠️ **Dev config 要保持 `importMap.autoGenerate: false`。** 症狀：`test:failsoft` 變假綠燈。點解：dev server 會自動補返被剷走嘅 entry。要重生成就跑 `pnpm generate:importmap`。
- Component 喺 importMap 走失**唔會報錯，只會靜靜消失**（淨係 server log 有 `PayloadComponent not found`），所以 E2E 要逐個 `pb-` class 驗。
- `exports` 永久指 `dist/`：git 安裝唔會套用 `publishConfig`。`dist/` 只可以由 `pnpm release` 改。
- `next dev` 由 AI agent 開，會喺 `dev/` 寫 `AGENTS.md`、`CLAUDE.md`，已經 gitignore。

## 指令

- `pnpm test:payload <version|latest>`：升級任何客戶 project 嘅 Payload 之前**必跑**。佢會將 dev app 換成嗰個版本，跑 unit、E2E、fail-soft，跑完還原。
- `pnpm release <x.y.z>`：build、檢查、commit `dist/`、打 tag。**唔 push**，push 係 CK 嘅事。
