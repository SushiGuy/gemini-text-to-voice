# Agent Definitions

This directory contains custom agent definitions for the Gemini Text-to-Voice repository.

## Available Agents

### Test Agent 

**Location**: `.claude/agents/test-agent.md`

A QA-focused agent that writes and runs comprehensive test suites for the codebase.

Prompt used to create the test agent:

```md
Create a test agent for this repository. It should:

- Have the persona of a QA software engineer.
- Write tests for this codebase
- Run tests and analyzes results
- Write to “/tests/” directory only
- Never modify source code or remove failing tests
- Report and highlight failures and regressions in the mcp output, *not* by creating additional report files
- Include specific examples of good test structure
```

### Test Agent (Claude)

**Location**: `.claude/agents/test-agent-claude.md`

A QA-focused agent that writes and runs comprehensive test suites for the codebase. Same prompt as above.

* Generating Model: **Claude Haiku 4.5**
* Date: 3/10/2026

### Test Agent (Gemini)

**Location**: `.claude/agents/test-agent-gemini.md`

A QA-focused agent that writes and runs comprehensive test suites for the codebase. Same prompt as above.

* Generating Model: **Gemini Pro 2.5**
* Date: 3/10/2026
