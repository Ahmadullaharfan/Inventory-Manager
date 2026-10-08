# Inventory Manager — Frontend

Inventory Manager is an Angular application for managing inventory, customers, suppliers, invoices, users, and account settings. It supports English, Pashto, and Dari, including right-to-left layouts and dark mode.

## Development

Use Node.js 22 and npm. From this directory:

```sh
npm ci
npm start
```

The development server uses `proxy.conf.json` to connect to the backend. Keep the API server running while using authentication and data screens.

## Build and verification

```sh
npm run build
npm run test:users
```

The production application is generated in `dist/inventory-manager/browser`. Cloudflare asset configuration in `wrangler.jsonc` uses this directory.

## Project structure

- `src/app/pages`: feature pages, including users, products, customers, suppliers, and invoices.
- `src/app/shared/components`: reusable controls, tables, dialogs, and dashboard widgets.
- `src/app/shared/services`: authentication, authorization, localization, and application services.
- `src/app/shared/localization/languages`: separate English, Pashto, and Dari dictionaries.
- `public/images/logo`: Inventory Manager logos for light, dark, and compact layouts.

Third-party dependencies retain their respective licenses and notices.
