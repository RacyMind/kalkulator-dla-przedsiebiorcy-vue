---
name: kalkulator-feature-planner
description: Plan new features or feature extensions for the kalkulator-finansowy repository and save a Polish plan in plans/<feature-slug>-YYYY-MM-DD.md. Use when the user asks for a new calculator, a new module, a UI or logic extension, or a scoped feature plan for this repo.
---

# Kalkulator Feature Planner

Read `../../../instructions.md`.

Load:

- `../../../references/repo-patterns.md` before deciding whether this is a new module or an extension
- `../../../references/plan-template.md` before writing the final plan
- `../../../references/source-checklist.md` whenever the brief touches current rules, taxes, limits, rates, external data, APIs, or anything else that may have changed

Always:

- save the final plan in `plans/<feature-slug>-YYYY-MM-DD.md`
- write the plan in Polish
- plan only; do not implement production code
- use exact dates and links in `## Źródła` when external verification is required

If sub-agents are available, follow the workstreams defined in `../instructions.md`. If they are not, execute the same analysis sequentially and keep the output structure unchanged.
