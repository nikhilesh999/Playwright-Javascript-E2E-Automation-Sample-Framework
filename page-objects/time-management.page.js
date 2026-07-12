import { HRMBasePage } from "./hrm-base.page.js"

export class TimeManagementPage extends HRMBasePage {
  constructor(page) {
    super(page)

    // Timesheet navigation
    this.editTimesheetButton = page.getByRole("button", { name: "Edit" })
    this.submitTimesheetButton = page.getByRole("button", { name: "Submit" })
    this.approveButton = page.getByRole("button", { name: "Approve" })
    this.rejectButton = page.getByRole("button", { name: "Reject" })
    this.resetTimesheetButton = page.getByRole("button", { name: "Reset" })

    // Employee timesheets search
    this.employeeNameInput = page.getByPlaceholder("Type for hints...")
    this.timesheetDateInput = page.locator("input[placeholder='yyyy-dd-mm']").first()

    // My Timesheet uses a standard HTML table, not .oxd-table
    this.timesheetTable = page.getByRole("table")
    this.projectDropdown = page.locator(".oxd-select-text").first()
    this.activityDropdown = page.locator(".oxd-select-text").last()

    this.confirmActionButton = page.getByRole("button", { name: "Ok" })
    this.requiredError = page.locator(".oxd-input-field-error-message").first()
  }

  async navigateToMyTimesheets() {
    await this.page.goto("/web/index.php/time/viewMyTimesheet")
    await this.page.waitForLoadState("networkidle")
  }

  async navigateToEmployeeTimesheets() {
    await this.page.goto("/web/index.php/time/viewEmployeeTimesheet")
    await this.page.waitForLoadState("networkidle")
  }

  async navigateToPreviousTimesheet() {
    // Icon-only chevron-left button before the date range input
    const previousButton = this.page.locator("button:has(i.bi-chevron-left)").first()
    await previousButton.click()
    await this.page.waitForLoadState("networkidle")
  }

  async navigateToNextTimesheet() {
    // Icon-only chevron-right button after the date range input
    const nextButton = this.page.locator("button:has(i.bi-chevron-right)").first()
    await nextButton.click()
    await this.page.waitForLoadState("networkidle")
  }

  async clickEditTimesheet() {
    await this.editTimesheetButton.click()
    await this.page.waitForLoadState("networkidle")
  }

  async clickSubmitTimesheet() {
    await this.submitTimesheetButton.click()
  }

  async confirmAction() {
    await this.confirmActionButton.click()
    await this.waitForTableToLoad()
  }

  async searchEmployeeTimesheet(employeeName) {
    await this.employeeNameInput.fill(employeeName)
    await this.page.waitForTimeout(500)
    const suggestion = this.page.locator(".oxd-autocomplete-option").first()
    await suggestion.waitFor({ state: "visible", timeout: 5000 })
    await suggestion.click()
    await this.page.getByRole("button", { name: "View" }).first().click()
    await this.page.waitForLoadState("networkidle")
  }

  async verifyMyTimesheetPageTitle() {
    await this.expect(this.page.getByRole("heading", { name: /My Timesheet/i })).toBeVisible()
  }

  async verifyEmployeeTimesheetPageTitle() {
    // Employee Timesheets page shows "Select Employee" as the main card heading
    await this.expect(this.page.getByRole("heading", { name: /Select Employee/i })).toBeVisible()
  }

  async verifyTimesheetTableIsVisible() {
    await this.expect(this.timesheetTable).toBeVisible()
  }

  async verifyEditButtonIsVisible() {
    await this.expect(this.editTimesheetButton).toBeVisible()
  }

  async verifySubmitButtonIsVisible() {
    await this.expect(this.submitTimesheetButton).toBeVisible()
  }

  async verifyTimesheetStatus(status) {
    const statusBadge = this.page.locator(".oxd-chip").filter({ hasText: status })
    await this.expect(statusBadge).toBeVisible()
  }
}
