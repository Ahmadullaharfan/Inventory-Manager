Below is a practical Vuexy Angular guide based on your actual project at `E:\Angular-LE\full-version` and the official Vuexy docs.

**1. Installation**
Your template is `vuexy-angular-admin-template` version `8.2.1`, using Angular `14.1.0`, TypeScript `4.7.4`, Bootstrap `4.6.1`, and `@ng-bootstrap/ng-bootstrap`.

Recommended environment:

```bash
node -v
# Use Node 16 LTS for this Angular 14 project

npm -v
# npm 8 is safest with Node 16
```

The official Vuexy docs say to use Node LTS, install Git, and install Angular CLI globally. For this project, use a matching Angular CLI version:

```bash
npm install -g @angular/cli@14.1.0
```

Git is recommended because npm may need it for package resolution, even if you are not using Git for your own code.

`full-version` vs `starter-kit`:

`full-version` contains all dashboards, demo apps, pages, forms, tables, charts, fake APIs, and examples. It is excellent for learning and copying examples.

`starter-kit` is the better starting point for a new production business app because it keeps the template shell and core structure without all demo modules. Use `full-version` as a reference beside it.

Install dependencies:

```bash
npm install --legacy-peer-deps
```

Vuexy recommends this because older Angular ecosystem packages often have strict peer dependency ranges. `--legacy-peer-deps` tells npm to install like npm v6 did, avoiding hard peer dependency failures.

If install fails:

```bash
npm cache verify
npm install --legacy-peer-deps
```

If you still hit memory issues, your scripts already use `--max_old_space_size=8192`.

Run dev server:

```bash
npm start
```

Your `package.json` maps this to:

```bash
ng serve --open
```

Run on another port:

```bash
ng serve --open --port 4201
```

Expose to local network:

```bash
ng serve --host 0.0.0.0 --port 4200
```

Then open from another device:

```text
http://YOUR_PC_LOCAL_IP:4200
```

Production build:

```bash
npm run build:prod
```

Output goes to `dist/vuexy`, based on `angular.json`.

**2. Project Structure**
Important folders:

`src/@core/`  
Vuexy framework internals: config service, menu service, sidebar, theme customizer, pipes, directives, layout helpers. Avoid editing this directly so future Vuexy updates remain easier. Prefer extending from `src/app`.

`src/@fake-db/`  
Mock data used by `angular-in-memory-web-api`. The fake API is registered in [app.module.ts](E:/Angular-LE/full-version/src/app/app.module.ts). Add mock data here when testing UI before your real backend exists.

`src/app/auth/`  
JWT auth demo: models, guards, interceptors, fake backend integration, login/logout service. `AuthenticationService` stores `currentUser` in `localStorage`; `JwtInterceptor` attaches `Authorization: Bearer ...` only to requests starting with `environment.apiUrl`.

`src/app/layout/`  
Vertical and horizontal layouts, navbar, footer, content wrapper. Switch layout type in [app-config.ts](E:/Angular-LE/full-version/src/app/app-config.ts):

```ts
layout: {
  type: 'vertical' // or 'horizontal'
}
```

`src/app/main/`  
Demo and feature modules: dashboards, apps, pages, forms, tables, components, charts. You can copy patterns from here into your own business modules.

`src/app/menu/`  
Navigation config lives in [menu.ts](E:/Angular-LE/full-version/src/app/menu/menu.ts). Menu labels connect to i18n through each item’s `translate` key, such as `MENU.DASHBOARD.ECOMMERCE`.

`src/assets/scss/`  
Global styling. Use `src/assets/scss/styles.scss` for custom CSS. Bootstrap variables are in `src/assets/scss/variables/_variables.scss`; component variables are in `_variables-components.scss`.

`src/app/app-config.ts`  
App name, title, logo, default language, skin, layout type, navbar/footer/menu behavior, customizer, scroll-to-top, and demo “buy now” button.

**3. Routing**
Vuexy uses lazy loading at the main route level. Routes are currently defined directly in [app.module.ts](E:/Angular-LE/full-version/src/app/app.module.ts), not in a separate `app-routing.module.ts`.

Example:

```ts
{
  path: 'dashboard',
  loadChildren: () => import('./main/dashboard/dashboard.module').then(m => m.DashboardModule)
}
```

Child routes are inside feature modules, for example [dashboard.module.ts](E:/Angular-LE/full-version/src/app/main/dashboard/dashboard.module.ts).

Create a new page module:

```bash
ng generate module main/my-dashboard --route my-dashboard --module app.module
```

For this project’s current style, you can also manually add:

```ts
{
  path: 'my-dashboard',
  loadChildren: () => import('./main/my-dashboard/my-dashboard.module').then(m => m.MyDashboardModule)
}
```

Change default homepage in [app.module.ts](E:/Angular-LE/full-version/src/app/app.module.ts):

```ts
{
  path: '',
  redirectTo: '/my-dashboard',
  pathMatch: 'full'
}
```

404 route:

```ts
{
  path: '**',
  redirectTo: '/pages/miscellaneous/error'
}
```

Component location:

```text
src/app/main/pages/miscellaneous/error/
```

**4. Auth And ACL**
JWT flow:

`AuthenticationService.login()` posts to:

```ts
`${environment.apiUrl}/users/authenticate`
```

If a token is returned, it stores the full user object in:

```ts
localStorage.currentUser
```

`JwtInterceptor` reads that user and attaches the bearer token to API requests.

`AuthGuard` checks:

```ts
route.data.roles
```

Admin-only route example:

```ts
import { Role } from 'app/auth/models';

{
  path: 'admin',
  component: AdminComponent,
  canActivate: [AuthGuard],
  data: { roles: [Role.Admin] }
}
```

Element-level permission:

```html
<button *ngIf="authService.isAdmin" class="btn btn-danger">
  Delete
</button>
```

or:

```ts
canDelete = this.authService.currentUserValue?.role === Role.Admin;
```

The menu also supports role-based hiding:

```ts
role: ['Admin']
```

Starter Kit usually preserves the core auth/ACL structure, but removes many demo modules. Confirm by checking whether `src/app/auth`, `AuthGuard`, and `Role` exist in your starter-kit copy.

**5. Components**
Vuexy Angular is built mainly on:

`Angular CLI`, `Bootstrap 4`, `NgBootstrap`, `Angular CDK`, `ngx-datatable`, `ng-select`, `ApexCharts`, `Flatpickr`, `ngx-toastr`, `SweetAlert2`, and other Angular wrappers.

You can reuse components from `src/app/main`, but the safest production approach is to copy the needed component/module pattern into your own feature folder, then import only its required dependencies.

Example: for DataTables, inspect:

```text
src/app/main/tables/datatables/
```

Then copy the component/service/module pattern into your business module.

Replacing the whole UI library with Angular Material is highly discouraged. You can use Material selectively, but Vuexy’s layout, SCSS, Bootstrap utilities, and NgBootstrap components are deeply integrated.

**6. Layout And Branding**
Switch vertical/horizontal:

```ts
// src/app/app-config.ts
layout: {
  type: 'horizontal'
}
```

Edit menu:

```text
src/app/menu/menu.ts
```

Menu icons use Feather icon names, such as `home`, `user`, `settings`, `calendar`.

Change app name/title/logo:

```ts
app: {
  appName: 'My App',
  appTitle: 'My App Admin',
  appLogoImage: 'assets/images/logo/logo.svg',
  appLanguage: 'en'
}
```

Browser favicon:

```text
src/favicon.ico
src/assets/images/logo/favicon.ico
```

App title is applied in [app.component.ts](E:/Angular-LE/full-version/src/app/app.component.ts) through Angular’s `Title` service.

**7. i18n**
Vuexy uses `@ngx-translate/core`, plus Vuexy’s wrapper service:

```text
src/@core/services/translation.service.ts
```

Existing menu translations:

```text
src/app/menu/i18n/en.ts
src/app/menu/i18n/fr.ts
src/app/menu/i18n/de.ts
src/app/menu/i18n/pt.ts
```

Example language file format:

```ts
export const locale = {
  lang: 'ja',
  data: {
    MENU: {
      DASHBOARD: {
        COLLAPSIBLE: 'ダッシュボード',
        ANALYTICS: '分析',
        ECOMMERCE: 'Eコマース'
      }
    }
  }
};
```

Add Japanese:

1. Create:

```text
src/app/menu/i18n/ja.ts
```

2. Import it in [app.component.ts](E:/Angular-LE/full-version/src/app/app.component.ts):

```ts
import { locale as menuJapanese } from 'app/menu/i18n/ja';
```

3. Add language code:

```ts
this._translateService.addLangs(['en', 'fr', 'de', 'pt', 'ja']);
```

4. Register translations:

```ts
this._coreTranslationService.translate(
  menuEnglish,
  menuFrench,
  menuGerman,
  menuPortuguese,
  menuJapanese
);
```

5. Change default language:

```ts
// src/app/app-config.ts
appLanguage: 'ja'
```

Why clear `localStorage`? Because `CoreConfigService` stores config under `localStorage.config` when `enableLocalStorage: true`. That stored config overrides your new `app-config.ts` values until cleared.

To translate a new menu item:

```ts
{
  id: 'reports',
  title: 'Reports',
  translate: 'MENU.REPORTS.TITLE',
  type: 'item',
  icon: 'bar-chart',
  url: 'reports'
}
```

Then add `MENU.REPORTS.TITLE` to every language file.

**8. Removing Demo Features**
Safe removal process:

1. Remove menu entries from `src/app/menu/menu.ts`.
2. Remove route entries from `app.module.ts` or feature routing modules.
3. Delete the feature folder only after routes/menu no longer reference it.
4. Remove related fake DB files from `src/@fake-db` if unused.
5. Remove package dependencies only after searching for imports:

```bash
rg "fullcalendar|ngx-datatable|ng-apexcharts|ng2-flatpickr"
```

6. Run:

```bash
npm run build:prod
```

Be careful with shared dependencies like `NgbModule`, `CoreCommonModule`, Bootstrap, `TranslateModule`, and `PerfectScrollbarModule`.

**9. Styling And Theme**
Use:

```text
src/assets/scss/styles.scss
```

for custom global styles.

Use:

```text
src/assets/scss/variables/_variables.scss
```

for Bootstrap/global design variables.

Use:

```text
src/assets/scss/variables/_variables-components.scss
```

for Vuexy/custom component variables.

To change primary color, search first:

```bash
rg "primary|7367f0|#7367"
```

Then update the relevant `$primary` variable in the SCSS variables file. For example:

```scss
$primary: #ff6b6b;
```

Avoid editing `src/@core/scss` unless absolutely necessary.

**10. Real Backend API**
Your environment files already define:

```ts
apiUrl: 'http://localhost:4000'
```

Update:

```text
src/environments/environment.ts
src/environments/environment.prod.ts
```

Example:

```ts
export const environment = {
  production: false,
  hmr: false,
  apiUrl: 'https://dev-api.example.com'
};
```

For production:

```ts
export const environment = {
  production: true,
  hmr: false,
  apiUrl: 'https://api.example.com'
};
```

To disable fake backend:

1. Remove or comment this import in [app.module.ts](E:/Angular-LE/full-version/src/app/app.module.ts):

```ts
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { FakeDbService } from '@fake-db/fake-db.service';
import { fakeBackendProvider } from 'app/auth/helpers';
```

2. Remove from imports:

```ts
HttpClientInMemoryWebApiModule.forRoot(FakeDbService, ...)
```

3. Remove from providers:

```ts
fakeBackendProvider
```

4. Update services to call your real endpoints.

**11. Safe Files**
Safe to modify:

```text
src/app/main/
src/app/menu/menu.ts
src/app/menu/i18n/
src/app/app-config.ts
src/assets/scss/styles.scss
src/assets/scss/variables/
src/environments/
src/assets/images/logo/
```

Avoid modifying unless needed:

```text
src/@core/
src/@core/scss/
template layout internals
third-party library files
```

**12. Support And Docs**
Official Vuexy Angular docs:

https://demos.pixinvent.com/vuexy-angular-admin-template/documentation/

Official support portal:

https://pixinvent.ticksy.com/

ThemeForest support page:

https://themeforest.net/item/vuexy-vuejs-html-laravel-admin-dashboard-template/23328599/support

Sources: official Vuexy docs and your local project files. The docs describe Vuexy as Bootstrap 4 + NgBootstrap based, with AOT, lazy loading, role-based JWT auth, translation, and API-ready structure. ([demos.pixinvent.com](https://demos.pixinvent.com/vuexy-angular-admin-template/documentation/?utm_source=openai)) ([demos.pixinvent.com](https://demos.pixinvent.com/vuexy-angular-admin-template/documentation/guide/development/folder-structure.html?utm_source=openai)) ([demos.pixinvent.com](https://demos.pixinvent.com/vuexy-angular-admin-template/documentation/guide/development/installation.html?utm_source=openai))

**13. Performance**
Angular and Vue bundle/performance comparisons depend heavily on implementation. Vuexy Angular is heavier than a minimal Angular app because the full version includes many demo modules and third-party libraries. For production:

Use the Starter Kit.

Keep lazy loading.

Remove unused demo modules.

Remove unused dependencies.

Build with:

```bash
npm run build:prod
```

Use AOT production builds.

Prefer `ChangeDetectionStrategy.OnPush` for large custom components.

Avoid importing large shared demo modules into every feature.

Run bundle analysis:

```bash
npm run build:prod-stats
npm run bundle-analyzer
```




























I'll inspect the starter-kit to find the menu configuration and relevant sidebar files before giving step-by-step instructions.

No matches found. Your search pattern might be excluded completely by either the search.exclude settings or .*ignore files.
If you believe that it should have results, you can check into the .*ignore files and the exclude setting (here are some excluded patterns for reference:[**/node_modules,**/bower_components,**/*.code-search]).
Then if you want to include those files you can call the tool again by setting "includeIgnoredFiles" to true.

Searched for text `menu` (`**/starter-kit/src/**`), 403 results

Now I'll open menu.ts and app.module.ts to show exact locations to modify.

Read [](file:///e%3A/Inventory-Manager/starter-kit/src/app/menu/menu.ts)

Read [](file:///e%3A/Inventory-Manager/starter-kit/src/app/app.module.ts)

Read [](file:///e%3A/Inventory-Manager/starter-kit/src/app/menu/i18n/en.ts)

I'll add a new `Products` menu item and translations to the starter-kit files so the sidebar shows the link; then I'll run a quick grep to confirm changes.

Created 4 todos

Read [](file:///e%3A/Inventory-Manager/starter-kit/src/app/menu/i18n/fr.ts)

Read [](file:///e%3A/Inventory-Manager/starter-kit/src/app/menu/i18n/de.ts)

Read [](file:///e%3A/Inventory-Manager/starter-kit/src/app/menu/i18n/pt.ts)

Generating patch (22 lines) in [](file:///e%3A/Inventory-Manager/starter-kit/src/app/menu/menu.ts)


```

```


Generating patch (12 lines) in [](file:///e%3A/Inventory-Manager/starter-kit/src/app/menu/i18n/en.ts)


```

```


Generating patch (12 lines) in [](file:///e%3A/Inventory-Manager/starter-kit/src/app/menu/i18n/fr.ts)


```

```


Generating patch (12 lines) in [](file:///e%3A/Inventory-Manager/starter-kit/src/app/menu/i18n/de.ts)


```

```


Generating patch (12 lines) in [](file:///e%3A/Inventory-Manager/starter-kit/src/app/menu/i18n/pt.ts)


```

```


Searched for text `PRODUCTS` (`**/starter-kit/src/**`), 74 results

Completed: *Add Products menu item to `menu.ts`* (1/4)

**What I changed (quick)**  
- Added a `Products` item to the sidebar menu: menu.ts.  
- Added `MENU.PRODUCTS` translation keys to en.ts, fr.ts, de.ts, pt.ts.  
- Verified the `products` route already exists in product.module.ts and `ProductModule` is imported in app.module.ts, so the new link will work immediately.

How to add a new sidebar link (step-by-step)
- Open menu.ts and add a menu entry:
  - Simple item:
    {
      id: 'your-feature-id',
      title: 'Your Feature Title',
      translate: 'MENU.YOURFEATURE',
      type: 'item',
      icon: 'some-icon-name',
      url: 'your-feature-path'
    }
  - Collapsible (parent) with children:
    {
      id: 'parent',
      title: 'Parent',
      translate: 'MENU.PARENT',
      type: 'collapsible',
      icon: 'folder',
      children: [
        { id: 'child1', title: 'Child 1', translate: 'MENU.PARENT.CHILD1', type: 'item', url: 'child1' },
        ...
      ]
    }
- Add translations for the `translate` key in each file under i18n (e.g. add `YOURFEATURE: 'Your Feature'` to en.ts, and equivalents to fr.ts, de.ts, pt.ts).
- Ensure a route exists for the `url` you provided:
  - If the feature is implemented in a module and that module sets up `RouterModule.forChild(...)` with `path: 'your-feature-path'`, and that module is imported (eager) or lazy-loaded from app.module.ts, you’re done.
  - To lazy-load, add to app.module.ts routes:
    { path: 'your-feature-path', loadChildren: () => import('./main/features/YourFeature/your-feature.module').then(m => m.YourFeatureModule) }
- Restart dev server (if running) or rebuild to see the menu change.

Notes / best-practices
- Use the same `url` value as the route `path`. If you use a nested/collapsible menu, the children `url` should be the child route path.
- Keep icons using the icon names used by the template (Feather in Vuexy). I used `box` for Products.
- Add i18n keys for every language file to avoid missing-translation warnings.
- Prefer lazy-loading new feature modules for performance (add route with `loadChildren` as shown).

Files I edited
- menu.ts
- en.ts
- fr.ts
- de.ts
- pt.ts

Want me to:
- Add a nested/collapsible menu entry instead of a simple item? or
- Create a new feature module skeleton + route and register it (lazy-loaded) so the sidebar link has a real page to open?

Made changes.