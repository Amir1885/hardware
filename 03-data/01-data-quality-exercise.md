# Exercise 1 — Data-quality hunt

**File:** [`hardware_assets_export.csv`](hardware_assets_export.csv)

Imagine this is an export of `alm_hardware`, dot-walked to the linked CI
(`ci.name`, `ci.install_status`, `ci.last_discovered`), taken on **2026-09-30**.
35 rows. It contains **at least 14 distinct data-quality problems**.

## Your task

1. Find as many problems as you can. For each one, write:
   - the row(s) / asset tag(s)
   - what is wrong
   - the **likely root cause** (process gap, integration, missing config, human error…)
   - how you would **fix it** on ServiceNow, and how you would **prevent it** from coming back
     (a data policy, business rule, CMDB Health rule, Data Manager policy, process change…)
2. Group the problems by category: *completeness*, *correctness*, *consistency (asset ↔ CI)*,
   *lifecycle*, *normalization*.
3. Pick the **three** issues you would fix first, and explain why.

Write your answers in `03-data/my-answers/01-data-quality.md`, commit, then ask Claude to review.

## Hints (read only if stuck)

<details>
<summary>Hint 1</summary>
Sort by serial number. Then sort by CI name.
</details>

<details>
<summary>Hint 2</summary>
Compare the asset state with the CI status on every row. Then compare the asset state with
<code>assigned_to</code>.
</details>

<details>
<summary>Hint 3</summary>
Look at <code>last_discovered</code> relative to the export date, and the <code>warranty_expiration</code>
of assets that are still in use.
</details>

Answer key: [`solutions/01-data-quality.md`](../solutions/01-data-quality.md). Don't open it until you're done!
