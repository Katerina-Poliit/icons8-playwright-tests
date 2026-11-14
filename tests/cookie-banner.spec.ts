import { test, expect } from "@playwright/test";
import { BasePage } from "../pages/BasePage";

test("обработчик закрывает баннер cookie, перекрывающий страницу", async ({ page }) => {
  new BasePage(page); // регистрирует обработчик баннера

  // Имитация баннера: перекрывает всю страницу и кнопку «Search» под ним
  await page.setContent(`
    <button onclick="document.title = 'clicked'">Search</button>
    <div id="banner" style="position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:10">
      <button onclick="document.getElementById('banner').remove()">Accept all</button>
    </div>`);

  await page.getByRole("button", { name: "Search" }).click();

  await expect(page).toHaveTitle("clicked");
  await expect(page.locator("#banner")).toHaveCount(0);
});