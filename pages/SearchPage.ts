import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class SearchPage extends BasePage {
  readonly searchInput: Locator;
  readonly heading: Locator;
  readonly iconLinks: Locator;
  readonly resultsCount: Locator;
  readonly filledFilter: Locator;
  readonly staticFilter: Locator;
  readonly nothingFound: Locator;
  readonly nothingFoundTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.getByRole("searchbox").or(page.getByPlaceholder(/search/i)).first();
    this.heading = page.getByRole("heading", { level: 1 });
    // Ссылки на страницы иконок вида /icon/<id>/<name>; не привязываемся к конкретной иконке
    this.iconLinks = page.locator('a[href*="/icon/"]');
    // Счётчик результатов рядом с заголовком, например "2,411 results"
    this.resultsCount = page.locator(".icons-search__count");
    // Кнопка фильтра Technique -> Filled. Accessible name содержит ещё слово "logo"
    // из подписи значка, поэтому ищем по слову Filled, а не по полному имени
    this.filledFilter = page.getByRole("button", { name: /\bFilled\b/ }).first();
    // Кнопка фильтра Animation -> Static
    this.staticFilter = page.getByRole("button", { name: /\bStatic\b/ }).first();
    // Блок "ничего не найдено" на странице выдачи без результатов
    this.nothingFound = page.locator(".search-nothing-found");
    this.nothingFoundTitle = this.nothingFound.getByRole("heading");
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
    // Иконок в выдаче несколько, а не одна
    await expect.poll(() => this.iconLinks.count()).toBeGreaterThan(1);
  }

  async expectNothingFound(query: string): Promise<void> {
    await expect(this.nothingFound).toBeVisible({ timeout: 20_000 });
    await expect(this.nothingFoundTitle).toContainText(query, { ignoreCase: true });
  }

  // Число результатов; ждёт, пока счётчик появится
  async getResultsCount(): Promise<number> {
    await expect(this.resultsCount).toContainText(/\d/);
    const text = await this.resultsCount.innerText();
    return Number(text.replace(/\D/g, ""));
  }

  // Число результатов без ожидания; NaN, если счётчика нет или в нём нет цифр.
  // Нужен для expect.poll, пока страница перерисовывается после фильтра
  async readResultsCount(): Promise<number> {
    const text = await this.resultsCount
      .first()
      .textContent({ timeout: 1000 })
      .catch(() => null);
    const digits = (text ?? "").replace(/\D/g, "");
    return digits ? Number(digits) : NaN;
  }

  async applyFilledFilter(): Promise<void> {
    await this.filledFilter.click();
  }

  // Включает фильтр Static и ждёт, пока выдача перерисуется
  // (число результатов уменьшится), чтобы не кликнуть по старой сетке
  async applyStaticFilter(): Promise<void> {
    const before = await this.getResultsCount();
    await this.staticFilter.click();
    await expect(this.page).toHaveURL(/static/);
    await expect
      .poll(() => this.readResultsCount(), { timeout: 20_000 })
      .toBeLessThan(before);
  }

  async openFirstIcon(): Promise<void> {
    await expect(this.iconLinks.first()).toBeVisible({ timeout: 20_000 });
    await this.iconLinks.first().click();
  }
}