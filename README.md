# icons8-playwright-tests

E2E-тесты поиска и страницы иконки на https://icons8.com/icons
(Playwright + TypeScript, Page Object).

## Требования
- Node.js 20+
- Установленный Google Chrome (тесты идут в обычном Chrome с окном)

## Установка и запуск с нуля
```bash
git clone <URL репозитория>
cd icons8-playwright-tests
npm ci
npx playwright install chrome   # если Chrome не установлен
npm test                        # прогон (workers: 2)
npm run report                  # открыть HTML-отчёт
```
Если сайт покажет проверку «вы не робот», пройдите её руками в том же окне.

## Структура
- `pages/` — Page Object (`BasePage`, `SearchPage`, `IconPage`)
- `tests/` — тесты (`search.spec.ts`, `icon.spec.ts`)
- `playwright.config.ts` — конфиг (workers: 2, Chrome с окном, trace всегда)
- `.github/workflows/playwright.yml` — прогон на каждый push, отчёт артефактом
- `playwright-report/`, `test-results/` — HTML-отчёт и trace последнего локального прогона
- `AI_LOG.md` — как использовался ИИ

## Принципы
Локаторы по роли/тексту/атрибутам, без фиксированных пауз, тесты независимы
и не зависят от конкретных иконок. Баннер cookie закрывается через `addLocatorHandler`.

## Статус
> TODO: заполнить после прогонов: что зелёное, что не успела, время по частям,
> результат прогона в GitHub Actions (если CI режет защита от ботов — написать здесь).
