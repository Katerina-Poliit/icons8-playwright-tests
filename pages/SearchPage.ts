import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class SearchPage extends BasePage {
  readonly searchInput: Locator;
  readonly heading: Locator;
  readonly iconLinks: Locator;
  readonly resultsCount: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.getByRole("searchbox").or(page.getByPlaceholder(/search/i)).first();
    this.heading = page.getByRole("heading", { level: 1 });
    // Ссылки на страницы иконок вида /icon/<id>/<name>; не привязываемся к конкретной иконке
    this.iconLinks = page.locator('a[href*="/icon/"]');
    // Счётчик результатов рядом с заголовком, например "2,411 results"
    this.resultsCount = page.locator(".icons-search__count");
  }

  async openIconsPage(): Promise<void> {
    await this.open("/icons");
  }

  async search(query: string): Promise<void> {
    // Поле поиска может сброситься после догрузки страницы (видно в trace),
    // поэтому повторяем ввод, пока поиск не сработает. Это обходной путь,
    // причина сброса не установлена.
    await expect(async () => {
      await this.searchInput.fill(query);
      await expect(this.searchInput).toHaveValue(query);
      await this.searchInput.press("Enter");
      await expect(this.page).toHaveURL(new RegExp(`/${query}`, "i"), { timeout: 3000 });
    }).toPass({ timeout: 30_000, intervals: [500, 1000, 2000] });
  }

   async expectResultsFor(query: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(`/${query}`, "i"));
    await expect(this.heading).toContainText(query, { ignoreCase: true });
    // Выдача грузится несколько секунд (серые заглушки), поэтому ожидание длиннее
    await expect(this.iconLinks.first()).toBeVisible({ timeout: 20_000 });
  }

  async getResultsCount(): Promise<number> {
    await expect(this.resultsCount).toContainText(/\d/);
    const text = await this.resultsCount.innerText();
    return Number(text.replace(/\D/g, ""));
  }
  async openFirstIcon(): Promise<void> {
    await expect(this.iconLinks.first()).toBeVisible({ timeout: 20_000 });
    await this.iconLinks.first().click();
  }
}