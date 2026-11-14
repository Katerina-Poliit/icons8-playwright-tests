import { test, expect } from "@playwright/test";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { SearchPage } from "../pages/SearchPage";
import { IconPage } from "../pages/IconPage";

// Тест скачивает файл и тратит лимит скачиваний гостя, поэтому помечен @download
// и исключён из прогона в GitHub Actions (см. README)
test(
  "гость скачивает бесплатный PNG статичной иконки",
  { tag: "@download" },
  async ({ page }) => {
    const search = new SearchPage(page);
    await search.openIconsPage();
    await search.search("cat");
    await search.expectResultsFor("cat");
    await search.applyStaticFilter();
    await search.openFirstIcon();

    const icon = new IconPage(page);
    await icon.openDownloadDialog();

    // В окне по умолчанию выбраны бесплатные PNG и 48x48
    // Файл сохраняем во временную папку и удаляем: иконка не должна попасть в репозиторий
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "icons8-"));
    try {
      const downloadPromise = page.waitForEvent("download", { timeout: 30_000 });
      await icon.dialogDownloadButton.click();
      const download = await downloadPromise;

      const fileName = download.suggestedFilename();
      expect(fileName.toLowerCase()).toMatch(/\.png$/);

      const filePath = path.join(dir, fileName);
      await download.saveAs(filePath);
      expect(fs.statSync(filePath).size).toBeGreaterThan(0);

      // Сигнатура PNG: файл действительно картинка, а не страница с ошибкой
      const signature = fs.readFileSync(filePath).subarray(0, 8);
      expect(signature.equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))).toBe(true);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  },
);