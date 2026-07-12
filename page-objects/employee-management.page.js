import { HRMBasePage } from "./hrm-base.page.js"

export class EmployeeManagementPage extends HRMBasePage {
  constructor(page) {
    super(page)

    this.employeeNameInput = page.getByPlaceholder("Type for hints...").first()
    this.employeeIdInput = page.locator(".oxd-input").nth(1)
    this.employmentStatusDropdown = page.locator(".oxd-select-text").first()
    this.includeEmployeesDropdown = page.locator(".oxd-select-text").nth(1)
    this.jobTitleDropdown = page.locator(".oxd-select-text").nth(2)
    this.subUnitDropdown = page.locator(".oxd-select-text").nth(3)

    // Add Employee form
    this.firstNameInput = page.locator("input[name='firstName']")
    this.middleNameInput = page.locator("input[name='middleName']")
    this.lastNameInput = page.locator("input[name='lastName']")
    this.newEmployeeIdInput = page.locator(".orangehrm-card-container input.oxd-input").nth(1)
    this.createLoginToggle = page.locator(".oxd-switch-input")
    this.usernameInput = page.locator("input[autocomplete='off']").first()
    this.newPasswordInput = page.locator("input[type='password']").first()
    this.confirmPasswordInput = page.locator("input[type='password']").last()

    this.requiredError = page.locator(".oxd-input-field-error-message").first()
  }

  async navigateToEmployeeList() {
    await this.page.goto("/web/index.php/pim/viewEmployeeList")
    await this.waitForTableToLoad()
  }

  async navigateToAddEmployee() {
    await this.page.goto("/web/index.php/pim/addEmployee")
    await this.page.waitForLoadState("networkidle")
  }

  async searchEmployeeByName(name) {
    await this.employeeNameInput.fill(name)
    await this.page.waitForTimeout(500)
    const suggestion = this.page.locator(".oxd-autocomplete-option").first()
    const hasSuggestion = await suggestion.isVisible({ timeout: 3000 }).catch(() => false)
    if (hasSuggestion) {
      await suggestion.click()
    }
  }

  async searchEmployeeById(employeeId) {
    await this.employeeIdInput.fill(employeeId)
  }

  async clickSearch() {
    await this.searchButton.click()
    await this.waitForTableToLoad()
  }

  async clickReset() {
    await this.resetButton.click()
    await this.waitForTableToLoad()
  }

  async clickAddEmployee() {
    await this.addButton.click()
    await this.page.waitForLoadState("networkidle")
  }

  async enterFirstName(firstName) {
    await this.firstNameInput.waitFor({ state: "visible" })
    await this.firstNameInput.fill(firstName)
  }

  async enterMiddleName(middleName) {
    await this.middleNameInput.fill(middleName)
  }

  async enterLastName(lastName) {
    await this.lastNameInput.fill(lastName)
  }

  async clickSaveEmployee() {
    await this.saveButton.click()
    await this.page.waitForLoadState("networkidle")
  }

  async verifyEmployeeListPageTitle() {
    await this.expect(this.page.getByRole("heading", { name: /Employee Information/i })).toBeVisible()
  }

  async verifyAddEmployeePageTitle() {
    await this.expect(this.page.getByRole("heading", { name: /Add Employee/i })).toBeVisible()
  }

  async verifyEmployeeInTable(name) {
    await this.verifyRecordInTable(name)
  }

  async verifyRequiredError() {
    await this.expect(this.requiredError).toBeVisible()
    await this.expect(this.requiredError).toHaveText("Required")
  }

  async verifyEmployeeProfilePageLoaded() {
    const heading = this.page.getByRole("heading", { name: "Personal Details" })
    await this.expect(heading).toBeVisible({ timeout: 10000 })
  }

  async verifyEmployeeIdIsVisible() {
    await this.expect(this.newEmployeeIdInput).toBeVisible()
  }

  async getEmployeeIdValue() {
    return await this.newEmployeeIdInput.inputValue()
  }
}
