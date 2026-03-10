# Reference

Test agent sample taken from Github blog post:

[How to write a great agents.md: Lessons from over 2,500 repositories](https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/)

## Prompt (test-agent.md)

Here is the prompt for the test agent, used on 3/10/2026 with Claude Haiku 4.5:

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

## VS Code Setup

[Using agents in Visual Studio Code](https://code.visualstudio.com/docs/copilot/agents/overview)

* Enable agents in VS Code settings with `chat.agents.enable: true`