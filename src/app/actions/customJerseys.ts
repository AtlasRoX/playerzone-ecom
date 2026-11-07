'use server';

import { db } from '@/lib/db';
import { customDesigns, fabrics, customOrders } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function getActiveDesigns() {
  return await db.select().from(customDesigns).where(eq(customDesigns.isActive, true));
}

export async function getActiveFabrics() {
  return await db.select().from(fabrics).where(eq(fabrics.isActive, true));
}

export async function submitCustomOrder(data: {
  customerName: string;
  customerPhone: string;
  designId?: string;
  customDesignImage?: string;
  fabricId: string;
  quantity: number;
  roster: { name: string; number: string; size: string }[];
  note: string;
}) {
  const result = await db.insert(customOrders).values({
    customerName: data.customerName,
    customerPhone: data.customerPhone,
    designId: data.designId || null,
    customDesignImage: data.customDesignImage || null,
    fabricId: data.fabricId,
    quantity: data.quantity,
    roster: data.roster,
    note: data.note,
    totalAmount: '49.99', // Fixed amount for now as requested
    status: 'PENDING',
  }).returning();
  
  return result[0];
}
