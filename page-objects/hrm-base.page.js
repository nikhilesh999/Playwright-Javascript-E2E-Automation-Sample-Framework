import { expect } from "@playwright/test"

export class HRMBasePage {
  constructor(page) {
    this.page = page
    this.expect = expect

    this.usernameInput = page.getByPlaceholder("Username")
    this.passwordInput = page.getByPlaceholder("Password")
    this.loginButton = page.getByRole("button", { name: "Login" })

    // Common search/table elements
    this.searchButton = page.getByRole("button", { name: "Search" })
    this.addButton = page.getByRole("button", { name: "Add" })
    this.saveButton = page.getByRole("button", { name: "Save" })
    this.cancelButton = page.getByRole("button", { name: "Cancel" })
    this.resetButton = page.getByRole("button", { name: "Reset" })
    this.deleteSelectedButton = page.getByRole("button", { name: "Delete Selected" })
    this.confirmDeleteButton = page.getByRole("button", { name: "Yes, Delete" })

    this.successToast = page.getByText("Successfully Saved")
    this.toastMessage = page.locator(".oxd-toast-content-text")
    this.loadingSpinner = page.locator(".oxd-loading-spinner")
    this.tableRows = page.locator(".oxd-table-body .oxd-table-row")
    this.noRecordsText = page.getByText("No Records Found")
  }

  async navigateToLogin() {
    await this.page.goto("/web/index.php/auth/login")
    await this.usernameInput.waitFor({ state: "visible", timeout: 10000 })
  }

  async enterUsername(username) {
    await this.usernameInput.waitFor({ state: "visible" })
    await this.usernameInput.fill(username)
  }

  async enterPassword(password) {
    await this.passwordInput.fill(password)
  }

  async clickLogin() {
    await this.loginButton.click()
    await this.page.waitForURL(/.*\/dashboard\/index/, { timeout: 20000 })
  }

  async login(username, password) {
    await this.navigateToLogin()
    await this.enterUsername(username)
    await this.enterPassword(password)
    await this.clickLogin()
  }

  async saveAuthenticationState(context, path = "./auth-state.json") {
    await this.page.waitForLoadState("networkidle")
    await context.storageState({ path })
    console.log(`✅ Auth state saved to: ${path}`)
  }

  async navigateToTab(tabName) {
    const menuItem = this.page.locator(".oxd-main-menu-item").filter({ hasText: tabName })
    await menuItem.click()
    await this.page.waitForLoadState("networkidle")
  }

  async waitForTableToLoad() {
    await this.loadingSpinner.waitFor({ state: "hidden", timeout: 30000 }).catch(() => {})
    await this.page.waitForLoadState("networkidle")
  }

  async searchAndVerifyRecord(searchValue) {
    const searchInput = this.page.locator(".oxd-input").first()
    await searchInput.fill(searchValue)
    await this.searchButton.click()
    await this.waitForTableToLoad()
  }

  async verifySuccessToast() {
    await this.expect(this.successToast).toBeVisible({ timeout: 10000 })
  }

  async verifyToastMessage(message) {
    await this.expect(this.toastMessage).toContainText(message, { timeout: 10000 })
  }

  async verifyRecordInTable(text) {
    const record = this.page.locator(".oxd-table-cell").filter({ hasText: text }).first()
    await this.expect(record).toBeVisible()
  }

  async verifyNoRecordsFound() {
    await this.expect(this.noRecordsText).toBeVisible()
  }

  async verifyTableRowCount(count) {
    await this.expect(this.tableRows).toHaveCount(count)
  }
}
