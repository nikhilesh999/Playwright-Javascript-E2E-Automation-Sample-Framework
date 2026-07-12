// @ts-check
import { defineConfig, devices } from "@playwright/test"

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "https://opensource-demo.orangehrmlive.com",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  timeout: 60000,

  projects: [
    {
      name: "setup",
      testMatch: /.*auth-setup\.spec\.js/,
      timeout: 60000,
      use: {
        launchOptions: {
          args: ["--start-maximized"],
        },
        viewport: null,
      },
    },

    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        launchOptions: {
          args: ["--start-maximized"],
        },
      },
      dependencies: ["setup"],
      testIgnore: /.*auth-setup\.spec\.js/,
    },

    {
      name: "chrome",
      use: {
        ...devices["Desktop Chrome"],
      },
    },

    // {
    //   name: "Mobile Chrome",
    //   use: { ...devices["Pixel 5"] },
    //   dependencies: ["setup"],
    // },
    // {
    //   name: "firefox",
    //   use: { ...devices["Desktop Firefox"] },
    //   dependencies: ["setup"],
    // },
  ],
})
