# Lesson 1 — Asset vs CI: two records, one device

## The core idea

A single physical laptop usually exists **twice** on ServiceNow:

| | Asset (`alm_asset` → `alm_hardware`) | Configuration Item (`cmdb_ci` → `cmdb_ci_computer`) |
|---|---|---|
| Question it answers | *What do we own, what did it cost, who has it?* | *What is it, how is it configured, what depends on it?* |
| Owned by | Asset management / finance | IT operations / service owners |
| Typical fields | Asset tag, cost, PO, stockroom, warranty, lease, depreciation, assigned to | Hostname, IP, OS, CPU/RAM, relationships, support group |
| Lifecycle | Financial / physical: on order → in stock → in use → retired → disposed | Operational: installed → in maintenance → retired |
| Typical source | Procurement, receiving, manual, HAM workflows | Discovery, Service Graph Connectors, integrations (through IRE) |

**Rule of thumb:** the asset is about **ownership and money**; the CI is about **operations and
dependencies**. Some things are only assets (a software license, a cheap consumable). Some are only
CIs (a business application, a cluster). Most hardware is both.

## How the two are linked

- `alm_asset.ci` → reference to the CI
- `cmdb_ci.asset` → reference back to the asset

These two references are kept in sync by the platform. If you see one pointing somewhere and the
other empty or pointing elsewhere, you have a data problem, usually caused by a script or
integration that bypassed the platform logic.

## Model categories: the glue

A **model category** (`cmdb_model_category`) defines, for a type of hardware:

- the **asset class** to use (e.g. `alm_hardware`)
- the **CI class** to use (e.g. `cmdb_ci_computer`)

When a record is created and its model's category has both classes filled in, the platform
**creates the counterpart automatically**:

- Create a hardware asset → a CI is created
- A CI is created (e.g. by Discovery) → an asset is created

If the category has **no CI class**, the asset lives alone. This is correct for things you don't
want in the CMDB.

> **Developer takeaway:** a wrong or missing model category is one of the most common root causes
> of "assets without CIs" and "CIs without assets". Check the model and its category before you
> write a fix script.

## Keeping fields in sync

Some fields exist on both sides (serial number, assigned to, location…). Two configuration areas
control this. Look them up in your PDI via the application navigator:

- **Asset-CI Field Mapping**: which asset field maps to which CI field. When one side changes,
  the mapped field on the other side is updated.
- **Asset-CI Install Status Mapping**: how the asset **State / Substate** translates to the CI
  **Status** (and back). Example: asset *Retired / Disposed* ↔ CI *Retired*.

Adding a custom field? Decide whether it belongs on the asset, the CI, or both. If both, add a
mapping instead of writing a business rule.

## Common anti-patterns (things to spot at work)

1. **GlideRecord inserts straight into `cmdb_ci_*` from integrations.** This bypasses IRE, which
   creates duplicates and ignores data source precedence. Use `sn_cmdb.IdentificationEngine`
   or an IntegrationHub ETL/Service Graph Connector instead (Module 5).
2. **`setWorkflow(false)` in fix scripts on asset/CI tables.** This silently skips the sync
   business rules, so the asset and CI drift apart.
3. **Using the CI for financial data** (cost, PO) or the asset for technical data (IP, OS).
4. **Custom business rules to copy fields** when a field mapping would do it.
5. **Model sprawl** (`Dell Latitude 5440`, `DELL LAT 5440`, `Latitude 5440 Laptop`). This breaks
   reporting, refresh planning and model-category logic (Module 2).

## Check yourself

Answer in your own words (write your answers in `journal/`):

1. A CI was created by Discovery, but no asset appeared. Name two possible causes.
2. Where would you store the purchase cost of a server, and why not on the other record?
3. An integration team wants to insert CIs with a nightly GlideRecord script. What do you tell them?
4. A laptop asset is set to *Retired*. What should happen to its CI, and what configuration
   controls that?
5. When would you **want** an asset with no CI?

## Try it in your PDI

1. Open **Product Catalog → Model Categories**, open *Computer* and look at its Asset class and
   CI class.
2. Create a hardware asset with a Computer model and confirm a CI was created and linked.
3. Change the asset State to *Retired* and check what happened to the CI Status.
4. Find the field mapping and install status mapping modules and read the entries.

Next: [Data-quality exercise](../03-data/01-data-quality-exercise.md)
