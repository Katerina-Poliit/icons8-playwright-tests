import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class SearchPage extends BasePage {
  readonly searchInput: Locator;
  readonly heading: Locator;
  readonly iconLinks: Locator;

  constructor(page: Page) {
    super(page);
    // TODO: проверить на живом сайте (Inspector / codegen)
    this.searchInput = page.getByRole("searchbox").or(page.getByPlaceholder(/search/i)).first();
    this.heading = page.getByRole("heading", { level: 1 });
    // Ссылки на страницы иконок вида /icon/<id>/<name>; не привязываемся к конкретной иконке
    this.iconLinks = page.locator("a[href*=\"/icon/\"]");
  }

  async openIconsPage(): Promise<void> {
    await this.open("/icons");
  }

  async search(query: string): Promise<void> {
    await this.searchInput.fill(query);
    await this.searchInput.press("Enter");
  }

  async expectResultsFor(query: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(`/${query}`, "i"));
    await expect(this.heading).toContainText(query, { ignoreCase: true });
    await expect(this.iconLinks.first()).toBeVisible();
  }

  async openFirstIcon(): Promise<void> {
    await this.iconLinks.first().click();
  }
}
