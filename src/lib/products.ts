import {
  productBasket,
  productCasualShoe,
  productSkateOne,
  productSkateWide,
  productSkateWideTwo,
  productSportwear,
} from '@/components/ui/images'

export const CATEGORIES = ['SHORTS', 'HAT', 'JACKETS', 'SHOES', 'T-SHIRT']
export type Category = string

export const COLORS = [
  { label: 'RED PASTEL', fill: '#e25f5f' },
  { label: 'LIME GREEN', fill: '#b8e25f' },
  { label: 'NAVY BLUE', fill: '#233c6b' },
  { label: 'CLEAN WHITE', fill: '#ffffff', ring: '#dedede' },
  { label: 'BLUE SKY', fill: '#5fabe2' },
  { label: 'PURPLE', fill: '#b54ef4' },
  { label: 'PINK', fill: '#f44e8a' },
  { label: 'YELLOW', fill: '#f4cf4e' },
  { label: 'DARK GREEN', fill: '#44936d' },
]

export type ColorLabel = string

export const COLOR_HEX_MAP: Record<string, { fill: string; ring?: string }> = {
  'RED PASTEL': { fill: '#e25f5f' },
  'LIME GREEN': { fill: '#b8e25f' },
  'NAVY BLUE': { fill: '#233c6b' },
  'CLEAN WHITE': { fill: '#ffffff', ring: '#dedede' },
  'WHITE': { fill: '#ffffff', ring: '#dedede' },
  'BLUE SKY': { fill: '#5fabe2' },
  'PURPLE': { fill: '#b54ef4' },
  'PINK': { fill: '#f44e8a' },
  'YELLOW': { fill: '#f4cf4e' },
  'DARK GREEN': { fill: '#44936d' },
  'BLACK': { fill: '#18181b' },
  'RED': { fill: '#ef4444' },
  'BLUE': { fill: '#3b82f6' },
  'GREEN': { fill: '#22c55e' },
  'GRAY': { fill: '#6b7280' },
  'GREY': { fill: '#6b7280' },
  'ORANGE': { fill: '#f97316' },
  'BEIGE': { fill: '#f5f5dc' },
  'BROWN': { fill: '#78350f' },
}

export function getColorSwatch(label: string) {
  const upper = label.trim().toUpperCase()
  if (COLOR_HEX_MAP[upper]) {
    return { label, ...COLOR_HEX_MAP[upper] }
  }
  let hash = 0
  for (let i = 0; i < upper.length; i++) {
    hash = upper.charCodeAt(i) + ((hash << 5) - hash)
  }
  const h = Math.abs(hash) % 360
  return { label, fill: `hsl(${h}, 65%, 55%)` }
}

export function getUniqueColorsFromProducts(productsList: Product[]) {
  const colorCounts = new Map<string, number>()
  productsList.forEach((p) => {
    const pColors = Array.isArray(p.colors) ? p.colors : []
    pColors.forEach((c) => {
      if (c && typeof c === 'string') {
        const normalized = c.trim()
        colorCounts.set(normalized, (colorCounts.get(normalized) || 0) + 1)
      }
    })
  })
  return Array.from(colorCounts.entries()).map(([label, count]) => ({
    ...getColorSwatch(label),
    count,
  }))
}

export function getUniqueCategoriesFromProducts(productsList: Product[]) {
  const categoriesSet = new Set<string>()
  productsList.forEach((p) => {
    if (p.category && typeof p.category === 'string') {
      categoriesSet.add(p.category.trim().toUpperCase())
    }
  })
  return Array.from(categoriesSet)
}

export type Product = {
  id: string
  name: string
  price: number
  image: string
  category: Category
  colors: ColorLabel[]
  /** Column span on the 12-col trending grid, mobile → desktop. */
  span: string
  description: string
  details: string[]
  sizes: string[]
  rating: number
  reviews: number
  /** Extra angles shown in the detail-page gallery, first entry is `image`. */
  gallery?: string[]
  /** Catalogue flags. Stored on the row and set from the admin product form. */
  isNew?: boolean
  inStock?: boolean
  trending?: boolean
}


const WIDE = 'col-span-12 lg:col-span-6'
const HALF = 'col-span-6 lg:col-span-3'

const SHOE_SIZES = ['38', '39', '40', '41', '42', '43', '44']
const APPAREL_SIZES = ['XS', 'S', 'M', 'L', 'XL']
const ONE_SIZE = ['One Size']

/** Fields every product needs but that rarely differ inside a category. */
const CATEGORY_DEFAULTS: Record<Category, { sizes: string[]; details: string[] }> = {
  SHOES: {
    sizes: SHOE_SIZES,
    details: [
      'Breathable knit upper with a reinforced heel counter',
      'Cushioned OrthoLite insole, removable',
      'Vulcanised rubber outsole for grip',
      'Runs true to size — order your usual',
    ],
  },
  'T-SHIRT': {
    sizes: APPAREL_SIZES,
    details: [
      '220gsm combed organic cotton jersey',
      'Ribbed crew neck that keeps its shape',
      'Pre-shrunk, machine wash cold',
      'Relaxed fit — size down for a closer cut',
    ],
  },
  JACKETS: {
    sizes: APPAREL_SIZES,
    details: [
      'Water-repellent recycled shell, PFC-free finish',
      'Fully taped seams and a storm flap',
      'Two zip hand pockets, one internal pocket',
      'Layer-friendly cut over a hoodie',
    ],
  },
  SHORTS: {
    sizes: APPAREL_SIZES,
    details: [
      'Lightweight quick-dry woven fabric',
      'Elasticated waist with a flat drawcord',
      '7" inseam with a side zip pocket',
      'Machine wash cold, hang dry',
    ],
  },
  HAT: {
    sizes: ONE_SIZE,
    details: [
      'Washed cotton twill with a soft crown',
      'Internal sweatband, adjustable strap',
      'Stitched eyelets for airflow',
      'One size fits most',
    ],
  },
}

type Seed = Omit<Product, 'sizes' | 'details'> & Partial<Pick<Product, 'sizes' | 'details'>>

const SEEDS: Seed[] = [
  {
    id: 'casual-shoe',
    name: 'Casual Shoe',
    price: 225,
    image: productCasualShoe,
    category: 'SHOES',
    colors: ['CLEAN WHITE', 'NAVY BLUE'],
    span: HALF,
    rating: 4.8,
    reviews: 214,
    description:
      'The one you reach for without thinking. A clean low profile in full-grain leather that softens with wear, built on a cushioned midsole you can stand in all day.',
  },
  {
    id: 'skateboard-shoe-green',
    name: 'Skateboard Shoe',
    price: 125,
    image: productSkateOne,
    category: 'SHOES',
    colors: ['DARK GREEN', 'CLEAN WHITE'],
    span: HALF,
    rating: 4.6,
    reviews: 148,
    description:
      'A skate silhouette with a suede toe box and a doubled ollie patch, so it holds up long after the first session.',
  },
  {
    id: 'skateboard-shoe-red',
    name: 'Skateboard Shoe',
    price: 125,
    image: productSkateWide,
    category: 'SHOES',
    colors: ['RED PASTEL', 'CLEAN WHITE'],
    span: WIDE,
    rating: 4.7,
    reviews: 96,
    description:
      'The same board-tested build in a washed red that fades beautifully. Padded collar, flat laces, gum outsole.',
  },
  {
    id: 'skateboard-shoe-lime',
    name: 'Skateboard Shoe',
    price: 125,
    image: productSkateWideTwo,
    category: 'SHOES',
    colors: ['LIME GREEN', 'CLEAN WHITE'],
    span: WIDE,
    rating: 4.5,
    reviews: 73,
    description:
      'A louder take on the classic. Lime panelling over a white midsole, finished with tonal stitching.',
  },
  {
    id: 'basket-shoe',
    name: 'Basket Shoe',
    price: 125,
    image: productBasket,
    category: 'SHOES',
    colors: ['NAVY BLUE', 'RED PASTEL'],
    span: HALF,
    rating: 4.4,
    reviews: 61,
    description:
      'A court shoe borrowed from the eighties — high collar, perforated side panels, and a herringbone tread.',
  },
  {
    id: 'sportwear-shoe',
    name: 'Sportwear Shoe',
    price: 159,
    image: productSportwear,
    category: 'SHOES',
    colors: ['PINK', 'BLUE SKY'],
    span: HALF,
    rating: 4.9,
    reviews: 302,
    description:
      'Engineered mesh, a foam midsole with real rebound, and a heel pull that makes it easy to get on. Made for long days rather than long runs.',
  },
  {
    id: 'court-jacket',
    name: 'Court Jacket',
    price: 189,
    image: productSkateWideTwo,
    category: 'JACKETS',
    colors: ['LIME GREEN', 'DARK GREEN'],
    span: WIDE,
    rating: 4.6,
    reviews: 54,
    description:
      'A boxy warm-up jacket with contrast piping and a half-zip collar. Light enough for spring, roomy enough to layer.',
  },
  {
    id: 'summer-shorts',
    name: 'Summer Shorts',
    price: 79,
    image: productSkateOne,
    category: 'SHORTS',
    colors: ['BLUE SKY', 'YELLOW'],
    span: HALF,
    rating: 4.3,
    reviews: 88,
    description:
      'Cut short and loose in a fabric that dries on the walk home. Goes from the water to dinner without complaint.',
  },
  {
    id: 'graphic-tee',
    name: 'Graphic Tee',
    price: 65,
    image: productCasualShoe,
    category: 'T-SHIRT',
    colors: ['PURPLE', 'PINK'],
    span: HALF,
    rating: 4.5,
    reviews: 131,
    description:
      'Heavyweight cotton with a hand-drawn print applied by water-based screen, so it sits in the fabric rather than on top of it.',
  },
  {
    id: 'bucket-hat',
    name: 'Bucket Hat',
    price: 45,
    image: productBasket,
    category: 'HAT',
    colors: ['YELLOW', 'CLEAN WHITE'],
    span: HALF,
    rating: 4.2,
    reviews: 47,
    description:
      'A wide-brim bucket in washed twill. Packs flat in a bag and comes back out without a crease that matters.',
  },
  {
    id: 'runner-tee',
    name: 'Runner Tee',
    price: 72,
    image: productSportwear,
    category: 'T-SHIRT',
    colors: ['RED PASTEL', 'NAVY BLUE'],
    span: HALF,
    rating: 4.7,
    reviews: 119,
    description:
      'A featherweight tee with mesh underarm panels and flatlock seams that stay quiet against the skin.',
  },
  {
    id: 'trail-jacket',
    name: 'Trail Jacket',
    price: 210,
    image: productSkateWide,
    category: 'JACKETS',
    colors: ['DARK GREEN', 'PURPLE'],
    span: WIDE,
    rating: 4.8,
    reviews: 76,
    description:
      'Built for weather that changes its mind. Adjustable hood, pit zips, and a hem cord that pulls in when the wind picks up.',
  },
]

export const PRODUCTS: Product[] = SEEDS.map((seed) => ({
  ...CATEGORY_DEFAULTS[seed.category],
  ...seed,
}))

export function getProduct(id: string | undefined) {
  return PRODUCTS.find((product) => product.id === id)
}

/** Same category first, then anything else, excluding the product itself. */
export function relatedProducts(product: Product, limit = 4) {
  const rest = PRODUCTS.filter((item) => item.id !== product.id)
  const sameCategory = rest.filter((item) => item.category === product.category)
  const others = rest.filter((item) => item.category !== product.category)
  return [...sameCategory, ...others].slice(0, limit)
}

export function formatPrice(value: number) {
  // Bangladeshi Taka (BDT) — English digits, ৳ symbol
  const formatted = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(value);
  return `৳${formatted}`;
}
