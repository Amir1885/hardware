# HAM & CMDB Practice Lab

My personal learning repo for getting better at **Hardware Asset Management (HAM)** and the
**CMDB** on ServiceNow, as a ServiceNow developer.

The goal is not to collect theory. The goal is to understand *why* the platform behaves the way it
does (asset ↔ CI sync, identification, reconciliation, CSDM) so I can design and debug better
solutions at work.

## How this repo works

| Folder | What goes there |
|---|---|
| `01-fundamentals/` | Concept lessons: data model, lifecycle, IRE, CSDM… |
| `02-processes/` | Process designs and runbooks I write (receiving, refresh, disposal, certification…) |
| `03-data/` | Sample exports with deliberate data-quality problems to analyze |
| `04-scripts/` | Script exercises to run in a **Personal Developer Instance (PDI)** |
| `05-case-studies/` | Realistic scenarios: I write my answer, then get it reviewed |
| `06-itsm/` | ITSM (Incident / Problem / Change) guides, e.g. the [documentation roadmap](06-itsm/documentation-roadmap.md) |
| `solutions/` | Answer keys: **try first, look after** |
| `journal/` | Short dated notes: what I learned, what confused me |

### Study loop

1. Read the lesson in `01-fundamentals/`.
2. Do the exercise (data, script, or case study), ideally in a PDI
   ([developer.servicenow.com](https://developer.servicenow.com)).
3. Commit your answer, then ask Claude to review it.
4. Check the solution, write a journal entry, tick the roadmap box.

### Useful things to ask Claude

- "Explain *X* and quiz me on it."
- "Review my answer in `05-case-studies/…`"
- "Generate a harder version of the data-quality exercise."
- "Give me a script exercise about *X*."
- "What should I work on next based on the roadmap?"

## Roadmap

### Module 1 — Asset vs CI foundations
- [ ] Lesson: [Asset vs CI data model](01-fundamentals/01-asset-vs-ci.md)
- [ ] Exercise: [Data-quality hunt](03-data/01-data-quality-exercise.md)
- [ ] Exercise: [Background scripts: find sync problems](04-scripts/01-asset-ci-sync-checks.md)
- [ ] Case study: [The ghost laptops](05-case-studies/01-ghost-laptops.md)

### Module 2 — Model management
- [ ] Product models, model categories, manufacturers
- [ ] Hardware normalization and the content library (HAM Pro)
- [ ] Exercise: clean up duplicate or unnormalized models

### Module 3 — Hardware asset lifecycle
- [ ] Asset states and substates, and how they map to CI status
- [ ] Stockrooms, transfer orders, procurement to receiving
- [ ] Refresh, retirement, disposal and data sanitization (NIST 800-88)
- [ ] Process design: write a receiving + tagging runbook

### Module 4 — CMDB data model
- [ ] CI class hierarchy, CI Class Manager, extending vs. attributes
- [ ] Relationships (`cmdb_rel_ci`), relationship types, suggested relationships
- [ ] Dependency views and why relationships drive impact analysis

### Module 5 — Identification & Reconciliation Engine (IRE)
- [ ] Identification rules, independent vs. dependent CIs
- [ ] Reconciliation rules, data source precedence, data refresh rules
- [ ] `sn_cmdb.IdentificationEngine` API: create/update CIs from a script
- [ ] Exercise: build a mini integration that goes through IRE

### Module 6 — Data sources
- [ ] Discovery basics (probes/sensors/patterns, what populates what)
- [ ] Service Graph Connectors and Integration Hub ETL
- [ ] Reconciling multiple sources (Discovery vs. SCCM/Intune vs. manual)

### Module 7 — CSDM
- [ ] CSDM domains and core tables
- [ ] Business vs. technical services, application services, service offerings
- [ ] Case study: map a real application to CSDM

### Module 8 — CMDB health & governance
- [ ] CMDB Health: completeness, correctness (duplicates, orphans, staleness), compliance
- [ ] CMDB Data Manager policies (retire, archive, delete)
- [ ] Data certification and ownership (managed by group)
- [ ] De-duplication tasks

### Module 9 — Reporting & KPIs
- [ ] HAM KPIs: asset accuracy, in-stock ageing, refresh compliance, disposal cycle time
- [ ] CMDB KPIs: health scores, staleness, coverage
- [ ] Build a dashboard in a PDI

### Capstone
- [ ] Design an end-to-end HAM + CMDB solution for a fictional company and document it here

## Progress log

See [`journal/`](journal/).
