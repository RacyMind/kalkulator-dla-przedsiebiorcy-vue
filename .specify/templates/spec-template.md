# Feature Specification: [FEATURE NAME]

**Branch**: `[###-feature-name]`  
**Created**: [DATE]  
**Status**: Draft  
**Input**: User description: "$ARGUMENTS"

## User Scenarios *(required)*

<!--
  Scenarios ordered by priority.
  Each scenario should be independently testable.
  P1 = highest priority (MVP)
-->

### Scenario 1 - [Title] (Priority: P1) 🎯 MVP

[Scenario description in natural language]

**Priority Justification**: [Why this priority]

**Independent Test**: [How to test this scenario independently]

**Acceptance Criteria**:

1. **Given** [initial state], **When** [action], **Then** [expected result]
2. **Given** [initial state], **When** [action], **Then** [expected result]

**Calculation Example**:
```
Input data:
- [param1]: [value]
- [param2]: [value]

Expected results:
- [result1]: [value]
- [result2]: [value]
```

---

### Scenario 2 - [Title] (Priority: P2)

[Scenario description]

**Priority Justification**: [Why this priority]

**Acceptance Criteria**:

1. **Given** [initial state], **When** [action], **Then** [expected result]

---

[Add more scenarios as needed]

### Edge Cases

- What if user enters negative value?
- What if limits are exceeded (e.g., ZUS limit)?
- How to handle tax year change?

## Requirements *(required)*

### Functional Requirements

- **FR-001**: Calculator MUST [specific function]
- **FR-002**: Calculator MUST validate input using `validationRules`
- **FR-003**: Calculator MUST use `BasicCalculator` class as base
- **FR-004**: UI MUST use Quasar components
- **FR-005**: All UI text MUST be in Polish language

### Calculation Requirements

- **CR-001**: Calculations MUST use current rates from `constants.ts`
- **CR-002**: Results MUST be rounded to 2 decimal places (grosze)
- **CR-003**: Tests MUST include all output values

### Key Entities

- **[Entity 1]**: [What it represents, key attributes]
- **[Entity 2]**: [What it represents, relations with other entities]

## Success Criteria *(required)*

### Measurable Outcomes

- **SC-001**: User can complete calculation in less than 3 clicks
- **SC-002**: Calculation results match official calculators (ZUS, US)
- **SC-003**: All unit tests pass with correct values
- **SC-004**: UI works correctly on mobile and desktop devices
