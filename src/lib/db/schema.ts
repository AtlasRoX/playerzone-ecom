import { pgTable, text, timestamp, boolean, uuid, decimal, integer, jsonb, uniqueIndex } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name'),
  email: text('email').notNull().unique(),
  password: text('password'), // Will store hashed password for credentials
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const products = pgTable(
  'products',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    slug: text('slug').notNull(),
    price: decimal('price', { precision: 10, scale: 2 }).notNull(),
    image: text('image').notNull(),
    category: text('category').default('T-SHIRT').notNull(),
    colors: jsonb('colors').default('[]').notNull(),
    span: text('span').default('col-span-12 lg:col-span-6').notNull(),
    description: text('description').default('').notNull(),
    details: jsonb('details').default('[]').notNull(),
    sizes: jsonb('sizes').default('[]').notNull(),
    rating: decimal('rating', { precision: 2, scale: 1 }).default('0.0').notNull(),
    reviews: integer('reviews').default(0).notNull(),
    gallery: jsonb('gallery').default('[]').notNull(),
    isNew: boolean('is_new').default(false).notNull(),
    inStock: boolean('in_stock').default(true).notNull(),
    trending: boolean('trending').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    slugIdx: uniqueIndex('products_slug_idx').on(table.slug),
  }),
);

export const customDesigns = pgTable('custom_designs', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  image: text('image').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const fabrics = pgTable('fabrics', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description').default('').notNull(),
  image: text('image'), // Optional fabric texture/image
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const customOrders = pgTable('custom_orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  customerName: text('customer_name').notNull(),
  customerPhone: text('customer_phone').notNull(),
  
  // Design can either be selected from existing OR a custom upload
  designId: uuid('design_id').references(() => customDesigns.id),
  customDesignImage: text('custom_design_image'), // Uploaded to Cloudinary
  
  fabricId: uuid('fabric_id').references(() => fabrics.id).notNull(),
  quantity: integer('quantity').notNull().default(1),
  
  // Array of { name, number, size }
  roster: jsonb('roster').default('[]').notNull(),
  
  note: text('note').default(''),
  status: text('status').default('PENDING').notNull(), // PENDING, REVIEWED, IN_PRODUCTION, COMPLETED, CANCELLED
  
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).default('0.00').notNull(),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
