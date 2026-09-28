# HappyBite Home

Responsive Indonesian bakery homepage built with React, Vite, and Tailwind CSS v3, based on the supplied HappyBite mockup with the updated, simplified Hero, About, testimonial heading, and footer.

## Run locally

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. To check a production build:

```sh
npm run lint
npm run build
npm run preview
```

## Project structure

- `src/pages/Home.jsx` assembles the homepage and owns the active dialog state.
- `src/pages/Login.jsx` renders the `/login` page and accessible login/register tabs.
- `src/pages/CatalogMenu.jsx` renders `/katalog` with search, category filters, wishlist toggles, and load more.
- `src/pages/ProductDetail.jsx` renders `/katalog/:productId` using the same mock data, shared navbar, footer, and cart count. Product images and names link here from catalog and pairing cards.
- `src/components/ProductGallery.jsx` owns thumbnail selection, wishlist state, and an accessible zoom dialog. `RelatedProductCard.jsx` renders pairing suggestions.
- `src/pages/Checkout.jsx` renders `/checkout` with the shared navbar/footer, checkout steps, controlled shipping form, and a summary derived from selected shared cart items.
- `src/components/CheckoutField.jsx` and `CheckoutSteps.jsx` provide reusable checkout fields and progress navigation.
- `src/pages/Payment.jsx` renders `/pembayaran` with a persistent deadline, copy/download actions, local payment-proof selection, and a recipient/order summary. `PaymentProof.jsx` and `PaymentSummary.jsx` keep these sections reusable.
- Successful confirmation opens `/riwayat-pesanan`; the legacy `/pesanan-berhasil` URL redirects there too.
- `src/context/AuthProvider.jsx` wraps the app with shared demo authentication; `authContext.js` exports `useAuth`. `ProfileDropdown.jsx` exposes profile, order history, and logout.
- `src/context/NotificationsProvider.jsx` owns account-scoped notifications and read status under `localStorage['happybite-notifications-v1']`. `NotificationButton.jsx` opens `NotificationPanel.jsx` as a centered modal overlay, without changing routes.
- `src/pages/AccountPlaceholder.jsx` renders the `/profil` placeholder using the shared navbar/footer.
- `src/pages/OrderHistory.jsx` renders the protected `/riwayat-pesanan` page. `OrderHistoryCard.jsx`, `OrderTracking.jsx`, and `OrderHistoryDialog.jsx` provide reusable cards, delivery stages, details, and local note editing.
- `src/context/OrdersProvider.jsx` owns shared, account-scoped orders persisted in `localStorage['happybite-orders-v1']`. `src/data/orders.js` creates checkout snapshots and initializes two labeled examples from `orderHistory.js`. `src/utils/orderPdf.js` generates downloadable demo receipts locally.
- `src/data/shopSession.js` restores tab-session cart/checkout/order state and centralizes payment totals and order consistency checks.
- `src/pages/Cart.jsx` renders `/keranjang`, with reusable `CartItemCard` and `CartGiftMessage` components.
- `src/data/cart.js` defines the shared cart reducer for product/variant lines, quantities, selection, and removal.
- `src/components/CatalogProductCard.jsx` and `CatalogVariantDialog.jsx` render reusable product cards and bundle selections.
- `src/components/LoginForm.jsx` owns login input state, validation, and password visibility.
- `src/components/RegisterForm.jsx` owns independent registration input state, validation, password visibility, and remember-me state.
- `src/App.jsx` defines storefront, auth, checkout, payment, and account routes; owns shared cart, greeting, checkout, and order state; and handles route titles and scroll positions.
- `src/components/` contains each requested section plus shared buttons, icons, headings, cards, and dialogs.
- `GalleryShowcase` includes `CatalogGateBanner`.
- `src/data/products.js` holds product names, descriptions, tags, and image paths.
- `src/data/catalogProducts.js` holds eight initial catalog products and four additional mock products, with category counts computed from all twelve.
- `tailwind.config.js` defines all requested brand colors, the font, and card shadows.
- `src/index.css` contains Tailwind directives and minimal Tailwind base defaults. All component styling uses utility classes.

## Replace the photos

All photos are local placeholders in `public/images/`. See [the image guide](public/images/README.md) for filenames and recommended sizes. The generic cookie photos intentionally do not represent the named flavors yet.

Plus Jakarta Sans loads from Google Fonts with a system sans-serif fallback. The cookie brand mark is a local SVG placeholder in `public/favicon.svg`.

## Interactions and integration points

The mobile menu, gallery search, shopping cart, FAQ accordions, and keyboard-accessible dialogs work locally. The navbar cart link opens `/keranjang`. Dialogs support Escape, focus trapping, focus restoration, and background scroll locking. The layout respects reduced-motion preferences.

The Home, Login, and Catalog pages run without an authentication or commerce backend:

- Home account and ordering CTAs navigate to `/login`. The shared navbar's Katalog Menu link opens `/katalog`, with active route styling for Home and Catalog. The Login page's Kembali link returns to `/katalog`.
- Catalog search and category filters combine, and Load More reveals the remaining mock products. Adding from the catalog, detail page, and pairing cards updates shared product/variant lines; matching combinations merge quantities. Each package counts as one item. Cart, selection, greeting preferences, checkout fields, and payment-session metadata persist through refresh in `sessionStorage` under `happybite-shop-v1`; wishlist selections are local to each page. No backend order submission or API integration is implemented.
- Cart quantities and the navbar badge count all items. The summary counts only selected quantities; unchecked items remain in the cart. Select All supports a mixed state, quantity has a minimum of one, delete removes a line, and Hapus Semua clears the entire cart. Checkout is disabled with no selected items.
- The cart and checkout totals equal the selected product subtotal, with no discounts or invented delivery fees. The optional gift message is limited to 150 characters and shares app-level state with checkout. Checkout reads current selected lines and product prices directly from shared state, so editing the cart cannot leave a stale order snapshot. Empty selection shows a return-to-cart state.
- Checkout validates recipient name, an Indonesian mobile number, delivery address, region, and a five-digit postal code. Email is optional but validated when entered; courier notes are optional. Fields start empty with illustrative placeholders and share app-level state with payment. Valid submission creates/reuses a local order number and 15-minute deadline, then navigates to `/pembayaran`. No details are logged or transmitted to a backend. Region choices and service availability are fixtures to verify before launch.
- Payment restores the same recipient and selected items after refresh. A changed cart, address, or greeting invalidates the previous payment session and returns to checkout. Timer calculations use the absolute saved deadline, so background tabs and reloads do not reset it. Expiry blocks proof selection and confirmation; resubmitting checkout starts a new session. Shipping and service fees are currently zero, keeping the payable total identical to checkout.
- `public/images/qris-demo.svg` is an intentionally non-payable QR illustration with a demo watermark. Merchant, NMID, and gateway verification are not live. Download saves the local SVG; copy writes the numeric total. JPG/PNG/PDF proof files must be nonempty and at most 5MiB. Files stay in component memory and must be selected again after refresh. Selecting a file does not upload it. Confirmation saves a local order with status Diproses Dapur and payment status Menunggu verifikasi; it never claims a real payment succeeded.
- Confirmation snapshots selected products (including variants, images, unit prices, and quantities), greeting, all recipient fields, sender name, totals, timestamp, and the existing generated payment-session ID. Only after a successful localStorage write are ordered lines removed, greeting reset, and the pending payment session marked placed. Unchecked cart lines remain. Repeated confirmation of the same session does not duplicate the order. Storage failure shows an error and keeps the cart intact.
- Storefront pages use a `flex min-h-dvh flex-col` root with a `flex-1` main and the shared footer directly afterward. Checkout uses 40px bottom padding instead of a fixed-height spacer. Login already uses the same flex layout pattern with its existing compact header/footer.
- Catalog photos, ratings, stock, prices, and product details are placeholders. Bundle selection uses preset flavor combinations. Promotional sections remain omitted throughout the app.
- Product details include four gallery slots, unit notes, descriptions, and related IDs in `catalogProducts.js`. The pairing-only coffee fixture does not change catalog counts. Replace mock weight and product details with verified product information before launch.
- Detail quantity starts at one and updates the subtotal and shared cart by the selected quantity. Quantity and bundle choices are controlled locally and reset on product navigation. Buy Now puts that product/variant and chosen quantity into the shared cart, selects it alone, and opens checkout; other cart lines remain available but unselected. The WhatsApp button uses the existing contact-availability dialog until a verified contact URL is configured.
- Login validates email format and a nonempty password, supports password visibility and a checked-by-default remember-me option, and preserves input values when switching tabs.
- Registration validates a nonblank full name, a valid email, and a password of at least 8 characters. Its input values, password visibility, checkbox, and feedback are independent of Login and persist when switching tabs. Both forms use email and password only; registration does not include social login, password recovery, or discount offers.
- Valid Login and Register submissions call `useAuth().login()` and normally navigate home. Guests reaching payment are asked to sign in and return to `/pembayaran` with their checkout intact. Login uses the placeholder name Amanda Putri plus the entered email; Register uses the entered name and email. `localStorage['happybite-auth-v1']` stores only `{ isLoggedIn, user: { name, email } }`; passwords are never logged, persisted, or sent. The school-project auth flag persists regardless of the existing remember-me checkbox and does not verify credentials against a server.
- Guest navigation is unchanged. Signed-in navigation uses Beranda, Katalog Menu, Riwayat Pesanan, Tentang Kami, and Kontak & FAQ, followed by the unchanged cart and a profile dropdown. The dropdown closes on outside click, Escape, or focus leaving it. Profile opens its placeholder, while order history opens the full local demo page. Logout removes only the auth entry and returns home, leaving the shared cart unchanged. Both account pages redirect guests to `/login`. This is UI state, not server-enforced authentication.
- Order history reads shared orders, newest first, scoped to the signed-in account's normalized email. Orders survive refresh and browser restarts on the same browser/origin. Two clearly labeled Demo examples (shipping and completed) remain for illustration; only the shipping example has a tracking bar. Three cards appear initially; Load More reveals the rest. Status counts, invoice/product search, and date filters use current state and the actual current date. Edited courier notes persist too. Recipient and address details are available in Detail Pesanan. The admin chat button opens the existing contact-availability dialog until a verified WhatsApp URL is configured. There is no backend synchronization, courier integration, or payment verification.
- The Login footer opens help or availability dialogs for privacy and terms. The SSL badge and copyright copy follow the approved mockup; transport security must be configured on the deployment host.
- Only signed-in navigation shows the notification bell, next to the profile button. Guest catalog links have a lock icon on desktop and mobile. Successfully placing an order creates one unread status notification, deduplicated by account, order ID, and status. Existing checkout orders are recovered on startup; sample orders do not generate alerts. Notification links mark the item read and open order history. Mark All Read applies to the current account. Only order-status notifications are supported; retired categories are removed when reading older browser storage and excluded from badges and counts.
- The notification modal uses a dimmed backdrop, trapped keyboard focus, Escape/outside/X dismissal, restored trigger focus, and a separately scrollable list. Relative timestamps refresh every minute while open. Notifications are local school-project state; there are no backend courier updates or push notifications.
- Individual review stars, testimonials, certifications, and contact details are static content.
- Footer contact and social buttons currently show an availability message. Replace them with verified contact URLs before launch.
- Catalog prices are visible mock data; authentication, ordering, payments, and checkout still need backend integration.

## Animation

`src/components/Animation.jsx` centralizes the Motion (`motion/react`) presets.
Sections reveal at 20% visibility with a 24px rise and a 0.55s ease-out, reset
when leaving the viewport, and replay on every re-entry in either scroll direction.
Card grids stagger by 0.12s; the hero uses the same viewport-triggered sequence with
its image entering from the right. Product cards scale to 1.03
on hover. Reduced-motion users receive
ordinary HTML with all content visible immediately. Existing element types,
Tailwind layout classes, and interactive controls are preserved.

Browser animation checks cover repeating reveals and resets, stagger timing,
hover scales, reduced-motion visibility, and CTA interaction during entrance.

## Verification

Production build and ESLint checks pass. Browser checks cover image loading, runtime errors, search results and empty states, account navigation, FAQ, and mobile navigation.

Catalog browser checks cover direct loading and refresh, active navigation, combined search/category filtering, category counts, empty states, load more, wishlist toggles, bundle selection, cart-count persistence across routes, and responsive grids without horizontal overflow at 320, 375, 640, 768, 1024, 1312, and 1536 pixels.

Product detail browser checks cover catalog-to-detail links, active navigation, dynamic breadcrumbs, thumbnail changes, zoom dismissal and focus restoration, wishlist, quantity minimum and subtotal, shared cart increments, pairing links and state reset, bundle options, checkout navigation, invalid product IDs, direct refresh, image loading, and responsive layouts at 320–1536 pixels.

Login browser checks cover direct loading and refresh at `/login`, Home account links, form validation, password visibility, remember-me state, tab and keyboard navigation, footer dialogs, and responsive layouts from 320 to 1280 pixels.

Registration browser checks cover inline errors for empty/whitespace names, invalid emails, and passwords under 8 characters; valid submissions; separate Login/registration state; password toggles; tab switching and value persistence; input focus styling; and layouts from 320 to 1280 pixels.

Cart browser checks cover empty state, adds from catalog and detail, merged quantities and separate variants, select-all/mixed selection, partial totals, quantity minimum, synchronized badges, removal and clear, 150-character message limits, shared checkout data, and layouts without overflow at 320–1536 pixels.

Checkout browser checks cover selected items and totals, shared navbar/badge, greeting persistence when editing the cart, required/invalid fields and focus, payment navigation, Buy Now, empty/direct-refresh states, and no overflow or extra footer spacer at 320, 375, 640, 768, 1024, 1312, and 1536 pixels.

Payment browser checks cover all recipient fields, direct-route and stale-order guards, preserved IDs/deadlines across refresh, timer ticks, copy/download, invalid/oversized files, removal and drag/drop, disabled/valid confirmation, expiry/restart, demo success, and responsive layouts at 320–1536 pixels.

Authentication browser checks cover Login/Register validation and redirects, exact guest/member link order, active route styling, localStorage refresh, password exclusion, profile/history routes, dropdown outside-click/Escape/focus behavior, mobile menus, logout, guest route guards, and unchanged cart quantities.

Order history browser checks cover authentication redirects, navbar/dropdown access, status counts, combined search/date filters, empty states, load more, detail dialogs, local note edits, PDF downloads, reduced-motion tracking, refresh, and responsive layouts without overflow at 320–1536 pixels.

Connected-order browser checks cover Cart → Checkout → guest sign-in → QRIS confirmation → history, exact recipient/item/greeting/total snapshots, persistence across reload and a new browser session, account isolation, storage failures without cart loss, repeated-confirmation deduplication, partial checkout and variants, date/search/status filtering, and persisted note edits.

Notification browser checks cover guest/member navbar differences, catalog lock icons, checkout-generated alerts and deduplication, dynamic badges/category counts, mark-all and individual read persistence, account isolation, modal focus and dismissal, order-history links, and scrollable layouts at 320–1536 pixels. Legacy unsupported-category fixtures verify that old entries no longer appear or affect unread counts.

## Hosting

React Router uses browser history. Configure the production host to serve `index.html` for app routes such as `/login`, `/katalog`, `/checkout`, and `/pembayaran`, so direct links and refreshes work. Vite's development server already supports this fallback.
