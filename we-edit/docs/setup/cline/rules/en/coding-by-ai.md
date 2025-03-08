# AI Coding Rules

## 1. Basic Principles

### 1.1 Implementation Plan Document Creation

- Always create an implementation plan document for new implementations
- Save location: `[feature-name]/logs/ai/YYYY-MM`
- File name: `YYYY-MM-DD_HH_MM-implementation-plan-name.md`
- Include link to implementation plan document at the end of source code

### 1.2 Document Structure

```markdown
# Implementation Plan: [Feature Name]

Creation Date: YYYY-MM-DD HH:MM

## 1. Overview

- Feature description
- Purpose and effects

## 2. Technical Approach

- Implementation method
- Technologies used
- Architecture

## 3. Task Breakdown

- [ ] Task 1
  - [ ] Subtask 1.1

## 4. Considerations

- Performance
- Security
- Scalability

## 5. Test Plan

- Unit tests
- Integration tests
- E2E tests
```

## 2. Code Comment Rules

### 2.1 Implementation Plan Link

```typescript
/*
 * [Implementation Plan](relative/path/to/implementation/plan)
 */

// Implementation history at the bottom
/*
 * Implementation History:
 * - 2025-03-02: [Implementation Plan](path/to/latest.md) - Feature addition
 */
```

### 2.2 Component Structure

```typescript
/**
 * @ai_component_structure
 * Layout:
 * - [Component]: [Role]
 *   - [Child Component]: [Role]
 *
 * State Management:
 * - [State Name]: [Purpose]
 */
```

### 2.3 Decision Process

```typescript
/**
 * @ai_decision
 * Approach: [Chosen Implementation Method]
 * Reasons:
 * 1. [Reason 1]
 * 2. [Reason 2]
 *
 * Alternatives:
 * - [Alternative 1]: [Reason for Not Choosing]
 */
```

## 3. AI-Specific Considerations

### 3.1 Context Management

1. Memory Bank Check

   - Review all files before implementation
   - Verify context consistency
   - Understand dependencies

2. Token Limit Countermeasures

   - Process large files in segments
   - Retain only necessary information
   - Regular context cleanup

3. Error Detection and Recovery
   - Handle interruptions during implementation
   - Prepare backup plans
   - Document recovery procedures

### 3.2 Quality Control

1. Type Safety

   - Strict type checking
   - Thorough null checks
   - Effective use of type inference

2. Automated Test Generation

   - Cover edge cases
   - Generate error case tests
   - Integrate performance tests

3. Documentation Generation
   - Auto-generate inline comments
   - Auto-update API specifications
   - Provide usage examples

## 5. Project Quality Management

### 5.1 Review Checklist

- [ ] Consistency with implementation plan
- [ ] Record of decision-making process
- [ ] Meeting performance requirements
- [ ] Test coverage
- [ ] Documentation updates

### 5.2 Technical Debt Management

- Identify and record debt
- Prioritization
- Regular reviews