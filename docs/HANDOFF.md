# HANDOFF — payload-brand

（狀態檔唔係日誌；過程 → `git log -p docs/HANDOFF.md`；backlog → `docs/BACKLOG.md`）
⚠️ Repo 之後會公開，呢份檔會 commit：唔准寫客戶名或者內部事故細節。

## 而家企喺邊

- Autopilot 執行緊 implementation plan `docs/superpowers/plans/2026-09-30-payload-brand.md`。Spec 喺同層 `specs/`，兩份都 gitignored、只喺本機。
- Repo 只喺本機，冇 remote。工作喺 branch `feat/v1`；`main` 停喺 handoff commit。Release tag 都只喺本機。
- 進度：Task 1–6 完成；下一個 Task 7（plugin 本體）。

## 等 CK

- 覆核 3 個【autopilot】決定（見已拍板）。
- 睇完成果之後，喺 `main` 做 `git merge --ff-only feat/v1`。
- 開公開 GitHub repo `ckhk0621/payload-brand` 同 push。對外動作，Claude 唔做；push 之後要睇第一次 CI run，因為 workflow 本機驗唔到。
- License 暫定 `UNLICENSED`（冇授權任何人用）。建議維持：公開只係為咗客戶 project 裝得到。
- 每個客戶 admin 會顯示支援聯絡 `cklam@ideastime.ltd` 同 WhatsApp +852 6329 5926（官網 `lib/contact.json` 鏡像）。要唔要另開一個 support email？

## 已拍板・否決過（唔使再問）

- 設計以 spec §2 為準（CK 2026-09-30 逐段批）：獨立 plugin、淨係 admin 外觀、只用喺新 project、鎖 dark、只用官方 API、唔用 `providers`、git tag 派發。
- 【autopilot】執行方式揀 Native（plan 建議）：11 個 task 嘅型別前後依賴，plan 已經有完整 code，一條線做最慳 token。
- 【autopilot】HANDOFF 會 commit，唔跟 plan 將佢 gitignore：autopilot 收工要求 HANDOFF 已 commit。代價係內容要守公開規矩。
- 【autopilot】喺 branch `feat/v1` 做，唔直接郁 `main`：executing-plans 規定冇 CK 明確同意唔准喺 main 實作。CK 睇完成果，`git merge --ff-only feat/v1` 就得。

## 下一步

1. 照 plan 次序做 Task 1–11。每個 task commit 之後，更新「而家企喺邊」嘅進度。
2. Task 1 重寫 `.gitignore` 時，**唔好加** plan 入面嗰行 `/docs/HANDOFF.md`（見已拍板）。
