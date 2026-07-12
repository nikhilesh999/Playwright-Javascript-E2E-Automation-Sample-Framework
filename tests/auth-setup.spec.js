import "dotenv/config"
import { test, expect } from "../fixtures/page-fixtures.js"

test("setup authentication", async ({ page, context, hrmBasePage }) => {
  console.log("📍 Starting authentication setup...\n")

  const username = process.env.HRM_USERNAME || "Admin"
  const password = process.env.HRM_PASSWORD || "admin123"

  if (!username || !password) {
    throw new Error("Missing credentials! Please set HRM_USERNAME and HRM_PASSWORD in .env file")
  }

  // Perform login
  await hrmBasePage.login(username, password)
  console.log("✅ Entered credentials")

  // Verify we're on the dashboard
  await expect(page).toHaveURL(/.*\/dashboard\/index/)
  console.log("✅ On OrangeHRM dashboard")

  // Save authentication state
  await hrmBasePage.saveAuthenticationState(context)

  console.log("\n✅ ===== SETUP COMPLETE =====")
  console.log("✅ Use in tests: test.use({ storageState: './auth-state.json' })")
  console.log("============================\n")
})
