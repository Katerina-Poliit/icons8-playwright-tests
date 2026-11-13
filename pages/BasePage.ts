import { Page, Locator } from "@playwright/test";

export class BasePage {
  constructor(protected readonly page: Page) {
    this.registerCookieBannerHandler();
  }

  /**
   * Баннер cookie закрываем через addLocatorHandler: Playwright сам
   * вызывает обработчик, когда баннер появляется поверх страницы,
   * без фиксированных пауз.
   * TODO: после первого прогона сверить текст кнопки с реальным баннером.
   */
  private registerCookieBannerHandler(): void {
    const acceptButton: Locator = this.page
      .getByRole("button", { name: /accept|agree|got it|allow all|ok/i })
      .first();

    this.page.addLocatorHandler(acceptButton, async (button) => {
      await button.click();
    });
  }

  async open(path: string): Promise<void> {
    await this.page.goto(path, { waitUntil: "domcontentloaded" });
  }
}
