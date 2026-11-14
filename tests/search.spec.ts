import { test, expect } from "@playwright/test";
import { SearchPage } from "../pages/SearchPage";

test.describe("Поиск иконок", () => {
  test("поиск cat: выдача, иконки, H1 и URL", async ({ page }) => {
    const search = new SearchPage(page);
    await search.openIconsPage();
    await search.search("cat");
    await search.expectResultsFor("cat");
  });

  test("бессмысленный запрос: страница «ничего не найдено»", async ({ page }) => {
    const search = new SearchPage(page);
    await search.openIconsPage();
    await search.search("qzxwvjkplm");
    await search.expectNothingFound("qzxwvjkplm");
  });

  test("фильтр Technique → Filled сужает выдачу, повторное нажатие снимает его", async ({ page }) => {
    const search = new SearchPage(page);
    await search.openIconsPage();
    await search.search("cat");
    await search.expectResultsFor("cat");
    const before = await search.getResultsCount();

    // Включаем фильтр: адрес меняется, результатов становится меньше (но не ноль)
    await search.applyFilledFilter();
    await expect(page).toHaveURL(/technique-filled/);
    await expect
      .poll(() => search.readResultsCount(), { timeout: 20_000 })
      .toBeLessThan(before);
    expect(await search.readResultsCount()).toBeGreaterThan(0);

    // Повторное нажатие снимает фильтр: адрес и число результатов возвращаются
    await search.applyFilledFilter();
    await expect(page).not.toHaveURL(/technique-filled/);
    await expect
      .poll(() => search.readResultsCount(), { timeout: 20_000 })
      .toBe(before);
  });
});