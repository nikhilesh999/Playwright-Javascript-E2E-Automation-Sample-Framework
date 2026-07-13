import { test, expect } from "../../fixtures/page-fixtures.js"

test.describe("Time Management - Timesheets", () => {
  test.use({ storageState: "./auth-state.json" })

  test.beforeEach(async ({ page, hrmBasePage }) => {
    await hrmBasePage.navigateToTab("Time")
    await expect(page).toHaveURL(/.*\/time\/.*/)
  })

  test("User is able to navigate to My Timesheets page @C032", async ({ page, timeManagementPage }) => {
    await timeManagementPage.navigateToMyTimesheets()
    await expect(page).toHaveURL(/.*\/time\/viewMyTimesheet/)
    await timeManagementPage.verifyMyTimesheetPageTitle()
  })

  test("User is able to see the timesheet table @C033", async ({ page, timeManagementPage }) => {
    await timeManagementPage.navigateToMyTimesheets()
    await timeManagementPage.verifyTimesheetTableIsVisible()
  })

  test("User is able to see Edit button on My Timesheets @C034", async ({ page, timeManagementPage }) => {
    await timeManagementPage.navigateToMyTimesheets()
    await timeManagementPage.verifyEditButtonIsVisible()
  })

  test("User is able to navigate to previous timesheet @C035", async ({ page, timeManagementPage }) => {
    await timeManagementPage.navigateToMyTimesheets()

    await timeManagementPage.navigateToPreviousTimesheet()

    await expect(page).toHaveURL(/.*\/time\/viewMyTimesheet/)
    await timeManagementPage.verifyMyTimesheetPageTitle()
    await timeManagementPage.verifyTimesheetTableIsVisible()
  })

  test("User is able to navigate to next timesheet @C036", async ({ page, timeManagementPage }) => {
    await timeManagementPage.navigateToMyTimesheets()

    // Navigate back first, then forward
    await timeManagementPage.navigateToPreviousTimesheet()
    await timeManagementPage.navigateToNextTimesheet()

    await expect(page).toHaveURL(/.*\/time\/viewMyTimesheet/)
    await timeManagementPage.verifyTimesheetTableIsVisible()
  })

  test("User is able to navigate to Employee Timesheets page @C037", async ({ page, timeManagementPage }) => {
    await timeManagementPage.navigateToEmployeeTimesheets()
    await expect(page).toHaveURL(/.*\/time\/viewEmployeeTimesheet/)
    await timeManagementPage.verifyEmployeeTimesheetPageTitle()
  })

  test("User is able to see employee name input on Employee Timesheets @C038", async ({ page, timeManagementPage }) => {
    await timeManagementPage.navigateToEmployeeTimesheets()

    await expect(timeManagementPage.employeeNameInput).toBeVisible()
    const viewButton = page.getByRole("button", { name: "View" }).first()
    await expect(viewButton).toBeVisible()
  })
})
