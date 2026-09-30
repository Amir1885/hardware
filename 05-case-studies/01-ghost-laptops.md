# Case study 1 — The ghost laptops

## Scenario

You are the ServiceNow developer at a 3,000-employee company. The IT asset manager comes to you:

> "Finance ran a reconciliation. We have **2,950 laptops** in ServiceNow as *In use*, but Intune
> only reports **2,610** managed laptops. On top of that, Discovery keeps creating laptop CIs that
> have no asset, about 40 a month. Audit is in 6 weeks. Can you help?"

What you find when you look:

- Laptops are received manually by the service desk. They create the asset from a form, and
  sometimes pick the wrong model.
- An Intune integration was built 2 years ago. It's a scheduled script that inserts and updates
  `cmdb_ci_computer` directly with GlideRecord, matching on `name`.
- Offboarding closes the HR case but has no task to collect the laptop.
- Nobody owns the CMDB Health dashboard. The computer class correctness score is 61%.

## Your deliverable

Write your answer in `05-case-studies/my-answers/01-ghost-laptops.md`:

1. **Diagnosis:** list the likely causes of (a) the 340-laptop gap and (b) the CIs without
   assets. Link each cause to a fact in the scenario.
2. **Investigation plan:** which queries or reports would you run *first* to size each cause?
3. **Short-term fix (before the audit):** what do you do in the next 6 weeks? Be realistic.
4. **Long-term fix:** platform changes (IRE, identification rules, model categories, data sources,
   lifecycle flows, Data Manager policies, health ownership). What would you build, and in what
   order?
5. **KPIs:** 3 to 5 measures to show the problem is fixed and stays fixed.

Then ask Claude: *"Review my case study 1 answer as if you were a senior ITAM/CMDB architect."*
