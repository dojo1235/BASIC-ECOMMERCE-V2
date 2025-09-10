# JUMIA E-Commerce Backend

Production-ready, fullstack e-commerce backend inspired by Jumia.

## Tech Stack

- Node.js, Express
- MySQL (mysql2)
- JWT, bcryptjs, dotenv, cors
- Zod validation
- Vitest (unit and integration tests)
- Supertest

## Project Structure

```
├── src/
│   ├── config/
│   ├── constants/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── models/
│   ├── middlewares/
│   ├── schemas/
│   └── utils/
├── tests/
│   ├── integration/
│   └── unit/
├── .env
├── vitest.config.js
├── package.json
└── README.md
```

## Running Locally

1. Create `.env` file (see `.env.example` for needed variables).
2. Setup MySQL database and run `src/config/schema.sql`.
3. Seed with `src/config/product-seed.sql` if needed.
4. Install dependencies:  
   ```bash
   npm install
   ```
5. Start dev server:  
   ```bash
   npm run dev
   ```

## Testing

- All tests run with Vitest.
- Unit tests mock DB and require no server/db.
- Integration tests require MySQL running and use the seed/reset scripts.

## API Response Format

All responses are JSON:
```json
{
  "success": true,
  "data": { ... },
  "message": "Readable message here"
}
```

## Contact

Email: dojo10295@gmail.com

## License

MIT License – created by BRIGGS DIVINE TOBIN