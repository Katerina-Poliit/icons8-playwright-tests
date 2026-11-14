import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class IconPage extends BasePage {
  readonly previewImage: Locator;
  readonly downloadButton: Locator;
  readonly dialogDownloadButton: Locator;

  constructor(page: Page) {
    super(page);
    // Превью выбранной иконки в панели под выдачей
    this.previewImage = page.locator("img.app-preview__image-origin");
    // Кнопка «Download…» в панели: по атрибуту, а не по тексту
    this.downloadButton = page.locator("button[data-accordion-btn--download]");
    // Кнопка Download в окне «Download <name> icon»
    this.dialogDownloadButton = page.getByRole("button", { name: "Download", exact: true });
  }

  // Название иконки берём из alt превью (формат "<название> icon"),
  // чтобы тест не зависел от конкретной иконки в выдаче
  async getIconName(): Promise<string> {
    const alt = (await this.previewImage.getAttribute("alt")) ?? "";
    return alt.replace(/\s+icon$/i, "").trim();
  }

  // Название иконки в панели отображается ссылкой
  titleLink(name: string): Locator {
    return this.page.getByRole("link", { name, exact: true });
  }

  async openDownloadDialog(): Promise<void> {
    await this.downloadButton.click();
    await expect(this.dialogDownloadButton).toBeVisible({ timeout: 20_000 });
  }
}