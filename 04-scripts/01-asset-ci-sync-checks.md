# Script exercise 1 — Find asset ↔ CI sync problems

Run these in a **PDI** (System Definition → Scripts - Background). **Read-only**: your scripts
must only *report* (`gs.info`). No updates yet.

Seed some bad data first so you have something to find. For example, create a hardware asset with a
Computer model, then clear its `ci` field with `setWorkflow(false)`. Also create two computers
with the same serial number.

## Tasks

1. **Assets without a CI.** List `alm_hardware` records with no `ci`, but *only* where the
   model category defines a CI class (otherwise no CI is expected).
2. **CIs without an asset.** List `cmdb_ci_computer` records with no `asset`, excluding
   retired CIs.
3. **Broken back-references.** List assets where `asset.ci.asset` is not the asset itself.
4. **Duplicate serial numbers.** List serial numbers that appear on more than one
   `cmdb_ci_computer`, with the count. Use `GlideAggregate`, not a loop.
5. **Lifecycle mismatch.** List assets whose State is *Retired* but whose CI Status is not
   *Retired*.

## Constraints

- Use encoded queries or dot-walking where possible instead of nested GlideRecord loops.
- Print a summary line per check: `[check name] N records`.
- Bonus: turn the whole thing into a Script Include `AssetCIHealthCheck` with one method per
  check that returns an array of sys_ids. Then call it from a scheduled job.

## Reflection

- Which of these would **CMDB Health** already catch out of the box? Which wouldn't?
- For each problem, what is the correct fix? A script, a config change, or a process change?

Save your script as `04-scripts/my-answers/01-asset-ci-sync-checks.js`, then ask Claude for a review.

Reference solution: [`solutions/01-asset-ci-sync-checks.js`](../solutions/01-asset-ci-sync-checks.js)
