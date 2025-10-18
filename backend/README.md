# Vue TSOA MongoDB Template API - Backend

This README covers how to run the backend API server.

# Prerequisites

- Node 18+ and npm
- MongoDB (local or via docker-compose)
- Environment variables: create a `.env` file in the `backend` folder with the following keys:
  - DB_CONN_STRING
  - DB_NAME
  - USERS_COLLECTION_NAME

# Seeder (`src/seed.ts`)

A TypeScript seeder is included to populate the database with sample admin users.

## Examples

### Docker compose
Run seeder inside docker-compose

If you're using the provided `docker-compose.yml` for the full stack, seed from inside the backend container:

```powershell
# run the seeder inside the running backend container
docker compose exec backend npm run seed -- --force
```

### Baremetal
Run seeder in development (ts-node):

```powershell
# from backend folder
npm run seed -- --force
```

Build and run compiled seeder (production-style):

```powershell
npm run build
npm run seed:prod -- --force
```

## Scripts in `package.json`

- `npm run seed` - runs the seeder using `ts-node` (development). Accepts flags.
- `npm run seed:prod` - run the compiled JS after `npm run build`.

Available flags

- `--force` or `-f` : Force seeding even if the users collection already has documents.
- `--drop` : Drop the collections before inserting sample data.

Safety: production protection

The seeder protects against destructive flags in production. If `NODE_ENV` is set to `production`, the seeder will refuse to run when `--force` or `--drop` are provided.


## Notes

- The seeder uses placeholder password hashes. Use application registration endpoints to create real users with properly hashed passwords.
- The seeder reads the same environment variables as the app (via dotenv). When running inside Docker, ensure the container has the correct env vars.
- If you want automatic seeding on container startup for dev only, open an issue or request and I can add an opt-in mechanism (e.g. `SEED_ON_START=true`).
