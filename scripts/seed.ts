/**
 * Seeds the product catalogue by calling the app's `/api/seed` route.
 *
 * The route has to run inside Next: product images are bundler-resolved to
 * build-hashed URLs (`/_next/static/media/<name>.<hash>.png`), which cannot be
 * derived in a plain Node process. Re-implementing the inserts here would
 * store paths the storefront cannot load.
 *
 * Usage:
 *   pnpm dev          # in one terminal
 *   pnpm seed         # in another
 */
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const BASE_URL = process.env.SEED_BASE_URL ?? 'http://localhost:3000';

async function main() {
  const url = `${BASE_URL}/api/seed`;

  console.log(`Seeding products via ${url}...`);

  let response: Response;
  try {
    response = await fetch(url);
  } catch (error) {
    throw new Error(
      `Could not reach ${url}. Is the dev server running? Start it with \`pnpm dev\`.\n${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }

  const body = await response.text();

  if (!response.ok) {
    throw new Error(`Seeding failed (HTTP ${response.status}): ${body}`);
  }

  console.log('Seeding completed successfully!');
}

main().catch((err) => {
  console.error('Error seeding database:', err instanceof Error ? err.message : err);
  process.exit(1);
});
