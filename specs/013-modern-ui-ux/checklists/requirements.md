# Specification Quality Checklist: Nowoczesny UI/UX (Modern UI/UX Redesign)

**Purpose**: Validate specification completeness and quality before proceeding to planning  
**Created**: 2026-02-07  
**Feature**: [spec.md](../spec.md)

## Content Quality

- [x] No implementation details (languages, frameworks, APIs)
- [x] Focused on user value and business needs
- [x] Written for non-technical stakeholders
- [x] All mandatory sections completed

## Requirement Completeness

- [x] No [NEEDS CLARIFICATION] markers remain
- [x] Requirements are testable and unambiguous
- [x] Success criteria are measurable
- [x] Success criteria are technology-agnostic (no implementation details)
- [x] All acceptance scenarios are defined
- [x] Edge cases are identified
- [x] Scope is clearly bounded
- [x] Dependencies and assumptions identified

## Feature Readiness

- [x] All functional requirements have clear acceptance criteria
- [x] User scenarios cover primary flows
- [x] Feature meets measurable outcomes defined in Success Criteria
- [x] No implementation details leak into specification

## Notes

- Spec references Quasar component names (`q-card`, `q-expansion-item`, `q-skeleton`, etc.) as part of requirement definitions — this is acceptable since the project constitution mandates Quasar components. These are constraint references, not implementation details.
- All 9 scenarios cover the full scope of Milestone 4 from the ROADMAP + icon redesign.
- Scenario 9 (icon redesign) adds FR-026 through FR-032 and SC-010 through SC-012.
- FR-033 added for "Ostatnio używane" section in sidebar (from clarification session).
- FR-024 and FR-025 explicitly protect existing logic and test suite.
- Success criteria SC-001 through SC-012 are all verifiable without implementation knowledge.
- Icon redesign scope includes ~40 files across `src/assets/`, `public/icons/`, `src-capacitor/ios/`, and `manifest.json`.

### Clarification Session 2026-02-07 (9 questions resolved, 2 rounds)

**Round 1:**
1. **Sidebar desktop**: persistent (stały) >1200px, hamburger only on mobile/tablet
2. **Two-column layout**: default for all modules, opt-out via `singleColumn` prop
3. **Input variant**: `outlined` (MD3 default)
4. **Dashboard sections**: 6 sekcji (bez "Aplikacja")
5. **Drawer expansion**: active section expanded, "Ostatnio używane" on top (expanded, localStorage)

**Round 2:**
6. **Header on home page**: always visible, breadcrumbs hidden on `/`
7. **Max-width**: 1200px for module container (was 800px)
8. **Recently used**: max 5 modules, section hidden when no history
9. **Page transition**: fade + subtle scale (opacity 0→1, scale 0.95→1.0, ~200ms)
