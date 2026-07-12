import { test, expect } from "../../fixtures/page-fixtures.js"
import { leaveTypes, leaveStatuses } from "../../test-data/employees.js"

test.describe("Leave Management - Leave List", () => {
  test.use({ storageState: "./auth-state.json" })

  test.beforeEach(async ({ page, hrmBasePage }) => {
    await hrmBasePage.navigateToTab("Leave")
    await expect(page).toHaveURL(/.*\/leave\/.*/)
  })

  test("User is able to navigate to Leave List page @C014", async ({
    page,
    leaveManagementPage,
  }) => {
    await leaveManagementPage.navigateToLeaveList()
    await expect(page).toHaveURL(/.*\/leave\/viewLeaveList/)
    await leaveManagementPage.verifyLeaveListPageTitle()
  })

  test("User is able to see the Leave List table @C015", async ({
    page,
    leaveManagementPage,
  }) => {
    await leaveManagementPage.navigateToLeaveList()
    await expect(page).toHaveURL(/.*\/leave\/viewLeaveList/)
    await leaveManagementPage.verifyLeaveTableIsVisible()
  })

  test("User is able to search leave by leave type @C016", async ({
    page,
    leaveManagementPage,
  }) => {
    await leaveManagementPage.navigateToLeaveList()
    await leaveManagementPage.selectLeaveType(leaveTypes.canVacation)
    await leaveManagementPage.clickSearch()

    await expect(page).toHaveURL(/.*\/leave\/viewLeaveList/)
    await leaveManagementPage.verifyLeaveTableIsVisible()
  })

  test("User is able to search leave by status @C017", async ({
    page,
    leaveManagementPage,
  }) => {
    await leaveManagementPage.navigateToLeaveList()
    await leaveManagementPage.selectLeaveStatus(leaveStatuses.pendingApproval)
    await leaveManagementPage.clickSearch()

    await expect(page).toHaveURL(/.*\/leave\/viewLeaveList/)
    await leaveManagementPage.verifyLeaveTableIsVisible()
  })

  test("User is able to reset leave list filters @C018", async ({
    page,
    leaveManagementPage,
  }) => {
    await leaveManagementPage.navigateToLeaveList()

    // Apply a filter first
    await leaveManagementPage.selectLeaveType(leaveTypes.canVacation)

    // Reset filters
    await leaveManagementPage.clickReset()

    await expect(page).toHaveURL(/.*\/leave\/viewLeaveList/)
    await leaveManagementPage.verifyLeaveTableIsVisible()
  })

  test("User is able to search leave by date range @C019", async ({
    page,
    leaveManagementPage,
  }) => {
    await leaveManagementPage.navigateToLeaveList()
    await leaveManagementPage.enterFromDate("2025-01-01")
    await leaveManagementPage.enterToDate("2025-12-31")
    await leaveManagementPage.clickSearch()

    await expect(page).toHaveURL(/.*\/leave\/viewLeaveList/)
    await leaveManagementPage.verifyLeaveTableIsVisible()
  })
})
