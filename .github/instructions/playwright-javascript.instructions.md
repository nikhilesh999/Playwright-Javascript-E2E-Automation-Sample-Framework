---
description: 'Playwright test generation instructions'
applyTo: '**'
---

## Test Writing Guidelines

### Code Quality Standards
- **Locators**: Prioritize OXD CSS classes (`.oxd-input`, `.oxd-table-row`, `.oxd-toast--success`) for resilience. Fall back to role-based or placeholder selectors.
- **Page Objects**: Utilize page objects to encapsulate locators and actions for specific pages or components, promoting reusability and maintainability.
- **Assertions**: Use auto-retrying web-first assertions. These assertions start with the `await` keyword (e.g., `await expect(locator).toHaveText()`). Avoid `expect(locator).toBeVisible()` unless specifically testing for visibility changes.
- **Timeouts**: Rely on Playwright's built-in auto-waiting mechanisms. Avoid hard-coded waits except for autocomplete debounce (500ms max).
- **Clarity**: Use descriptive test and step titles that clearly state the intent.


### Test Structure
- **Imports**: Use existing fixtures from the `fixtures/` directory based on application used and test requirements.
- **Use Fixtures**: Use existing fixtures to set up test contexts and dependencies and import page objects through the fixtures.
- **Organization**: Group related tests for a feature under a `test.describe()` block.
- **Titles**: Follow a clear naming convention, such as `"User is able to <action>"` or `"User is unable to <action>"`.


### File Organization
- **Location**: Store all test files in the `tests/` directory. Page Objects in `page-objects/` directory.
- **Naming**: Use the convention `<feature-or-page>.spec.js` (e.g., `pay-grades.spec.js`, `search-employee.spec.js`).
- **Scope**: Aim for one test file per major application feature or page.

### Assertion Best Practices
- **UI Structure**: Use `toMatchAriaSnapshot` to verify the accessibility tree structure of a component.
- **Element Counts**: Use `toHaveCount` to assert the number of elements found by a locator.
- **Text Content**: Use `toHaveText` for exact text matches and `toContainText` for partial matches.
- **Navigation**: Use `toHaveURL` to verify the page URL after an action.


## Example Test Structure

```javascript
const { test, expect } = require("../fixtures/page-fixtures")

test.describe("Admin - Pay Grades", () => {
  test.use({ storageState: "./auth-state.json" })

  test("User is able to add a new Pay Grade", async ({ page, payGradesPage }) => {
    await payGradesPage.navigateToPayGrades()
    await payGradesPage.clickAddPayGrade()
    await payGradesPage.enterPayGradeName("Grade X")
    await payGradesPage.clickSavePayGrade()

    await expect(page).toHaveURL(/.*\/admin\/payGrade\/.*/)
    await payGradesPage.verifySuccessToast()
  })
})
```

## Example Page Object Structure

```javascript
class HRMBasePage {
  constructor(page) {
    this.page = page
    this.expect = expect

    this.usernameInput = page.getByPlaceholder("Username")
    this.passwordInput = page.getByPlaceholder("Password")
    this.loginButton = page.getByRole("button", { name: "Login" })
    this.saveButton = page.getByRole("button", { name: "Save" })
    this.cancelButton = page.getByRole("button", { name: "Cancel" })
    this.successToast = page.locator(".oxd-toast--success")
  }

  async login(username, password) {
    await this.page.goto("/web/index.php/auth/login")
    await this.usernameInput.fill(username)
    await this.passwordInput.fill(password)
    await this.loginButton.click()
    await this.page.waitForURL(/.*\/dashboard\/index/)
  }

  async verifySuccessToast() {
    await this.expect(this.successToast).toBeVisible({ timeout: 10000 })
  }
}
```

## Test Execution Strategy

1. **Initial Run**: Execute tests using "--project=chromium" in headed mode for easier debugging
2. **Debug Failures**: Analyze test failures and identify root causes
3. **Iterate**: Refine locators, assertions, or test logic as needed
4. **Validate**: Ensure tests pass consistently and cover the intended functionality
5. **Report**: Provide feedback on test results and any issues discovered

## Quality Checklist

Before finalizing tests, ensure:
- [ ] All locators use `.oxd-*` classes or role-based selectors
- [ ] Tests are grouped logically and follow a clear structure
- [ ] Assertions are meaningful and reflect user expectations
- [ ] Tests follow `"User is able to / is unable to"` naming convention
- [ ] Code is properly formatted with no unnecessary comments
