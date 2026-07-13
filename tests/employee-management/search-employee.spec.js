import { test, expect } from "../../fixtures/page-fixtures.js"
import { employees } from "../../test-data/employees.js"

test.describe("Employee Management - Search Employee", () => {
  test.use({ storageState: "./auth-state.json" })

  test.beforeEach(async ({ page, hrmBasePage }) => {
    await hrmBasePage.navigateToTab("PIM")
    await expect(page).toHaveURL(/.*\/pim\/viewEmployeeList/)
  })

  test("User is able to see the Employee List page @C025", async ({ page, employeeManagementPage }) => {
    await employeeManagementPage.navigateToEmployeeList()
    await expect(page).toHaveURL(/.*\/pim\/viewEmployeeList/)
    await employeeManagementPage.verifyEmployeeListPageTitle()
  })

  test("User is able to see employee records in the table @C026", async ({ page, employeeManagementPage}) => {
    await employeeManagementPage.navigateToEmployeeList()

    const table = page.locator(".oxd-table")
    await expect(table).toBeVisible()

    const rows = page.locator(".oxd-table-body .oxd-table-row")
    const rowCount = await rows.count()
    expect(rowCount).toBeGreaterThan(0)
  })

  test("User is able to search an employee by name @C027", async ({ page, employeeManagementPage }) => {
    await employeeManagementPage.navigateToEmployeeList()
    await employeeManagementPage.searchEmployeeByName(employees.paulHerald.name)
    await employeeManagementPage.clickSearch()

    await expect(page).toHaveURL(/.*\/pim\/viewEmployeeList/)
    await employeeManagementPage.verifyEmployeeListPageTitle()
  })

  test("User is able to reset employee search filters @C028", async ({ page, employeeManagementPage }) => {
    await employeeManagementPage.navigateToEmployeeList()

    // Search for something first
    await employeeManagementPage.searchEmployeeByName(employees.fionaGrace.name)
    await employeeManagementPage.clickSearch()

    // Reset filters
    await employeeManagementPage.clickReset()

    await expect(page).toHaveURL(/.*\/pim\/viewEmployeeList/)
    await employeeManagementPage.verifyEmployeeListPageTitle()
  })

  test("User is able to navigate to Add Employee page @C029", async ({ page, employeeManagementPage }) => {
    await employeeManagementPage.navigateToEmployeeList()
    await employeeManagementPage.clickAddEmployee()

    await expect(page).toHaveURL(/.*\/pim\/addEmployee/)
    await employeeManagementPage.verifyAddEmployeePageTitle()
  })

  test("User is able to see Add Employee form fields @C030", async ({ page, employeeManagementPage }) => {
    await employeeManagementPage.navigateToAddEmployee()

    await expect(employeeManagementPage.firstNameInput).toBeVisible()
    await expect(employeeManagementPage.middleNameInput).toBeVisible()
    await expect(employeeManagementPage.lastNameInput).toBeVisible()
    await employeeManagementPage.verifyEmployeeIdIsVisible()
  })

  test("User is unable to save employee without first name @C031", async ({ page, employeeManagementPage }) => {
    await employeeManagementPage.navigateToAddEmployee()

    // Enter only last name
    await employeeManagementPage.enterLastName("TestLastName")
    await employeeManagementPage.clickSaveEmployee()

    // Verify required error for first name
    await employeeManagementPage.verifyRequiredError()
  })
})
