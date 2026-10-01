# BACKLOG — payload-brand

未修項目，來自 v1.0.1 前嘅 whole-branch review。編號跟 review report；修咗就剷走嗰行，commit message 引用編號。

- **R3** Title suffix `' — name'` 前面有空格，Payload 再用空格接，raw `<title>` 會有雙空格（瀏覽器 tab 會合併，睇唔到）。改做 `— ${name}` 要同步改 e2e 嘅 title regex。
- **R4** 對比度閘實際唔會觸發：凡係過到深度門檻（L ≤ 0.35）嘅底色，正文都 ≥ 10:1。真正會變差嘅係次要文字 `base-500` 對底色：Payload 原裝 4.66:1，`#10231F` 4.47:1，`#2B3A55` 約 3.8:1。可以改做閘 `base-500`（以 Payload 原裝比例為準），或者將門檻收到約 0.30；改之前先諗清楚 demo 品牌（`#10231F`）會唔會被拒。
- **R6** `font.family` 冇 trim：`'Inter '` 會被接受，但永遠配唔到已載入嘅字體。
- **R7** Reset-password 頁（`/admin/reset/:token`）同忘記密碼頁一樣冇品牌，但 README「Known limitations」冇寫；e2e 冇 cover 首次建 user 頁（seed 永遠會建 user）。
- **R8** Guard 唔夠嚴：`guards.test.ts` 嘅 regex 捉唔到 side-effect import（`import '@payloadcms/ui/…'`）；「never registers providers」只驗咗 preset 配空 config。可以加 `src/` 靜態 grep `providers` 同 client brand 嘅斷言。
- **R9** E2E、fail-soft、consumer check 全部行 `next dev`。2026-09-30 做過一次人手 production smoke（由 `v1.0.1` 安裝，`next build` + `next start`，品牌全部正確），但未自動化。可以喺 consumer-check 加一個可選嘅 `next build && next start` 步驟。
