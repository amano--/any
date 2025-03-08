# Project Rule Settings

## Language Policy

### Responses and Commits

- AI responses should be in Japanese
- Commit messages should be written in Japanese
- Pull request titles and bodies should be in Japanese

# Security

## Confidential Files

The following files are restricted from reading and modification:

- .env files
- All files containing API keys, tokens, and authentication information

## Security Measures

- Never commit confidential files
- Use environment variables for secret information
- Do not include authentication information in logs or output

## 1. Prompt Trigger List

### 1.1 Regular Update Triggers

1. Weekly Report Regular Update (Details: [weekly-report-update.md](/docs/setup/cline/rules/task/weekly-report-update.md))
   - System trigger times: 9:00, 11:00, 13:00, 15:00, 17:00, 19:00, 21:00
   - Manual trigger: "Weekly Report Update"

2. Work Completion (Trigger: "Good work")
   - Knowledge summary creation
   - Memory bank update
   - ADR creation assessment and creation (if necessary)
   - Weekly report final update
   - Commit and push

### 1.2 Knowledge Update (Automatic Detection or "Knowledge Update")

- Triggers:
  1. Automatic detection: When text contains the following keywords
     - "Issues have been clarified"
     - "Important discoveries have been made"
     - "Knowledge has been gained"
     - "Improvements have been found"
  2. Manual: "Knowledge Update" keyword
- Process: Execute knowledge summary creation only

### 1.3 ADR Creation (Automatic Detection or "Create ADR")

- Triggers:
  1. Automatic detection: When text contains the following keywords
     - "Design policy has been decided"
     - "Architecture change decided"
     - "Important decision has been made"
     - "Decided to change to ~"
     - "Will proceed with ~ policy"
  2. Manual: "Create ADR" keyword
- Process: Execute ADR creation only

### 1.4 Guideline Revision (Trigger: "Guide Revision")

1. Work review and contemplation
2. Revision following existing guidelines

## 2. Task Details

For detailed weekly report update procedures, please refer to [weekly-report-update.md](/docs/setup/cline/rules/task/weekly-report-update.md).

### 2.1 Knowledge Summary Creation

```
Location: docs/team/[teamName]/logs/ai/knowledge/[developmentPhase]/YYYY-MM/YYYY-MM-DD-HH-[contentTitleInEnglish].md
Procedure:
1. Pre-summary Review
   - Review overall implementation content
   - List important decision points
   - Organize identified issues

2. Contemplation Process
   - Deep dive into each decision's rationale
   - Organize options and comparison content
   - Analyze lessons learned

3. Summary Creation
   - Specific issues and solutions
   - Technical decisions and their rationale
   - Improvement proposals and alternatives
   - Next step proposals
```

### 2.2 Memory Bank Update

### 2.3 ADR Creation

```
Location: docs/team/[teamName]/logs/ai/adr/[ADRStatus]/[developmentPhase]/YYYY/YYYY-MM-DD-[decisionContentInEnglish].md

ADR Status:
- proposed: Under proposal
- accepted: Approved
- rejected: Rejected
- deprecated: Deprecated
- superseded: Alternative adopted

Conditions: Create when decision falls under any of the following
1. Decisions affecting architecture
   - System structure changes
   - Component relationship changes
   - Important interface changes

2. Important pattern or convention changes
   - Design pattern adoption
   - Coding convention changes
   - Naming convention changes

3. Team collaboration method changes
   - Development process changes
   - Communication method changes
   - Role assignment changes

4. Technology selections affecting the entire system
   - Framework selection
   - Library adoption
   - Tool chain changes

Record Items:
1. Status (proposed/accepted/rejected/deprecated/superseded)
2. Background and reasons for decision
3. Considered alternatives
4. Impact analysis
5. Implementation procedure
```

### 2.4 Weekly Report Creation and Update

For detailed weekly report creation and update procedures, please refer to [weekly-report-update.md](/docs/setup/cline/rules/task/weekly-report-update.md).
