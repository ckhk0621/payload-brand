# HANDOFF — payload-brand

（狀態檔唔係日誌；過程 → `git log -p docs/HANDOFF.md`；backlog → `docs/BACKLOG.md`）
⚠️ Repo 之後會公開，呢份檔會 commit：唔准寫客戶名或者內部事故細節。

## 而家企喺邊

- v1 做完，喺 branch `feat/v1`。`main` 仲停喺 handoff commit，同 `feat/v1` 零分叉，ff 得上。Repo 冇 remote。
- 本機 tag：
  - **`v1.0.1` 係現行版本**。
  - `v1.0.0` 有 review 揪出嘅兩個問題：冇 `ogImage` 時預覽圖爛、serverProps 冇嘅話會 throw。唔好用，但留低唔刪。
- 驗證（2026-09-30，`v1.0.1`）：
  - unit 88、lint 0、tsc 0
  - E2E 兩個品牌各 5 passed
  - `test:failsoft` PASSED（`--no-strip` 係 FAILED，證明個 check 識分）
  - `test:payload` 對 3.90.1 同 3.90.2 都 PASSED
  - `verify:dist` 一致
  - `test:consumer v1.0.1` PASSED
  - 一次人手 production smoke OK（由 tag 安裝，`next build` + `next start`）
- `.github/workflows/` 兩個 workflow 未跑過，因為冇 remote。
- Plan／spec 喺 `docs/superpowers/`，gitignored、只喺本機。

## 等 CK

- 覆核 3 個【autopilot】決定（見已拍板）。
- 睇完成果：`git switch main && git merge --ff-only feat/v1`。
- 開公開 GitHub repo `ckhk0621/payload-brand`，push `main` 同 tags。對外動作，Claude 唔做。Push 之後要睇第一次 CI run。⚠️ commit author email `ckhk0621@gmail.com` 會隨 push 公開。
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

## 下一步

1. CK 做完「等 CK」之後：揀第一個新客戶 project 試裝，照 README 四步做，裝完跑一次 `pnpm payload generate:importmap`。
2. `docs/BACKLOG.md` 有 R3–R9，按需要修。改到 `src/` 就要出新 patch，再跑 `pnpm test:consumer v<新版>`。
3. Payload 出新版，升任何客戶 project 之前，先喺呢度跑 `pnpm test:payload <version>`。
