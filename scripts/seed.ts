import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as dotenv from 'dotenv';
import * as schema from '../src/lib/db/schema';
import { PRODUCTS } from '../src/lib/products';
import { slugify } from '../src/lib/slug';

dotenv.config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is missing in .env.local');
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql, { schema });

async function main() {
  console.log('Seeding products...');

  for (const product of PRODUCTS) {
    await db.insert(schema.products).values({
      name: product.name,
      slug: slugify(product.name + ' ' + product.id),
      price: product.price.toString(),
      image: product.image,
      isNew: product.isNew,
      inStock: product.inStock,
      trending: product.trending || false,
    });
  }

  console.log('Seeding completed!');
}

main().catch((err) => {
  console.error('Error seeding database:', err);
  process.exit(1);
});
