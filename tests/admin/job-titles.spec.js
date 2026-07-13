import { test, expect } from "../../fixtures/page-fixtures.js"
import { jobTitles } from "../../test-data/employees.js"

test.describe("Admin - Job Titles", () => {
  test.use({ storageState: "./auth-state.json" })

  test.beforeEach(async ({ page, hrmBasePage }) => {
    await hrmBasePage.navigateToTab("Admin")
    await expect(page).toHaveURL(/.*\/admin\/viewSystemUsers/)
  })

  test("User is able to navigate to Job Titles page @C007", async ({ page,jobTitlesPage }) => {
    await jobTitlesPage.navigateToJobTitles()
    await expect(page).toHaveURL(/.*\/admin\/viewJobTitleList/)
    await jobTitlesPage.verifyJobTitlePageTitle()
  })

  test("User is able to see Add Job Title form @C008", async ({ page, jobTitlesPage }) => {
    await jobTitlesPage.navigateToJobTitles()
    await jobTitlesPage.clickAddJobTitle()

    await expect(page).toHaveURL(/.*\/admin\/saveJobTitle/)
    await jobTitlesPage.verifyAddJobTitlePageTitle()
    await jobTitlesPage.verifyJobTitleNameInputIsVisible()
    await jobTitlesPage.verifyJobDescriptionInputIsVisible()
  })

  test("User is unable to save Job Title with empty title @C009", async ({ page, jobTitlesPage }) => {
    await jobTitlesPage.navigateToJobTitles()
    await jobTitlesPage.clickAddJobTitle()

    await expect(page).toHaveURL(/.*\/admin\/saveJobTitle/)

    // Attempt to save without entering a title
    await jobTitlesPage.clickSaveJobTitle()

    // Verify required validation error appears
    await jobTitlesPage.verifyRequiredError()
  })

  test("User is able to cancel adding a Job Title @C012", async ({ page, jobTitlesPage }) => {
    await jobTitlesPage.navigateToJobTitles()
    await jobTitlesPage.clickAddJobTitle()

    await expect(page).toHaveURL(/.*\/admin\/saveJobTitle/)

    await jobTitlesPage.enterJobTitle(jobTitles.projectManager.title)

    // Cancel without saving
    await jobTitlesPage.clickCancelJobTitle()

    // Verify redirected back to job titles list
    await expect(page).toHaveURL(/.*\/admin\/viewJobTitleList/)
    await jobTitlesPage.verifyJobTitlePageTitle()
  })

  test("User is able to view existing Job Titles in table @C013", async ({ page, jobTitlesPage }) => {
    await jobTitlesPage.navigateToJobTitles()
    await expect(page).toHaveURL(/.*\/admin\/viewJobTitleList/)

    const table = page.locator(".oxd-table")
    await expect(table).toBeVisible()

    const rows = page.locator(".oxd-table-body .oxd-table-row")
    const rowCount = await rows.count()
    expect(rowCount).toBeGreaterThan(0)
  })
})
