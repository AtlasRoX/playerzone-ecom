"use client"
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { type Category, type ColorLabel, type Product } from './products'

export type CartLine = {
  /** Product id plus the chosen variant — two sizes of one shoe are two lines. */
  key: string
  product: Product
  qty: number
  size?: string
  color?: ColorLabel
}

export const SORTS = ['FEATURED', 'PRICE: LOW TO HIGH', 'PRICE: HIGH TO LOW', 'TOP RATED'] as const
export type Sort = (typeof SORTS)[number]

type AddOptions = { qty?: number; size?: string; color?: ColorLabel }

type ShopValue = {
  // Browsing state
  query: string
  setQuery: (value: string) => void
  category: Category | null
  setCategory: (value: Category | null) => void
  toggleCategory: (value: Category) => void
  color: ColorLabel | null
  setColor: (value: ColorLabel | null) => void
  toggleColor: (value: ColorLabel) => void
  sort: Sort
  setSort: (value: Sort) => void
  clearFilters: () => void
  /** Category + colour + query, unsorted. Used by the home page Trending grid. */
  filtered: Product[]
  /** The same set with the active sort applied. Used by the shop page. */
  results: Product[]
  isFiltering: boolean
  allProducts: Product[]

  // Wishlist
  wishlist: string[]
  toggleWishlist: (id: string) => void
  isWishlisted: (id: string) => boolean
  wishlistProducts: Product[]

  // Cart
  cart: CartLine[]
  cartCount: number
  cartTotal: number
  addToCart: (product: Product, options?: AddOptions) => void
  setQty: (key: string, qty: number) => void
  removeFromCart: (key: string) => void
  clearCart: () => void
  cartOpen: boolean
  setCartOpen: (open: boolean) => void
}

const ShopContext = createContext<ShopValue | null>(null)

const lineKey = (product: Product, size?: string, color?: ColorLabel) =>
  [product.id, size ?? '', color ?? ''].join('|')

export function ShopProvider({ children, initialProducts }: { children: ReactNode, initialProducts: Product[] }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<Category | null>('SHOES')
  const [color, setColor] = useState<ColorLabel | null>(null)
  const [sort, setSort] = useState<Sort>('FEATURED')
  const [wishlist, setWishlist] = useState<string[]>([])
  const [cart, setCart] = useState<CartLine[]>([])
  const [cartOpen, setCartOpen] = useState(false)

  const toggleCategory = useCallback((value: Category) => {
    setCategory((current: Category | null) => (current === value ? null : value))
  }, [])

  const toggleColor = useCallback((value: ColorLabel) => {
    setColor((current: ColorLabel | null) => (current === value ? null : value))
  }, [])

  const clearFilters = useCallback(() => {
    setCategory(null)
    setColor(null)
    setQuery('')
    setSort('FEATURED')
  }, [])

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return initialProducts.filter((product: Product) => {
      if (category && product.category !== category) return false
      if (color && !product.colors.includes(color)) return false
      if (needle && !product.name.toLowerCase().includes(needle)) return false
      return true
    })
  }, [query, category, color])

  const results = useMemo(() => {
    const list = [...filtered]
    if (sort === 'PRICE: LOW TO HIGH') list.sort((a, b) => a.price - b.price)
    if (sort === 'PRICE: HIGH TO LOW') list.sort((a, b) => b.price - a.price)
    if (sort === 'TOP RATED') list.sort((a, b) => b.rating - a.rating)
    return list
  }, [filtered, sort])

  const toggleWishlist = useCallback((id: string) => {
    setWishlist((current: string[]) =>
      current.includes(id) ? current.filter((item: string) => item !== id) : [...current, id],
    )
  }, [])

  const isWishlisted = useCallback((id: string) => wishlist.includes(id), [wishlist])

  const wishlistProducts = useMemo(
    () => initialProducts.filter((product: Product) => wishlist.includes(product.id)),
    [wishlist],
  )

  const addToCart = useCallback((product: Product, options: AddOptions = {}) => {
    const { qty = 1, size, color: variantColor } = options
    const key = lineKey(product, size, variantColor)
    setCart((current: CartLine[]) => {
      const existing = current.find((line: CartLine) => line.key === key)
      if (existing) {
        return current.map((line: CartLine) => (line.key === key ? { ...line, qty: line.qty + qty } : line))
      }
      return [...current, { key, product, qty, size, color: variantColor }]
    })
    setCartOpen(true)
  }, [])

  const setQty = useCallback((key: string, qty: number) => {
    setCart((current: CartLine[]) =>
      qty <= 0
        ? current.filter((line: CartLine) => line.key !== key)
        : current.map((line: CartLine) => (line.key === key ? { ...line, qty } : line)),
    )
  }, [])

  const removeFromCart = useCallback((key: string) => {
    setCart((current: CartLine[]) => current.filter((line: CartLine) => line.key !== key))
  }, [])

  const clearCart = useCallback(() => setCart([]), [])

  const cartCount = cart.reduce((sum: number, line: CartLine) => sum + line.qty, 0)
  const cartTotal = cart.reduce((sum: number, line: CartLine) => sum + line.qty * line.product.price, 0)

  const value: ShopValue = {
    query,
    setQuery,
    category,
    setCategory,
    toggleCategory,
    color,
    setColor,
    toggleColor,
    sort,
    setSort,
    clearFilters,
    filtered,
    results,
    isFiltering: Boolean(query.trim() || category || color),
    allProducts: initialProducts,
    wishlist,
    toggleWishlist,
    isWishlisted,
    wishlistProducts,
    cart,
    cartCount,
    cartTotal,
    addToCart,
    setQty,
    removeFromCart,
    clearCart,
    cartOpen,
    setCartOpen,
  }

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}

export function useShop() {
  const context = useContext(ShopContext)
  if (!context) throw new Error('useShop must be used within a ShopProvider')
  return context
}

/**
 * Smooth-scrolls to a section id. Sections only exist on the home page, so
 * callers that may be on another route should navigate to `/#id` instead.
 */
export function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
