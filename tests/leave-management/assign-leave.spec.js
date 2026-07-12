import { test, expect } from "../../fixtures/page-fixtures.js"
import { leaveTypes } from "../../test-data/employees.js"

test.describe("Leave Management - Assign Leave", () => {
  test.use({ storageState: "./auth-state.json" })

  test.beforeEach(async ({ page, hrmBasePage }) => {
    await hrmBasePage.navigateToTab("Leave")
    await expect(page).toHaveURL(/.*\/leave\/.*/)
  })

  test("User is able to navigate to Assign Leave page @C020", async ({
    page,
    leaveManagementPage,
  }) => {
    await leaveManagementPage.navigateToAssignLeave()
    await expect(page).toHaveURL(/.*\/leave\/assignLeave/)
    await leaveManagementPage.verifyAssignLeavePageTitle()
  })

  test("User is unable to submit Assign Leave form without required fields @C021", async ({
    page,
    leaveManagementPage,
  }) => {
    await leaveManagementPage.navigateToAssignLeave()
    await expect(page).toHaveURL(/.*\/leave\/assignLeave/)

    // Attempt to assign without filling required fields
    await leaveManagementPage.assignButton.click()

    // Verify required error appears
    await leaveManagementPage.verifyRequiredError()
  })

  test("User is able to see the Assign Leave form fields @C022", async ({
    page,
    leaveManagementPage,
  }) => {
    await leaveManagementPage.navigateToAssignLeave()
    await expect(page).toHaveURL(/.*\/leave\/assignLeave/)

    // Verify key form elements are visible
    await expect(leaveManagementPage.employeeNameInput).toBeVisible()
    await expect(leaveManagementPage.assignLeaveTypeDropdown).toBeVisible()
    await expect(leaveManagementPage.assignFromDateInput).toBeVisible()
    await expect(leaveManagementPage.assignToDateInput).toBeVisible()
    await expect(leaveManagementPage.assignButton).toBeVisible()
  })

  test("User is able to select a leave type from dropdown @C023", async ({
    page,
    leaveManagementPage,
  }) => {
    await leaveManagementPage.navigateToAssignLeave()
    await leaveManagementPage.selectAssignLeaveType(leaveTypes.canVacation)

    // Verify the dropdown shows the selected value
    const dropdown = leaveManagementPage.assignLeaveTypeDropdown
    await expect(dropdown).toContainText(leaveTypes.canVacation)
  })

  test("User is able to see comment field on Assign Leave form @C024", async ({
    page,
    leaveManagementPage,
  }) => {
    await leaveManagementPage.navigateToAssignLeave()
    await expect(leaveManagementPage.assignCommentTextarea).toBeVisible()
  })
})
