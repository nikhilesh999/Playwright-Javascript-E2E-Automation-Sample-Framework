import { HRMBasePage } from "./hrm-base.page.js"

export class LeaveManagementPage extends HRMBasePage {
  constructor(page) {
    super(page)

    // Leave List filters — Status is first .oxd-select-text, Leave Type is second
    this.leaveStatusDropdown = page.locator(".oxd-select-text").first()
    this.leaveTypeDropdown = page.locator(".oxd-select-text").nth(1)
    this.fromDateInput = page.locator("input[placeholder='yyyy-dd-mm']").first()
    this.toDateInput = page.locator("input[placeholder='yyyy-dd-mm']").last()
    this.employeeNameInput = page.getByPlaceholder("Type for hints...")

    // Assign Leave form
    this.assignLeaveTypeDropdown = page.locator(".oxd-select-text").first()
    this.assignFromDateInput = page.locator("input[placeholder='yyyy-dd-mm']").first()
    this.assignToDateInput = page.locator("input[placeholder='yyyy-dd-mm']").last()
    this.assignCommentTextarea = page.locator(".oxd-textarea")
    this.assignButton = page.getByRole("button", { name: "Assign" })
    this.confirmAssignButton = page.getByRole("button", { name: "Ok" })

    // Table
    this.leaveTable = page.locator(".oxd-table")
    this.statusBadge = page.locator(".oxd-chip")
    this.requiredError = page.locator(".oxd-input-field-error-message").first()
  }

  async navigateToLeaveList() {
    await this.page.goto("/web/index.php/leave/viewLeaveList")
    await this.waitForTableToLoad()
  }

  async navigateToAssignLeave() {
    await this.page.goto("/web/index.php/leave/assignLeave")
    await this.page.waitForLoadState("networkidle")
  }

  async selectLeaveType(leaveType) {
    // On Leave List: leave type is nth(1); on Assign Leave: it is first()
    // Use assignLeaveTypeDropdown when available, fall back to leaveTypeDropdown
    await this.leaveTypeDropdown.click()
    await this.page.getByRole("option", { name: leaveType }).click()
  }

  async selectAssignLeaveType(leaveType) {
    await this.assignLeaveTypeDropdown.click()
    await this.page.getByRole("option", { name: leaveType }).click()
  }

  async selectLeaveStatus(status) {
    await this.leaveStatusDropdown.click()
    await this.page.getByRole("option", { name: status }).click()
  }

  async enterFromDate(date) {
    await this.fromDateInput.fill(date)
    await this.page.keyboard.press("Escape")
  }

  async enterToDate(date) {
    await this.toDateInput.fill(date)
    await this.page.keyboard.press("Escape")
  }

  async enterEmployeeName(name) {
    await this.employeeNameInput.fill(name)
    await this.page.waitForTimeout(500)
    const suggestion = this.page.locator(".oxd-autocomplete-option").first()
    await suggestion.waitFor({ state: "visible", timeout: 5000 })
    await suggestion.click()
  }

  async clickSearch() {
    await this.searchButton.click()
    await this.waitForTableToLoad()
  }

  async clickReset() {
    await this.resetButton.click()
    await this.waitForTableToLoad()
  }

  async verifyLeaveListPageTitle() {
    await this.expect(this.page.getByRole("heading", { name: /Leave List/i })).toBeVisible()
  }

  async verifyAssignLeavePageTitle() {
    await this.expect(this.page.getByRole("heading", { name: /Assign Leave/i })).toBeVisible()
  }

  async verifyLeaveTableIsVisible() {
    await this.expect(this.leaveTable).toBeVisible()
  }

  async verifyRequiredError() {
    await this.expect(this.requiredError).toBeVisible()
    await this.expect(this.requiredError).toHaveText("Required")
  }

  async verifyLeaveStatusInRow(rowIndex, status) {
    const row = this.tableRows.nth(rowIndex)
    const statusCell = row.locator(".oxd-table-cell").last()
    await this.expect(statusCell).toContainText(status)
  }

  async assignLeaveToEmployee(employeeName, leaveType, fromDate, toDate, comment) {
    await this.enterEmployeeName(employeeName)
    await this.selectLeaveType(leaveType)
    await this.enterFromDate(fromDate)
    await this.enterToDate(toDate)
    if (comment) {
      await this.assignCommentTextarea.fill(comment)
    }
    await this.assignButton.click()
  }

  async confirmLeaveAssignment() {
    await this.confirmAssignButton.click()
    await this.waitForTableToLoad()
  }
}
