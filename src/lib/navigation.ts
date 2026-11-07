"use client";
import { useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation';
import { scrollToSection } from './shop'

/**
 * The home page anchors (`trending`, `colors`, `testimonial`, `footer`) only
 * exist on `/`. From any other route we navigate home with the hash and let
 * the home page scroll once it has mounted.
 */
export function useSectionNav() {
  const router = useRouter()
  const pathname = usePathname()

  return useCallback(
    (id: string) => {
      if (id === 'footer' || pathname === '/') {
        const target = document.getElementById(id)
        if (target) {
          scrollToSection(id)
          return
        }
      }
      router.push(`/#${id}`)
    },
    [router, pathname],
  )
}
