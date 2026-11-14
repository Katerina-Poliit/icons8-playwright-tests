import { Page, Locator, expect } from "@playwright/test";

// Обработчик cookie-баннера регистрируем один раз на страницу,
// даже если на ней создано несколько Page Object
const pagesWithCookieHandler = new WeakSet<Page>();

export class BasePage {
  constructor(protected readonly page: Page) {
    this.registerCookieBannerHandler();
  }

  /**
   * Баннер cookie закрываем через addLocatorHandler: Playwright сам
   * вызывает обработчик, когда баннер появляется поверх страницы,
   * без фиксированных пауз.
   */
  private registerCookieBannerHandler(): void {
    if (pagesWithCookieHandler.has(this.page)) return;
    pagesWithCookieHandler.add(this.page);

    const acceptButton: Locator = this.page
      .getByRole("button", { name: /^(accept( all)?( cookies)?|i agree|agree|got it|allow all)$/i })
      .first();

    this.page.addLocatorHandler(acceptButton, async (button) => {
      await button.click();
    });
  }

  async open(path: string): Promise<void> {
    await this.page.goto(path, { waitUntil: "domcontentloaded" });
    // Предусловие: английская версия интерфейса. Если сайт отдал другой язык,
    // тест падает сразу с понятной причиной
    await expect(this.page.locator("html")).toHaveAttribute("lang", /^en/);
  }
}
