import { test, expect } from "../../fixtures/page-fixtures.js"
import { payGrades } from "../../test-data/employees.js"

test.describe("Admin - Pay Grades", () => {
  test.use({ storageState: "./auth-state.json" })

  test.beforeEach(async ({ page, hrmBasePage }) => {
    await hrmBasePage.navigateToTab("Admin")
    await expect(page).toHaveURL(/.*\/admin\/viewSystemUsers/)
  })

  test("User is able to navigate to Pay Grades page @C001", async ({ page, payGradesPage }) => {
    await payGradesPage.navigateToPayGrades()
    await expect(page).toHaveURL(/.*\/admin\/viewPayGrades/)
    await payGradesPage.verifyPayGradePageTitle()
  })

  test("User is able to see Add Pay Grade form @C002", async ({ page, payGradesPage }) => {
    await payGradesPage.navigateToPayGrades()
    await payGradesPage.clickAddPayGrade()

    // OrangeHRM add form is at /admin/payGrade
    await expect(page).toHaveURL(/.*\/admin\/payGrade/)
    await payGradesPage.verifyAddPayGradePageTitle()
    await payGradesPage.verifyPayGradeNameInput()
  })

  test("User is unable to save Pay Grade with empty name @C003", async ({ page, payGradesPage }) => {
    await payGradesPage.navigateToPayGrades()
    await payGradesPage.clickAddPayGrade()

    // Attempt to save without entering a name
    await payGradesPage.clickSavePayGrade()

    // Verify required validation error appears
    await payGradesPage.verifyRequiredError()
  })

  test("User is able to cancel adding a Pay Grade @C005", async ({ page, payGradesPage }) => {
    await payGradesPage.navigateToPayGrades()
    await payGradesPage.clickAddPayGrade()

    await expect(page).toHaveURL(/.*\/admin\/payGrade/)

    await payGradesPage.enterPayGradeName(payGrades.gradeB.name)

    // Cancel without saving
    await payGradesPage.clickCancelPayGrade()

    // Verify redirected back to pay grades list
    await expect(page).toHaveURL(/.*\/admin\/viewPayGrades/)
    await payGradesPage.verifyPayGradePageTitle()
  })

  test("User is able to view existing Pay Grades in table @C006", async ({ page, payGradesPage }) => {
    await payGradesPage.navigateToPayGrades()
    await expect(page).toHaveURL(/.*\/admin\/viewPayGrades/)

    // Verify the table is rendered and has records
    const table = page.locator(".oxd-table")
    await expect(table).toBeVisible()

    const rows = page.locator(".oxd-table-body .oxd-table-row")
    const rowCount = await rows.count()
    expect(rowCount).toBeGreaterThan(0)
  })
})
