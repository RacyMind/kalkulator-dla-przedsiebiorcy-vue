---
name: styleguide-review
description: Read this when reviewing code to ensure it follows the project's code style guide.
---

When reviewing code, check all of the following rules and report all violations. You are not allowed to skip any rules, as all of these are hard requirements that would otherwise be flagged by a human reviewer.

# Simplification

Generally we much prefer simpler code. Before you do anything else, think about if any code can be simplified, and if yes, suggest a simpler implementation.

# Vue.js / TS

- If state is used across multiple components, it should be managed in a composable or pinia store.
- Split up big vue components (> 60 lines of template code) into smaller ones and also move logic into the sub components if possible.
- Use definedModel instead of manually emitting update:modelValue events.
- If functionality can be implemented using vueuse, prefer it over custom implementations.
- Extract shared logic instead of duplicating it. Repeated business rules, save/update flows and state derivation should be moved into shared modules, composables, components, or store actions.
- Design async UI states explicitly. Blocking or risky operations need blocking UX; buttons should be disabled only while the relevant request is in flight; loading/progress/error states must be visible and contextual.
