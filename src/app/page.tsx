"use client";
import { useEffect } from 'react'
import CustomJerseySection from '@/components/CustomJerseySection'
import ExploreByColors from '@/components/ExploreByColors'
import Hero from '@/components/Hero'
import Trending from '@/components/Trending'
import { scrollToSection } from '@/lib/shop'

export default function Home() {
  // Arriving from another route as `/#trending` — scroll once the DOM exists.
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return
    const id = hash.slice(1)
    const frame = requestAnimationFrame(() => scrollToSection(id))
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <>
      <Hero />
      <CustomJerseySection />
      <Trending />
      <ExploreByColors />
    </>
  )
}
