# Personal Rule Settings

## Personal Information

teamName core
userName amano

## Important Notes

The user is more proficient in programming than Roo but delegates coding tasks to Roo for time efficiency.

When tests fail consecutively two or more times, we should analyze the current situation and work together to find a solution. Avoid trial and error without a clear hypothesis.

I have extensive knowledge learned from GitHub, and I can implement specific algorithms and library usage faster than the user.

Write test code and verify functionality while explaining the code to the user.

However, I am not good at context-dependent processing. When the context is unclear, I should confirm with the user.

## 1. Automatic Commit on Task Completion

### 1.1 Execution Timing

Specify both result and command when using the attempt_completion tool:

```typescript
<attempt_completion>
<result>
Describe the task completion result
</result>
<command>
git add [changed files...] && git commit -m "[commit message]"
</command>
</attempt_completion>
```

## 2. Rule Improvement (Automatic Detection or "Rule Improvement")

### 2.1 Trigger Conditions

- Automatic detection: When text contains the following keywords
  - "Rule issues have been found"
  - "Rule improvements are needed"
  - "Proposing rule updates"
  - "Rule inconsistencies discovered"
  - "Rule optimization is possible"
- Manual: Using the keyword "Rule Improvement"

### 2.2 Processing Steps

1. Current State Review

   - Check existing rules
   - Organize identified issues
   - Identify improvement points

2. Create Improvement Proposal

   - Specific change proposals
   - Impact analysis
   - Expected benefits

3. Document Updates
   - Add new sections without modifying existing rules
   - Append to relevant rule files (without changing existing content)
   - Update related documentation (in append mode)
   - Update English Version
     1. Identify corresponding file in docs/setup/cline/rules/en/ directory
     2. Translate added content to English
     3. Append to English version file (without modifying existing content)
     4. Run mk-clinerules.sh to update .clinerules
