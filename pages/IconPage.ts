import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class IconPage extends BasePage {
  readonly previewImage: Locator;
  readonly downloadButton: Locator;

  constructor(page: Page) {
    super(page);
    // Превью выбранной иконки в панели под выдачей
    this.previewImage = page.locator("img.app-preview__image-origin");
    // Кнопка скачивания: по атрибуту, а не по тексту (текст зависит от языка)
    this.downloadButton = page.locator("button[data-accordion-btn--download]");
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
}