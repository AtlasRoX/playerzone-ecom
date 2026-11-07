# PlayerZone

Custom jersey and sportswear e-commerce platform. Shop pre-designed kits, build a
custom jersey from scratch in the browser, and manage the catalogue, orders,
fabrics and designs from an admin dashboard.

## Tech Stack

| Layer      | Choice                                                          |
| ---------- | --------------------------------------------------------------- |
| Framework  | Next.js 16 (App Router, `src/` layout)                           |
| UI         | React 19, Tailwind CSS 4, `lucide-react`, GSAP                  |
| Database   | Neon Postgres (serverless)                                       |
| ORM        | Drizzle ORM + Drizzle Kit                                        |
| Auth       | NextAuth v5 (Credentials provider, bcryptjs)                     |
| Media      | Cloudinary (AVIF via `sharp`)                                    |
| Runtime    | Node 22, pnpm 10 (versions pinned in `.mise.toml`)               |

## Prerequisites

- Node.js 22
- pnpm 10 (`corepack enable` is enough)
- A [Neon](https://neon.tech) Postgres database
- A [Cloudinary](https://cloudinary.com) account (only needed for custom jersey image uploads)

## Getting Started

```bash
pnpm install
cp .env.example .env.local
# fill in .env.local
pnpm db:push
pnpm dev
```

The app runs at [http://localhost:3000](http://localhost:3000).

### Environment Variables

| Variable                    | Purpose                                                     |
| --------------------------- | ----------------------------------------------------------- |
| `DATABASE_URL`              | Neon connection string                                       |
| `AUTH_SECRET`               | NextAuth signing secret (`openssl rand -base64 32`)          |
| `CLOUDINARY_CLOUD_NAME`     | Cloudinary cloud name                                        |
| `CLOUDINARY_API_KEY`        | Cloudinary API key                                            |
| `CLOUDINARY_API_SECRET`     | Cloudinary API secret                                         |
| `SEED_BASE_URL`             | Optional. Origin `pnpm seed` targets (default `http://localhost:3000`) |

`.env.local` is git-ignored. Only `.env.example` is committed.

## Database

```bash
pnpm db:generate   # generate migrations from the schema
pnpm db:push       # push schema straight to the database
pnpm db:migrate    # apply generated migrations
pnpm db:studio     # open Drizzle Studio
```

The schema lives in `src/lib/db/schema.ts` and defines five tables:

- **users** — admin accounts (email, bcrypt-hashed password)
- **products** — catalogue items; colours, sizes, details and gallery are stored as `jsonb`
- **custom_designs** — pre-made designs customers can pick for a custom jersey
- **fabrics** — fabric options offered on the custom jersey builder
- **custom_orders** — custom jersey orders, including the player roster as `jsonb`

### Seeding

To populate the catalogue with the starter products, start the dev server in
one terminal and seed from another:

```bash
pnpm dev      # terminal 1
pnpm seed     # terminal 2
```

`pnpm seed` calls `GET /api/seed` on the running app, which **deletes all
existing products first** and re-inserts the catalogue. Avoid running it
against a production database.

The seeding has to happen inside Next rather than in a standalone script
because product images are bundler-resolved to build-hashed URLs
(`/_next/static/media/<name>.<hash>.png`). Those hashes only exist once the
app has been bundled, so a plain Node process cannot compute them.

Set `SEED_BASE_URL` to target a different origin (defaults to
`http://localhost:3000`).

### Creating an admin user

Hash the password and insert the user into the `users` table in the Neon console:

```bash
pnpm hash-password "your-password"
```

Insert the returned hash as `password` for a row with the email you want to
sign in with. Admins sign in at `/admin/login`.

## Routes

**Storefront**

| Route                   | Purpose                              |
| ----------------------- | ------------------------------------ |
| `/`                     | Home page                            |
| `/shop`                 | Full catalogue                       |
| `/product/[id]`         | Product detail                       |
| `/custom-jersey`        | Custom jersey landing page           |
| `/customizer`           | Custom jersey builder                |
| `/pre-designed-jerseys` | Pre-designed kits                    |
| `/designed-kits`        | Designed kits                        |
| `/wishlist`             | Wishlist                             |

**Admin** (all behind auth)

| Route                | Purpose                        |
| -------------------- | ------------------------------ |
| `/admin`             | Dashboard overview             |
| `/admin/products`    | Product list                   |
| `/admin/products/new`| Create a product               |
| `/admin/products/[id]/edit` | Edit a product          |
| `/admin/orders`      | Custom orders                  |
| `/admin/fabrics`     | Manage fabrics                 |
| `/admin/designs`     | Manage custom designs          |
| `/admin/login`       | Admin sign-in                  |

**API**

| Route                       | Method | Purpose                                  |
| --------------------------- | ------ | ---------------------------------------- |
| `/api/auth/[...nextauth]`   | ALL    | NextAuth handlers                        |
| `/api/upload`               | POST   | Upload a design image (converted to AVIF) |
| `/api/seed`                 | GET    | Reset the catalogue to the starter set   |

## Scripts

```bash
pnpm dev           # start the dev server
pnpm build         # production build
pnpm start         # run the production build
pnpm lint          # eslint
pnpm seed          # reset the product catalogue (dev server must be running)
pnpm hash-password # hash a password for the admin user
```

## Image Handling

Designs uploaded through `/api/upload` are converted to AVIF with `sharp` and
stored in the `custom_jerseys` folder on Cloudinary. The response is the
Cloudinary result object, whose `secure_url` is what gets persisted against the
order.

## Repository Layout

```
src/
  app/           routes, pages and API handlers
  components/    UI components (storefront and shared)
  lib/           db client, schema, product data, helpers
  imports/       bundled image assets
  auth.ts        NextAuth configuration
  middleware.ts  protects /admin routes
drizzle/         generated SQL migrations
scripts/         seed and password-hashing helpers
```

## Deployment

The app is ready for Vercel. Add the same environment variables in the
project settings, and make sure Git LFS is enabled for the repository so the
bundled PNG assets resolve at build time.

### Git LFS

The product photography under `src/imports/Responsive/` is tracked with Git
LFS (see `.gitattributes`). Clone and build with LFS installed, or the images
will come down as pointer files and the storefront will render broken images:

```bash
git lfs install
git lfs pull
```

## Known Issues

- **`src/middleware.ts` is deprecated.** Next.js 16 warns at build time and
  expects the `proxy` file convention instead. The middleware still runs, but
  the filename should be migrated to `src/proxy.ts`.
- **Lint currently reports 7 errors.** These predate the initial commit and
  are mostly `no-explicit-any` and unused-variable hits in the storefront
  components.

## License

Private — all rights reserved.
