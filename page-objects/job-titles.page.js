import { HRMBasePage } from "./hrm-base.page.js"

export class JobTitlesPage extends HRMBasePage {
  constructor(page) {
    super(page)

    this.jobTitleInput = page.locator("input[placeholder='Type for hints...']").first()
    this.jobDescriptionTextarea = page.locator(".oxd-textarea").first()
    this.noteTextarea = page.locator(".oxd-textarea").last()
    this.requiredError = page.locator(".oxd-input-field-error-message").first()
    this.jobTitleNameInput = page.locator(".oxd-input").first()
  }

  async navigateToJobTitles() {
    await this.page.goto("/web/index.php/admin/viewJobTitleList")
    await this.waitForTableToLoad()
  }

  async clickAddJobTitle() {
    await this.addButton.click()
    await this.page.waitForLoadState("networkidle")
  }

  async enterJobTitle(title) {
    await this.jobTitleNameInput.waitFor({ state: "visible" })
    await this.jobTitleNameInput.fill(title)
  }

  async enterJobDescription(description) {
    await this.jobDescriptionTextarea.fill(description)
  }

  async enterNote(note) {
    await this.noteTextarea.fill(note)
  }

  async clickSaveJobTitle() {
    await this.saveButton.click()
  }

  async clickCancelJobTitle() {
    await this.cancelButton.click()
  }

  async verifyJobTitlePageTitle() {
    await this.expect(this.page.getByRole("heading", { name: /Job Title/i }).first()).toBeVisible()
  }

  async verifyAddJobTitlePageTitle() {
    await this.expect(this.page.getByRole("heading", { name: /Add Job Title/i })).toBeVisible()
  }

  async verifyJobTitleInTable(title) {
    await this.verifyRecordInTable(title)
  }

  async verifyRequiredError() {
    await this.expect(this.requiredError).toBeVisible()
    await this.expect(this.requiredError).toHaveText("Required")
  }

  async verifyJobTitleNameInputIsVisible() {
    await this.expect(this.jobTitleNameInput).toBeVisible()
  }

  async verifyJobDescriptionInputIsVisible() {
    await this.expect(this.jobDescriptionTextarea).toBeVisible()
  }

  async deleteJobTitleByName(name) {
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
}
