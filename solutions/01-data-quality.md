# Answer key — Exercise 1: Data-quality hunt

Export date: 2026-09-30.

| # | Row(s) | Problem | Category | Likely root cause | Fix / prevention |
|---|---|---|---|---|---|
| 1 | P1004, P1019 | Same serial `PF3KX9ZT` on two assets/CIs | Correctness (duplicate) | Typo at receiving, or an integration creating a second record | Physically verify the device, then merge or retire the duplicate. Make serial mandatory and unique per model at receiving; IRE identification on serial number; CMDB Health duplicate rule + de-duplication tasks |
| 2 | P1007 | Missing serial number | Completeness | Manual receiving without a mandatory field | Get the serial from Discovery/Intune. Data policy: serial mandatory when state leaves *On order* |
| 3 | P1010 | Asset *Retired / Disposed* but CI still *Installed*, **and discovered 2 days ago** | Consistency / lifecycle | Asset retired on paper but device still on the network (or reused). State mapping bypassed with `setWorkflow(false)`? | Investigate: is the device really disposed? Security/data-sanitization risk. Re-check the install status mapping |
| 4 | P1012 | *In use* with no `assigned_to` | Completeness / lifecycle | Deployment done without assignment | Fill from Discovery's last logged-on user or Intune primary user. Rule: *In use* requires assigned_to (end-user devices) |
| 5 | P1014 | *In stock / Available* but assigned to Emma Laurent | Consistency / lifecycle | Returned device not cleared, or deployed without updating state | Clear the assignment on return to stock (flow/business rule), or correct the state |
| 6 | P1016 | Computer asset *In use* with **no CI** | Consistency (asset ↔ CI) | CI deleted or link cleared by a script, or wrong model category | Re-link or recreate via the platform (not a raw insert). Run the sync check script regularly |
| 7 | P1018 | *In use*, last discovered 2026-03-02 (~7 months) | Correctness (stale) | Device lost, broken, or user left; agent not reporting | Staleness rule in CMDB Health; Data Manager policy/task to verify; tie offboarding to asset collection |
| 8 | P1021 (also P1018) | *In use* with warranty expired | Lifecycle (refresh) | No refresh process | Not a data error, but a refresh/risk candidate. Report on warranty expiring < 90 days; HAM Pro refresh |
| 9 | P1023, P1025 | Model not normalized: `DELL LAT 5440`, `Latitude 5440 Laptop` vs `Dell Latitude 5440` | Normalization | Free-text or duplicate model records created at receiving | Merge into the normalized model (HAM Pro normalization / content library). Restrict who can create models |
| 10 | P1027 | Missing location | Completeness | Remote/manual receiving | Location mandatory. For remote workers, use a "Remote" location convention (as other rows do) |
| 11 | row with blank asset tag (serial `5CG1234ABN`, CI LT-1029) | Missing asset tag | Completeness | Asset created from the CI side (Discovery) and never tagged | Tagging step in the receiving process; report on empty asset tags |
| 12 | P1002, P1030 | Two assets point to the same CI name `LT-1002` | Consistency (asset ↔ CI) | Hostname reused after re-imaging, or a CI matched on name by an integration | Identification on serial, not name. Fix the wrong link. Watch for integrations that match on name |
| 13 | P1032 | Asset *Missing* but CI discovered yesterday (CI status *Absent*) | Consistency / lifecycle | Device reported lost, but it's actually online | Great find: locate it via the last logged-on user. Automate: a *Missing* asset seen by Discovery should create a task |
| 14 | P1034 | *Retired / Disposed* but still assigned to Victor Andre | Lifecycle | Disposal flow doesn't clear the assignment | Clear assigned_to on retirement (flow). Keep history in the audit trail, not on the active field |
| 15 | P1008, P1009, P1024 | Servers with no `assigned_to` | *Not an error* | Servers are usually owned via **support group / managed by group** on the CI, not assigned to a person | Good trap to recognize: rules for end-user devices shouldn't apply blindly to servers |
| 16 | P1005, P1006, P1026, P1014 | In-stock laptops never discovered | *Expected* | Devices in a stockroom aren't on the network | Don't flag these as stale. Scope staleness rules to *In use* |
| 17 | Monitors (P1013, P1017) | No CI | *Expected* | Monitor model category often has no CI class, by design | Correct. Not everything belongs in the CMDB |

## Suggested top 3

1. **P1010, and the pattern behind it.** A "disposed" device still active on the network is a
   **security and compliance risk** (was the data sanitized?). It's also audit evidence that the
   disposal process isn't trustworthy.
2. **Duplicates and wrong links (P1004/P1019, P1002/P1030).** They break identification. Every
   later integration run can make them worse, and they corrupt incident/impact data.
3. **P1032 and P1018 (missing vs. stale).** They show the asset state isn't driven by real
   evidence. Fixing the process (offboarding → collection, Discovery → verification task) fixes a
   whole class of issues rather than one row.

A different top 3 is fine if the reasoning is sound. Reasoning about **risk and root cause** over
row counts is what matters.
