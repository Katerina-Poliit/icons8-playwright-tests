import { test, expect } from "@playwright/test";
import { SearchPage } from "../pages/SearchPage";
import { IconPage } from "../pages/IconPage";

test.describe("Страница иконки", () => {
  test("клик по иконке из выдачи: видны название и кнопка скачивания", async ({ page }) => {
    const search = new SearchPage(page);
    await search.openIconsPage();
    await search.search("cat");
    await search.openFirstIcon();

    const icon = new IconPage(page);
    await expect(icon.title).toBeVisible();
    await expect(icon.title).not.toBeEmpty();
    await expect(icon.downloadButton).toBeVisible();
  });
});
