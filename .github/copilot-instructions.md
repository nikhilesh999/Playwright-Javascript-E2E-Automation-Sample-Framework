# OrangeHRM Automation - AI Agent Instructions

## Project Overview
Playwright-based test automation for OrangeHRM Demo application (`https://opensource-demo.orangehrmlive.com`) using Page Object Model with fixture-based dependency injection and persistent authentication.

## Architecture Patterns

### Fixture-Based Page Object Injection
All tests import from `fixtures/page-fixtures.js` which automatically:
- Instantiates page objects (HRMBasePage, PayGradesPage, JobTitlesPage, etc.)
- Navigates to baseURL dashboard (`/web/index.php/dashboard/index`) and waits for networkidle
- Injects page objects into test context via Playwright's `test.extend()`

```javascript
import { test, expect } from "../../fixtures/page-fixtures.js"
// Fixtures auto-provide: page, hrmBasePage, payGradesPage, jobTitlesPage, etc.
// NO manual page.goto("/") needed - fixture handles navigation
```

**Critical**: Tests NEVER instantiate page objects directly - always use fixture injection.

### Page Object Inheritance Pattern
- **HRMBasePage** is the base class containing `this.expect = expect` for assertions
- All page objects extend HRMBasePage to inherit assertion capabilities and shared locators
- Page objects encapsulate **both** locators AND verification methods
- Verification methods use `this.expect` (from HRMBasePage), test code uses `expect` (from fixtures)

```javascript
class PayGradesPage extends HRMBasePage {
  constructor(page) {
    super(page) // MUST call super() to inherit this.expect
    this.payGradeNameInput = page.locator(".oxd-input").first()
  }

  async verifyRequiredError() {
    await this.expect(this.requiredError).toHaveText("Required")
  }
}
```

### Authentication State Management
- **NEVER** run login flows in individual tests - use `test.use({ storageState: "./auth-state.json" })`
- Auth state generated once via `tests/auth-setup.spec.js` (no MFA required)
- All authenticated tests reuse `auth-state.json` for speed
- Credentials: `Admin` / `admin123` (set in `.env`)
- Regenerate auth when sessions expire: `npx playwright test tests/auth-setup.spec.js --headed`

### Test Data Management
- Centralized data in `test-data/employees.js` as exportable constants
- Exports: `employees`, `payGrades`, `jobTitles`, `leaveTypes`
- Use `Date.now().toString().slice(-4)` suffix for unique record names in create tests

## Critical Conventions

### Locator Strategy (Priority Order)
1. **OXD CSS classes** for stable elements: `page.locator(".oxd-input").first()`
   - OrangeHRM uses the OXD design system with stable `.oxd-*` class names
   - Use `.oxd-table-row`, `.oxd-table-cell`, `.oxd-toast--success` etc.
2. **Role-based** for semantic elements: `page.getByRole("button", { name: "Save" })`
3. **Placeholder** for inputs: `page.getByPlaceholder("Type for hints...")`
4. **AVOID** `getByText()` for assertions - use `.oxd-*` classes to prevent false positives
5. **Autocomplete inputs**: Fill, wait 500ms, then click `.oxd-autocomplete-option` first item

### Test Organization Standards
- Group related tests in **feature-based** spec files under `tests/<module>/`:
  - `tests/admin/pay-grades.spec.js` - all Pay Grade functionality
  - `tests/admin/job-titles.spec.js` - all Job Title functionality
  - `tests/leave-management/leave-list.spec.js` - leave list and search
  - `tests/leave-management/assign-leave.spec.js` - leave assignment
  - `tests/employee-management/search-employee.spec.js` - PIM employee search
  - `tests/time-management/timesheets.spec.js` - timesheet management
- Use `test.describe()` for feature grouping with `test.beforeEach()` for shared setup
- Test names follow pattern: `"User is able to <action>"` or `"User is unable to <action>"`
- Test bodies stay clean - complex logic moves to page object methods

### Page Object Method Patterns
**Action methods**: Simple, composable operations
```javascript
async clickAddPayGrade() {
  await this.addButton.click()
  await this.page.waitForLoadState("networkidle")
}
```

**Verification methods**: Encapsulate multi-step assertions
```javascript
async verifyPayGradePageTitle() {
  const title = this.page.getByRole("heading", { name: "Pay Grades" })
  await this.expect(title).toBeVisible()
}
```

## Development Workflows

### Running Tests
```bash
# Initial auth setup (run once, or when sessions expire)
npx playwright test tests/auth-setup.spec.js --headed

# Run specific feature in headed mode (for debugging)
npx playwright test tests/admin/pay-grades.spec.js --project=chromium --headed

# Run single test by name
npx playwright test -g "User is able to add a new Pay Grade" --headed

# Run all tests (sequential execution, fullyParallel: false)
npx playwright test
```

### Test Development Pattern (Playwright MCP Workflow)
1. **Explore with MCP browser tools**: `mcp_playwright_browser_navigate`, `mcp_playwright_browser_snapshot`
2. **Identify stable locators**: Use `.oxd-*` classes from OrangeHRM's OXD design system
3. **Add locators to page object**: Prefer `.oxd-*` classes over text-based selectors
4. **Create verification methods**: Group related assertions together
5. **Write test**: Use page object methods, keep test body concise
6. **Run in headed mode**: Validate flow, iterate on timing issues

### Key Configuration Details
- **Base URL**: `https://opensource-demo.orangehrmlive.com` (in `playwright.config.js`)
- **Sequential execution**: `fullyParallel: false`
- **Chromium only**: Default project is `chrome`
- **No MFA**: Auth setup is fast, login is username/password only

## Common Gotchas

1. **Autocomplete fields**: Always wait 500ms after filling, then click `.oxd-autocomplete-option` first
2. **OXD loading spinners**: Use `waitForTableToLoad()` after navigation or search
3. **Multiple dropdowns**: Use `.nth(index)` to select the right `.oxd-select-text`
4. **Success toasts**: Use `{ timeout: 10000 }` - OrangeHRM backend is generally fast
5. **Fixture auto-navigation**: Fixtures call `page.goto("/web/index.php/dashboard/index")` - don't repeat in tests
6. **Unique record names**: Append `Date.now().toString().slice(-4)` to avoid duplicate record errors
7. **Date inputs**: OrangeHRM uses `yyyy-dd-mm` format for date placeholders

## File Structure & Key References
```
orangehrm-automation/
├── fixtures/page-fixtures.js              # Fixture definitions with auto-navigation
├── page-objects/
│   ├── hrm-base.page.js                  # Base class with this.expect and shared methods
│   ├── pay-grades.page.js                # Admin > Pay Grades page
│   ├── job-titles.page.js                # Admin > Job Titles page
│   ├── leave-management.page.js          # Leave List and Assign Leave
│   ├── employee-management.page.js       # PIM > Employee List and Add Employee
│   └── time-management.page.js          # Time > My Timesheets and Employee Timesheets
├── test-data/employees.js                # Centralized employees, payGrades, jobTitles, leaveTypes
├── tests/
│   ├── auth-setup.spec.js               # One-time auth setup (no MFA)
│   ├── admin/
│   │   ├── pay-grades.spec.js           # 6 tests covering Pay Grade flows
│   │   └── job-titles.spec.js           # 7 tests covering Job Title flows
│   ├── leave-management/
│   │   ├── leave-list.spec.js           # 5 tests covering Leave List search/filter
│   │   └── assign-leave.spec.js         # 5 tests covering Assign Leave form
│   ├── employee-management/
│   │   └── search-employee.spec.js      # 7 tests covering Employee search and add
│   └── time-management/
│       └── timesheets.spec.js           # 7 tests covering Timesheet views
├── .github/instructions/
│   └── playwright-javascript.instructions.md  # Test generation guidelines
└── auth-state.json                       # Stored auth (gitignored)
```
