import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  retries: 0,
  // По правилам задания: не больше 2 воркеров, сайт боевой
  workers: 2,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "https://icons8.com",
    // Обычный Chrome с окном: в headless сайт может закрыться защитой от ботов
    channel: "chrome",
    headless: false,
    locale: "en-US",
    viewport: { width: 1440, height: 900 },
    // trace пишем всегда, чтобы он был и у зелёного прогона (требование сдачи)
    trace: "on",
    screenshot: "only-on-failure",
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    
  },
});