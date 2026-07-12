// @ts-nocheck
import { test as baseTest, expect } from "@playwright/test"
import { HRMBasePage } from "../page-objects/hrm-base.page.js"
import { PayGradesPage } from "../page-objects/pay-grades.page.js"
import { JobTitlesPage } from "../page-objects/job-titles.page.js"
import { LeaveManagementPage } from "../page-objects/leave-management.page.js"
import { EmployeeManagementPage } from "../page-objects/employee-management.page.js"
import { TimeManagementPage } from "../page-objects/time-management.page.js"

const test = baseTest.extend({
  hrmBasePage: async ({ page }, use, testInfo) => {
    const hrmBasePage = new HRMBasePage(page)
    // Skip auto-navigation for auth-setup (it navigates to /auth/login itself)
    if (!testInfo.file.includes("auth-setup")) {
      await page.goto("/web/index.php/dashboard/index")
      await page.waitForLoadState("networkidle")
    }
    await use(hrmBasePage)
  },

  payGradesPage: async ({ page }, use) => {
    const payGradesPage = new PayGradesPage(page)
    await use(payGradesPage)
  },

  jobTitlesPage: async ({ page }, use) => {
    const jobTitlesPage = new JobTitlesPage(page)
    await use(jobTitlesPage)
  },

  leaveManagementPage: async ({ page }, use) => {
    const leaveManagementPage = new LeaveManagementPage(page)
    await use(leaveManagementPage)
  },

  employeeManagementPage: async ({ page }, use) => {
    const employeeManagementPage = new EmployeeManagementPage(page)
    await use(employeeManagementPage)
  },

  timeManagementPage: async ({ page }, use) => {
    const timeManagementPage = new TimeManagementPage(page)
    await use(timeManagementPage)
  },
})

export { test, expect }
