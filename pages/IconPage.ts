import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class IconPage extends BasePage {
  readonly title: Locator;
  readonly downloadButton: Locator;

  constructor(page: Page) {
    super(page);
    // TODO: проверить на живом сайте
    this.title = page.getByRole("heading", { level: 1 });
    this.downloadButton = page
      .getByRole("button", { name: /download/i })
      .or(page.getByRole("link", { name: /download/i }))
      .first();
  }
}
