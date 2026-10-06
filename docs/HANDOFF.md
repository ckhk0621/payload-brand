# HANDOFF — payload-brand

（狀態檔唔係日誌；過程 → `git log -p docs/HANDOFF.md`；backlog → `docs/BACKLOG.md`）
⚠️ Repo 之後會公開，呢份檔會 commit：唔准寫客戶名或者內部事故細節。

## 而家企喺邊

- v1 喺 2026-10-01 ff 入 `main`；`v1.0.3`（2026-10-07）喺 branch `fix/v1.0.3` 做完再 ff 入 `main` 先 release。兩條 branch 都已經 merge 晒，留住冇獨有 commit。
- 公開 repo `ckhk0621/payload-brand`：`origin` 有 `v1.0.0`–`v1.0.2`，2026-10-01 嗰 4 個 `ci` run 全過。`v1.0.3` 打咗 tag 但淨係喺本機，`origin/main` 仲停喺 v1.0.2 之後啲 HANDOFF commit（見等 CK）。客戶 project 照 README 用 `github:` 裝。
- Tag：
  - **`v1.0.3` 係現行版本**：title 後綴唔再出雙空格（R3）、`font.family` 會 trim（R6）；Payload 抄過嚟嘅值（灰階、dark 底色、字體 stack）收埋喺 `src/payload-mirror.ts`，unit test 會同已安裝嘅 Payload 比對，所以 `test:payload` 而家捉到漂移。
  - `v1.0.2` 用得，但冇上面三樣。由佢開始 `colors`／`colors.accent` 選填（唔填就行 Payload 原裝 dark、卡邊用 Payload 白色），非正方形 mark 唔再爆出 nav icon slot。
  - `v1.0.1` 用得，但冇上面兩樣；iDeasTime preset 個 nav icon 會被裁。
  - `v1.0.0` 有 review 揪出嘅兩個問題：冇 `ogImage` 時預覽圖爛、serverProps 冇嘅話會 throw。唔好用，但留低唔刪。
- 驗證（2026-10-07，`v1.0.3`，Payload 3.90.1）：
  - unit 96、lint 0、tsc 0
  - E2E 兩個品牌各 6 passed（而家連 raw `<title>` 都驗）
  - `test:failsoft` PASSED；`verify:dist` 42 個檔一致；`test:consumer v1.0.3` PASSED
  - 漂移 test 實證過：改壞鏡像值（灰階、字體）同 Payload 嘅 dark 對應，各自都會紅
  - `test:payload 3.90.2` PASSED（漂移 test 喺 3.90.2 下面都綠，即係 3.90.2 冇改呢三個值）
  - 人手 production smoke（`next build` + `next start`）淨係做過 `v1.0.1`（BACKLOG R9）
- `payload-latest`（每週一 schedule）未跑過；`ci` 見上。
- Plan／spec 喺 `docs/superpowers/`，gitignored、只喺本機。

## 等 CK

- Push `main` 同 tag `v1.0.3`：`! git -C ~/jobs/ideastime/payload-brand push origin main --follow-tags`。Push 完 Claude 去睇 tag 嗰個 CI run。
- 覆核 3 個【autopilot】決定（見已拍板）。CK 2026-10-01 睇過兩個品牌嘅 preview，冇反對，但未明確批。
- 每個客戶 admin 會顯示支援聯絡 `cklam@ideastime.ltd` 同 WhatsApp +852 6329 5926（官網 `lib/contact.json` 鏡像）。要唔要另開一個 support email？
- 覆核 autopilot 收工留低嘅 save 候選：`~/.claude/autopilot/dab01200-7899-427b-a178-2db4605d6faf-review.md`

## 已拍板・否決過（唔使再問）

- 設計以 spec §2 為準（CK 2026-09-30 逐段批）：獨立 plugin、淨係 admin 外觀、只用喺新 project、鎖 dark、只用官方 API、唔用 `providers`、git tag 派發。
- 【autopilot】執行方式揀 Native（plan 建議）：11 個 task 嘅型別前後依賴，plan 已經有完整 code，一條線做最慳 token。
- 【autopilot】HANDOFF 會 commit，唔跟 plan 將佢 gitignore：autopilot 收工要求 HANDOFF 已 commit。代價係內容要守公開規矩。
- 【autopilot】喺 branch `feat/v1` 做，唔直接郁 `main`：executing-plans 規定冇 CK 明確同意唔准喺 main 實作。
- 冇 `ogImage` 就冇預覽圖（plugin 將 `meta.defaultOGImageType` 設做 `'off'`）。原因係 Payload 嘅 `/api/og` 會畫 `graphics.Icon`，而客戶 mark 係相對路徑 `<img>`，佢嘅 renderer 唔接受。預覽文字（siteName／title／description）一律用品牌名。
- License 維持 `UNLICENSED`（CK 2026-10-01）：repo 公開只係為咗客戶 project 裝得到，唔授權其他人用。
- 打咗嘅 tag 唔准刪、唔准改。有問題就出新 patch（`pnpm release x.y.z`）。
- 顏色選填（CK 2026-10-01）：新客戶淨係俾名同 logo 就裝得。冇 accent 用 Payload 白色（同 accent 填錯共用一個 fallback），唔係「冇色條」。
- Nav icon 用固定 1.25rem 正方形 ＋ `object-fit: contain`（2026-10-01）：唔用百分比（login flex 陷阱），唔寫 Payload 內部 class。
- 掣（Login／Create New）維持 Payload 原裝淺灰，唔跟品牌色：要寫 Payload 內部 class 先改到，違反「只改 `--color-base-*`」。2026-10-01 同 CK 講明咗，CK 冇要求改（之後再定「唔自訂顏色」，方向一致）。

## 下一步

1. CK push 完：睇 `v1.0.3` tag 嘅 `ci` run（要包埋 `verify:dist`）。
2. 揀第一個新客戶 project 試裝 `v1.0.3`，照 README 四步做，裝完跑一次 `pnpm payload generate:importmap`。
3. `docs/BACKLOG.md` 剩 R4、R7–R9，按需要修；R4 要先揀門檻。改到 `src/` 就要出新 patch，再跑 `pnpm test:consumer v<新版>`。
4. Payload 出新版，升任何客戶 project 之前，先喺呢度跑 `pnpm test:payload <version>`。
