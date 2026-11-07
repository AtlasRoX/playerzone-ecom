import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ShopProvider } from "@/lib/shop";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import StoreFrontWrapper from "@/components/StoreFrontWrapper";
import { Agentation } from "agentation";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { type Product } from "@/lib/products";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Player Zone | Custom Jerseys & Sportswear",
  description: "Custom jerseys, team uniforms, and athletic sportswear built for performance.",
};

export const dynamic = 'force-dynamic';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const allProductsData = await db.select().from(products);
  const allProducts = allProductsData.map(p => ({
    ...p,
    price: parseFloat(p.price as string),
    rating: parseFloat(p.rating as string),
  })) as unknown as Product[];
  return (
    <html lang="en">
      <body className={`${outfit.variable} font-sans antialiased`}>
        <ShopProvider initialProducts={allProducts}>
          <div className="flex min-h-dvh w-full flex-col overflow-x-hidden bg-white text-ink">
            <StoreFrontWrapper>
              <Navigation />
            </StoreFrontWrapper>
            <main className="flex w-full flex-1 flex-col items-start">
              {children}
            </main>
            <StoreFrontWrapper>
              <Footer />
              <CartDrawer />
            </StoreFrontWrapper>
            {process.env.NODE_ENV === "development" && <Agentation />}
          </div>
        </ShopProvider>
      </body>
    </html>
  );
}
