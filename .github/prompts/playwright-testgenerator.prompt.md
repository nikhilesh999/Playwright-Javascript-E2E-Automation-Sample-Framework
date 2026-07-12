---
agent: 'agent'
description: 'Generate a Playwright test based on the provided scenario.'
model: Claude Sonnet 4.5
---

# Test Generation with Playwright MCP

Your goal is to generate a Playwright test based on the provided scenario after completing all prescribed steps.

## Specific Instructions

- You are given a scenario, and you need to generate a playwright test for it. If the user does not provide a scenario, you will ask them to provide one.
- DO NOT generate test code prematurely or based solely on the scenario without completing all prescribed steps.
- Do run steps one by one using the tools provided by the playwright mcp only.
- Only after all steps are executed, emit a playwright javascript test that:
    1. uses @playwright/test based on message history
    2. uses page object model in organizing tests by complying with existing fixture modal
- Save generated test file in the tests directory and associated page objects in the page-objects directory
- Execute the test file using project: "chromium" in headed mode and iterate until the test passes, use mcp tools if locator update is needed during iteration.
