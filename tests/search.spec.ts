import { test, expect } from "@playwright/test";
import { SearchPage } from "../pages/SearchPage";

test.describe("Поиск иконок", () => {
  test("поиск cat: выдача, иконки, H1 и URL", async ({ page }) => {
    const search = new SearchPage(page);
    await search.openIconsPage();
    await search.search("cat");
    await search.expectResultsFor("cat");
  });

  test("бессмысленный запрос: пользователь видит пустой результат", async ({ page }) => {
    const search = new SearchPage(page);
    await search.openIconsPage();
    await search.search("qzxwvjkplm");
    // TODO: после ручной проверки зафиксировать фактический текст пустого состояния
    await expect(search.iconLinks).toHaveCount(0);
  });

  test.fixme("фильтр по стилю сужает выдачу", async () => {
    // TODO: добавить после изучения левой панели фильтров на живом сайте
  });
});
