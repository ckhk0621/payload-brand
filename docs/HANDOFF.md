# HANDOFF — payload-brand

（狀態檔唔係日誌；過程 → `git log -p docs/HANDOFF.md`；backlog → `docs/BACKLOG.md`）
⚠️ Repo 之後會公開，呢份檔會 commit：唔准寫客戶名或者內部事故細節。

## 而家企喺邊

- v1 做完，喺 branch `feat/v1`。`main` 仲停喺 handoff commit，同 `feat/v1` 零分叉，ff 得上。Repo 冇 remote。
- 本機 tag：
  - **`v1.0.2` 係現行版本**：`colors`／`colors.accent` 變選填（唔填就行 Payload 原裝 dark、卡邊用 Payload 白色），非正方形 mark 唔再爆出 nav icon slot。
  - `v1.0.1` 用得，但冇上面兩樣；iDeasTime preset 個 nav icon 會被裁。
  - `v1.0.0` 有 review 揪出嘅兩個問題：冇 `ogImage` 時預覽圖爛、serverProps 冇嘅話會 throw。唔好用，但留低唔刪。
- 驗證（2026-10-01，`v1.0.2`）：
  - unit 91、lint 0、tsc 0
  - E2E 兩個品牌各 6 passed，包括 icon 唔超出 slot（桌面同手機闊度）
  - `test:failsoft` PASSED
  - `test:payload 3.90.2` PASSED（3.90.1 係 repo 本身嘅版本，即上面幾項）
  - `verify:dist` 一致；`test:consumer v1.0.2` PASSED
  - 人手 production smoke（`next build` + `next start`）淨係做過 `v1.0.1`，`v1.0.2` 未做（BACKLOG R9）
- `.github/workflows/` 兩個 workflow 未跑過，因為冇 remote。
- Plan／spec 喺 `docs/superpowers/`，gitignored、只喺本機。

## 等 CK

- 覆核 3 個【autopilot】決定（見已拍板）。CK 2026-10-01 睇過兩個品牌嘅 preview，冇反對，但未明確批。
- 睇完成果：`git switch main && git merge --ff-only feat/v1`。
- 開公開 GitHub repo `ckhk0621/payload-brand`，push `main` 同 tags。對外動作，Claude 唔做。Push 之後要睇第一次 CI run。⚠️ commit author email `ckhk0621@gmail.com` 會隨 push 公開。第一個客戶 project commit 依賴之前要 push，否則 lockfile 會寫死本機 `git+file://` 路徑。
- License 暫定 `UNLICENSED`（冇授權任何人用）。建議維持：公開只係為咗客戶 project 裝得到。
- 每個客戶 admin 會顯示支援聯絡 `cklam@ideastime.ltd` 同 WhatsApp +852 6329 5926（官網 `lib/contact.json` 鏡像）。要唔要另開一個 support email？
- 覆核 autopilot 收工留低嘅 save 候選：`~/.claude/autopilot/dab01200-7899-427b-a178-2db4605d6faf-review.md`

## 已拍板・否決過（唔使再問）

- 設計以 spec §2 為準（CK 2026-09-30 逐段批）：獨立 plugin、淨係 admin 外觀、只用喺新 project、鎖 dark、只用官方 API、唔用 `providers`、git tag 派發。
- 【autopilot】執行方式揀 Native（plan 建議）：11 個 task 嘅型別前後依賴，plan 已經有完整 code，一條線做最慳 token。
- 【autopilot】HANDOFF 會 commit，唔跟 plan 將佢 gitignore：autopilot 收工要求 HANDOFF 已 commit。代價係內容要守公開規矩。
- 【autopilot】喺 branch `feat/v1` 做，唔直接郁 `main`：executing-plans 規定冇 CK 明確同意唔准喺 main 實作。
- 冇 `ogImage` 就冇預覽圖（plugin 將 `meta.defaultOGImageType` 設做 `'off'`）。原因係 Payload 嘅 `/api/og` 會畫 `graphics.Icon`，而客戶 mark 係相對路徑 `<img>`，佢嘅 renderer 唔接受。預覽文字（siteName／title／description）一律用品牌名。
- 打咗嘅 tag 唔准刪、唔准改。有問題就出新 patch（`pnpm release x.y.z`）。
- 顏色選填（CK 2026-10-01）：新客戶淨係俾名同 logo 就裝得。冇 accent 用 Payload 白色（同 accent 填錯共用一個 fallback），唔係「冇色條」。
- Nav icon 用固定 1.25rem 正方形 ＋ `object-fit: contain`（2026-10-01）：唔用百分比（login flex 陷阱），唔寫 Payload 內部 class。
- 掣（Login／Create New）維持 Payload 原裝淺灰，唔跟品牌色：要寫 Payload 內部 class 先改到，違反「只改 `--color-base-*`」。2026-10-01 同 CK 講明咗，CK 冇要求改（之後再定「唔自訂顏色」，方向一致）。

## 下一步

1. CK 做完「等 CK」之後：揀第一個新客戶 project 試裝 `v1.0.2`，照 README 四步做，裝完跑一次 `pnpm payload generate:importmap`。
2. `docs/BACKLOG.md` 有 R3–R9，按需要修。改到 `src/` 就要出新 patch，再跑 `pnpm test:consumer v<新版>`。
3. Payload 出新版，升任何客戶 project 之前，先喺呢度跑 `pnpm test:payload <version>`。
