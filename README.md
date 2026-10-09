# WildSketch

Індивідуальний навчальний проєкт: HTML, CSS, JavaScript та Vite.

## Поточна реалізація

Header, Hero, Benefits, Gallery, Events, Register, Footer і мобільне меню. Структура відповідає наданим скриншотам Design 2. Точні параметри Figma й офіційні критерії Google Sheets ще не перевірені.

## Локальний запуск

```sh
npm install
npm run dev
```

Адреса: http://localhost:5173/ (остаточну адресу виводить Vite).

```sh
npm run build
npm run preview
```

Попередній перегляд збірки: http://localhost:4173/.

Якщо Node.js відсутній у PATH на Windows, додайте C:\Program Files\nodejs до PATH або використовуйте повний шлях до npm.cmd.

## Форма

Підключення до сервера відсутнє. Вбудована валідація перевіряє обов'язкові поля й email. Форма не надсилає та не очищає дані й показує повідомлення про недоступність реєстрації.

## Перевірки

2026-10-09: node --check src/main.js та npm run build пройшли. Chrome: перевірено 375, 600, 768, 1024, 1440 і 1920 px; зображення, переповнення, меню та форма пройшли перевірки. Зображення оптимізовані у WebP (400/800/1400 px), PNG-оригінали збережено в assets/originals; у публічну збірку вони не входять. Pixel-perfect відповідність не підтверджена.

## GitHub

Remote уже налаштований. node_modules, dist, env-файли та журнали ігноруються. Публікація: https://tetianabehai-tech.github.io/WildSketch/. Push, merge та deploy виконуються лише після окремого підтвердження власниці.

## Перевірка

Node.js 22.12+ (перевірено на 24.20.0).

Команди: npm run build; npm exec html-validate -- index.html; npm exec prettier -- --check index.html src scripts package.json README.md vite.config.js; node scripts/check-browser.mjs (Chrome і запущений npm run dev).
