# Git Operation Rules

## Commit Message Convention

### 1. Basic Structure

<type>(<scope>): <subject>

<body>

<footer>

# Prompt History

<prompt_history>

### 2. Element Descriptions

#### Type

- Compliant with Conventional Commits

#### Scope

- Indicates the scope of changes
- Multiple scopes are separated by commas
- Optional for global changes

#### Subject

- Concise summary of changes

#### Body

- Compliant with Conventional Comments
- Detailed explanation of changes
- Can be written in multiple lines with line breaks
- Include background on why the change was necessary
- Line break at 72 characters

#### Prompt History

- Include history of user-provided prompts
- Include additional context information related to prompts

### 3. Commit Message Example

feature(reviews): Add document review approval functionality

- Implement review approval workflow
- Add approval condition validation
- Implement approval history tracking

# Prompt History

1. Q: Please implement the post functionality
   A: Implemented posting and added posting condition validation

2. Q: Please also add posting history
   A: Implemented post history tracking functionality and added history data storage and display features

### 4. Commit Message Command Restrictions

- When creating a commit message, do not execute commands
- Only provide the created message content as a response
- Command execution must be done manually by the user

### 5. Commit Message Creation Procedure

1. Verify after code changes

   - Confirm successful build with yarn run build
   - Confirm successful tests for modified files with yarn run test:unit

2. Create message content in commit_message.txt file

   - Write message following the basic structure above
   - Always include prompt history
   - Appropriately summarize changes

3. Provide created message content as response
   - Do not execute commands
   - User manually executes commit

### 6. Important Notes

- Include only one logical change per commit
- Split multiple changes into multiple commits
- Commit messages can be written in Japanese
- Always include prompt history for change traceability
- Use commit_message.txt as a temporary file

## Pull Request Creation Convention

### 1. Basic Rules

- Base branch is fixed to development
- Title and body are written in Japanese

### 2. Title and Body Creation

#### Title

- Concisely summarize commit contents in the branch
- Format: `commit-type: summary of changes`
- Example: `feature: Add document review approval functionality`

#### Body

- List major changes extracted from commit history
- Include background and purpose of changes
- Include test execution results and operation verification results

### 3. Pull Request Command Restrictions

- When creating a pull request command, do not execute commands
- Only provide the created command content as a response
- Command execution must be done manually by the user

### 4. Using gh Command

# Get current branch name

current_branch=$(git branch --show-current)

# Pull request creation command

gh pr create \
 --base development \
 --head "$current_branch" \
 --title "[Commit Type] Change Summary" \
 --body "## Changes

- Change 1
- Change 2
- Change 3

## Background and Purpose

- Background explanation
- Purpose explanation

## Test Results

- [ ] Unit tests executed
- [ ] Operation verified

### 4. Review Request Notes

- Clearly state points requiring special attention
- Add supplementary explanations for complex code sections"