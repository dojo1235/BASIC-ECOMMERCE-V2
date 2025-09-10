# API Documentation – Jumia-Inspired E-commerce

## Authentication

### Register
- **POST** `/api/auth/register`
- **Body:** `{ name, email, password }`
- **Response:** `{ message, token, user }`

### Login
- **POST** `/api/auth/login`
- **Body:** `{ email, password }`
- **Response:** `{ message, token, user }`


## Products

### Get all products
- **GET** `/api/products`
- **Query:** `?search=term` _(optional)_
- **Response:** `{ products: [...] }`

### Get product by ID
- **GET** `/api/products/:id`
- **Response:** `{ product: {...} }`

### Create product
- **POST** `/api/products`
- **Body:** `{ name, description, price, image, stock }`
- **Response:** `{ message, product }`

### Update product
- **PUT** `/api/products/:productId`
- **Body:** `{ name, description, price, image, stock }`
- **Response:** `{ message, product }`

### Delete product
- **DELETE** `/api/products/:productId`
- **Response:** `{ message }`


## Cart _(requires JWT token)_

### Get cart
- **GET** `/api/cart`
- **Response:** `{ cart: [ {product fields, quantity} ] }`

### Add to cart
- **POST** `/api/cart`
- **Body:** `{ productId, quantity }`
- **Response:** `{ message }`

### Update quantity
- **PUT** `/api/cart`
- **Body:** `{ productId, quantity }`
- **Response:** `{ message }`

### Remove from cart
- **DELETE** `/api/cart/:productId`
- **Response:** `{ message }`


## Orders _(requires JWT token)_

### Get orders
- **GET** `/api/orders`
- **Response:** `{ orders: [ {order+items} ] }`

### Checkout/place order
- **POST** `/api/orders/checkout`
- **Response:** `{ message, orderId, shipping }`

### Cancel order
- **DELETE** `/api/orders/:orderId`
- **Response:** `{ message }`


## Error Responses

All failed API calls return:
```json
{ "message": "Error message..." }
```

## Auth

- Pass JWT as `Authorization: Bearer <token>` or via `token` cookie.
- Register/Login responses include both `token` and `user`.


## Example: Register

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","email":"jane@mail.com","password":"test123"}'
```

---

## Example: Get Products

```bash
curl http://localhost:3000/api/products
```

---

## Example: Add To Cart

```bash
curl -X POST http://localhost:3000/api/cart \
  -H "Authorization: Bearer <jwt>" \
  -H "Content-Type: application/json" \
  -d '{"productId":1,"quantity":2}'
```

---

## Status Codes

- `200` OK
- `201` Created
- `400` Bad Request
- `401` Unauthorized (JWT missing/invalid)
- `404` Not Found
- `500` Server Error

---

**Contact:** info@example.com  
**Demo only. Not affiliated with jumia.com.ng**