# ITSM Documentation Roadmap: Incident, Change, Problem

A reusable method for documenting how a ServiceNow instance implements Incident, Problem and
Change, with the focus on automations.

> This file is generic on purpose. Write the actual documentation for your employer's instance in
> the company wiki, not in this repo. That includes instance names, sys_ids, custom fields and
> script logic.

---

## 1. Documentation structure

Use the same skeleton for every module. Readers learn where to look, and gaps are easy to spot.

```
00 Platform / Task (shared)       ← things on the task table that affect all three modules, documented once
01 Incident
02 Problem
03 Change
99 Appendix: automation inventory, glossary, open questions
```

**Sections in each module:**

| # | Section | What goes in it |
|---|---|---|
| 1 | Overview | Purpose, table name, roles and groups involved, entry points (portal, email, integrations) |
| 2 | Data model | Custom fields (`u_`) and changed OOB fields, choice lists, reference qualifiers, dictionary overrides, related tables (`incident_task`, `problem_task`, `change_task`, `task_ci`) |
| 3 | Lifecycle | State model diagram, allowed transitions, what is mandatory or read-only in each state |
| 4 | Forms & UI | Views, UI Actions (buttons), related lists, templates |
| 5 | Automations | Inventory table plus one entry per automation (see §3 and §4) |
| 6 | Notifications & SLAs | Email notifications, events, SLA definitions |
| 7 | Integrations | Inbound email actions, REST/SOAP, Import Sets, Event Management, Major Incident, etc. |
| 8 | Security | ACLs, roles, Data Policies |
| 9 | Known issues / tech debt | Dead code, overlapping rules, questions for the owners |

## 2. Recommended order

1. **Task (shared layer) first.** Business Rules, ACLs and dictionary entries on `task` fire for
   all three modules. Document them once and link to them from each module.
2. **Incident.** It has the most volume and the most customization, and it's the simplest
   lifecycle. It also sets the pattern for the other two.
3. **Problem.** It's small, and it depends on Incident (linking, "create problem from incident",
   known errors).
4. **Change.** Leave it for last because it's the most complex: change models (`chg_model`),
   approval policies/workflows, risk assessment, CAB, conflict detection and blackout/maintenance
   schedules.

Inside each module, follow the section order above. Do the inventory (§3) before you write any
prose.

## 3. Capturing automations systematically

**Step A: build the inventory.** For each table, filter on `incident`, `problem`,
`change_request`, their `*_task` tables and `task`. Export each list to Excel; that export is your
checklist.

| Type | Table | Filter on |
|---|---|---|
| Business Rules | `sys_script` | `collection` |
| Client Scripts | `sys_script_client` | `table` |
| UI Policies (+ actions) | `sys_ui_policy` / `sys_ui_policy_action` | `table` |
| Data Policies | `sys_data_policy2` | `model_table` |
| UI Actions | `sys_ui_action` | `table` |
| Flows / Subflows | `sys_hub_flow` | trigger table (open the flow to confirm) |
| Legacy Workflows | `wf_workflow` | `table` |
| Assignment / Data Lookup rules | `sysrule_assignment`, `dl_definition` | `table` |
| Notifications / Events / Script Actions | `sysevent_email_action`, `sysevent_register`, `sysevent_script_action` | `collection` / `table` |
| Inbound Email Actions | `sysevent_in_email_action` | `target_table` |
| Scheduled Jobs | `sysauto_script` | search the script for the table name |
| SLA Definitions | `contract_sla` | `collection` |
| Change-specific | `chg_model`, change approval policies, risk conditions | table/scope varies by release |

**Step B: record both active and inactive automations.** Mark each one OOB or custom, and focus
your writing on custom and modified OOB items. The Skipped list in `sys_upgrade_history_log` shows
which OOB records were customized.

**Step C: trace by field, not only by script.** For every custom or important field, search its
name across:

- `sys_script.script`
- `sys_script_client.script`
- `sys_ui_policy_action`
- Script Includes
- flows

Code Search in Studio or ServiceNow IDE helps here. This turns up the hidden chains, like a Before
BR that sets field B from field A.

**Step D: record execution order.** Each entry gets a "When" value:

- Client side: onLoad, onChange, onSubmit, UI Policy
- Server side: Before BR (order < 1000), then engines such as assignment and data lookup (~1000),
  then Before BR (≥ 1000), then the database write, then After BR, then Async BR, Flows and events

> ⚠️ The exact engine ordering and how flows run vary by release and configuration, so check them
> in your instance. Use Debug Business Rule or session debug in a sub-prod instance.

## 4. Mini-template for each automation

```markdown
### [INC-BR-03] Set Support Group from Category
| Type        | Business Rule (Before, Insert+Update, order 100)  |
| Table       | incident                                          |
| Condition   | Category changes AND Category is not empty         |
| Fields read | category                                          |
| Fields set  | assignment_group                                  |
| What it does| Sets Assignment Group based on Category (lookup in u_category_map). |
| User impact | Group changes on save; user can override afterwards. |
| Depends on  | Script Include CategoryUtils; conflicts with INC-ASG-01? |
| OOB/Custom  | Custom                                            |
| Record      | sys_id / link                                     |
| Notes       | No onChange client equivalent, so the user only sees the change after saving. |
```

**ID convention:** `<MODULE>-<TYPE>-<NN>`, for example `INC-BR`, `INC-CS`, `CHG-UIP`, `PRB-FLOW`,
`TASK-BR`. Use the same IDs in the inventory and in cross-references.

## 5. Working tips

- **Describe behavior, not code.** Write one or two sentences about what happens and why. Link to
  the record instead of pasting the script; pasted scripts go stale.
- **Inventory first, then write.** A full list saves you from discovering a conflicting rule
  halfway through a section.
- **Watch for duplicate logic.** The same rule often exists twice, for example as a UI Policy and a
  Client Script, or as a BR and a Flow. Record it under Known issues.
- **Note when something applies.** Some automations only fire in certain states or views, or for
  certain roles. Write that in the condition field.
- **Keep an open-questions list** for missing "why" answers, and ask the process owners in batches.
- **Draw the state model and key chains** with one simple diagram per module (Mermaid or draw.io).
  Skip diagrams elsewhere.
- **Stamp the doc** with the instance release and the date of the inventory. Re-run the Step A
  exports after upgrades or major releases and compare them with the previous ones.
- **Check behavior in sub-prod** when a script is unclear: test the field change, then use debug
  output to see what fired.
