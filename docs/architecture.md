# Architecture Overview – Jumia-Inspired E-commerce

## Stack

- **Backend:** Node.js (Express)
- **Database:** MySQL
- **Frontend:** HTML5, CSS3, JavaScript (modular, no framework)

---

## Backend Structure

```
/src
  /config        # DB connection, schema
  /controllers   # Route handlers
  /middlewares   # Auth, validation, error handling
  /models        # DB access for users, products, cart, orders
  /routes        # API route definitions
  /utils         # JWT, password hashing, helpers
server.js        # Express entry point
```

### Key Concepts

#### Auth
- JWT for auth. `authenticate` middleware checks token (header or cookie).
- User passwords hashed (bcryptjs).
- Token contains: `{ id, email, name }`.

#### API
- RESTful endpoints, all `/api/*`.
- Errors returned as `{ message }`, status codes as per REST standards.
- Backend serves static frontend from `/public`.

#### Database
- See `/src/config/schema.sql` for schema.
- `users`, `products`, `cart`, `orders`, `order_items` tables.
- Foreign keys with cascade deletes for referential integrity.

---

## Frontend Structure

```
/public
  /css          # styles.css
  /images       # favicon, product images
  /js
    /components # header, footer, toast
    /pages      # index, cart, orders, product, login, register
    /utils      # api, auth, dom
  index.html    # Home (product listing)
  cart.html     # Cart page
  orders.html   # Orders page
  product.html  # Product details
  login.html    # Login
  register.html # Register
```

### Features

- **SPA-like navigation:** Each page loads dynamic data via JS modules.
- **Accessibility:** ARIA roles, keyboard navigation, high contrast, semantic HTML.
- **Mobile-first:** Responsive grid and forms.
- **Notifications:** Toasts for all user feedback (no native alerts).

---

## Deployment

- Single `npm start` runs Express backend and serves frontend.
- Configure `/config/db.js` and `.env` for your DB.
- Place product images in `/public/images/`.
- Add admin features (CRUD for products) as desired.

---

## Security & Quality

- All passwords hashed, tokens signed and expire in 7 days.
- Input validation and centralized error handling.
- No sensitive info in tokens or responses.
- Clean, modular codebase suitable for scaling and production.

---

## Customization

- To add categories, payments, or admin dashboard: extend models/controllers/routes.
- To internationalize: add language support in frontend and error messages.

---

**Contact:** info@example.com  
**Demo project, not affiliated with jumia.com.ng**