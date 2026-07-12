import { HRMBasePage } from "./hrm-base.page.js"

export class PayGradesPage extends HRMBasePage {
  constructor(page) {
    super(page)

    this.payGradeNameInput = page.locator(".oxd-input").first()
    this.addCurrencyButton = page.getByRole("button", { name: "Add" }).last()
    this.currencyDropdown = page.locator(".oxd-select-text").first()
    this.minSalaryInput = page.locator("input[placeholder='Min Salary']")
    this.maxSalaryInput = page.locator("input[placeholder='Max Salary']")
    this.requiredError = page.locator(".oxd-input-field-error-message").first()
    this.currencySaveButton = page.locator(".orangehrm-card-container").last().getByRole("button", { name: "Save" })
  }

  async navigateToPayGrades() {
    await this.page.goto("/web/index.php/admin/viewPayGrades")
    await this.waitForTableToLoad()
  }

  async clickAddPayGrade() {
    await this.page.locator("button.oxd-button--secondary", { hasText: "Add" }).click()
    await this.page.waitForLoadState("networkidle")
  }

  async enterPayGradeName(name) {
    await this.payGradeNameInput.waitFor({ state: "visible" })
    await this.payGradeNameInput.fill(name)
  }

  async clickSavePayGrade() {
    await this.saveButton.click()
  }

  async clickCancelPayGrade() {
    await this.cancelButton.click()
  }

  async verifyPayGradeNameInput() {
    await this.expect(this.payGradeNameInput).toBeVisible()
  }

  async verifyRequiredError() {
    await this.expect(this.requiredError).toBeVisible()
    await this.expect(this.requiredError).toHaveText("Required")
  }

  async verifyPayGradeInTable(name) {
    await this.verifyRecordInTable(name)
  }

  async verifyPayGradePageTitle() {
    await this.expect(this.page.getByRole("heading", { name: /Pay Grade/i }).first()).toBeVisible()
  }

  async verifyAddPayGradePageTitle() {
    await this.expect(this.page.getByRole("heading", { name: /Add Pay Grade/i })).toBeVisible()
  }

  async deletePayGradeByName(name) {
    const row = this.page.locator(".oxd-table-row").filter({ hasText: name })
    const deleteBtn = row.locator("button").first()
    await deleteBtn.click()
    await this.confirmDeleteButton.click()
    await this.verifySuccessToast()
  }

  async verifyDeleteConfirmDialog() {
    const dialog = this.page.getByRole("heading", { name: "Are You Sure?" })
    await this.expect(dialog).toBeVisible()
  }

  async addCurrencyToPayGrade(currencyName, minSalary, maxSalary) {
    await this.addCurrencyButton.click()
    await this.page.waitForLoadState("networkidle")
    await this.currencyDropdown.click()
    const option = this.page.getByRole("option", { name: currencyName })
    await option.click()
    await this.minSalaryInput.fill(minSalary.toString())
    await this.maxSalaryInput.fill(maxSalary.toString())
    await this.currencySaveButton.click()
  }
}
