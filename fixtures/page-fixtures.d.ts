import { test as base } from "@playwright/test"
import { HRMBasePage } from "../page-objects/hrm-base.page.js"
import { PayGradesPage } from "../page-objects/pay-grades.page.js"
import { JobTitlesPage } from "../page-objects/job-titles.page.js"
import { LeaveManagementPage } from "../page-objects/leave-management.page.js"
import { EmployeeManagementPage } from "../page-objects/employee-management.page.js"
import { TimeManagementPage } from "../page-objects/time-management.page.js"

export type PageFixtures = {
    hrmBasePage: HRMBasePage
    payGradesPage: PayGradesPage
    jobTitlesPage: JobTitlesPage
    leaveManagementPage: LeaveManagementPage
    employeeManagementPage: EmployeeManagementPage
    timeManagementPage: TimeManagementPage
}

export const test: ReturnType<typeof base.extend<PageFixtures>>
export { expect } from "@playwright/test"