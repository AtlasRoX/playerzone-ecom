import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products } from '@/lib/db/schema';
import { PRODUCTS } from '@/lib/products';
import { slugify } from '@/lib/slug';

export async function GET() {
  try {
    console.log('Seeding products from API route...');

    await db.delete(products);

    for (const product of PRODUCTS) {
      await db.insert(products).values({
        name: product.name,
        slug: slugify(product.name + ' ' + product.id),
        price: product.price.toString(),
        image: product.image,
        category: product.category,
        colors: product.colors || [],
        span: product.span,
        description: product.description,
        details: product.details || [],
        sizes: product.sizes || [],
        rating: product.rating.toString(),
        reviews: product.reviews,
        gallery: product.gallery || [],
        isNew: product.isNew || false,
        inStock: product.inStock,
        trending: product.trending || false,
      });
    }

    return NextResponse.json({ message: 'Seeding completed successfully!' });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 });
  }
}
