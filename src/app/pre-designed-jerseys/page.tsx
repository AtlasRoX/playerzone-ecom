"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Container from '@/components/ui/Container';
import Pill from '@/components/ui/Pill';
import { getActiveDesigns } from '@/app/actions/customJerseys';
import { productSportwear, outdoorActive, productBasket, productSkateOne, productCasualShoe } from '@/components/ui/images';
import { ArrowShortRightIcon } from '@/components/ui/icons';
import { CheckCircle2, Shirt, Sparkles, Tag, ShieldCheck } from 'lucide-react';

type Design = { id: string; name: string; image: string };

const SHOWCASE_KITS = [
  {
    id: 'esports-neon',
    name: 'Vortex Esports Pro Kit',
    category: 'Esports',
    image: productSportwear,
    badge: 'TOP SELLER',
    fabric: 'QuickDry Micro-Mesh',
    sublimation: 'Full HD Sublimation',
  },
  {
    id: 'soccer-strike',
    name: 'Apex Striker Club Jersey',
    category: 'Soccer',
    image: outdoorActive,
    badge: 'SUBLIMATED',
    fabric: 'Breathable Polyester',
    sublimation: 'Custom Name & Number',
  },
  {
    id: 'basketball-hoops',
    name: 'Titan Slam Hoops Uniform',
    category: 'Basketball',
    image: productBasket,
    badge: 'ROSTER READY',
    fabric: 'Heavyweight Mesh',
    sublimation: 'Durable Stitch & Print',
  },
  {
    id: 'cricket-pro',
    name: 'Thunderbolt Cricket Jersey',
    category: 'Cricket',
    image: productSkateOne,
    badge: 'PREMIUM',
    fabric: 'Pique UV-Shield',
    sublimation: 'Sponsor & Crest Ready',
  },
];

const CATEGORY_TABS = ['All Kits', 'Esports', 'Soccer', 'Basketball', 'Cricket'];

export default function PreDesignedJerseysPage() {
  const router = useRouter();
  const [dbDesigns, setDbDesigns] = useState<Design[]>([]);
  const [activeTab, setActiveTab] = useState('All Kits');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getActiveDesigns()
      .then((res) => {
        setDbDesigns(res);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredShowcase = activeTab === 'All Kits' 
    ? SHOWCASE_KITS 
    : SHOWCASE_KITS.filter(kit => kit.category === activeTab);

  return (
    <Container className="py-8 md:py-14">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="mb-6 text-[13px] text-ink/50">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <span className="px-2">/</span>
        <span className="text-ink font-medium">Pre-Designed Jerseys</span>
      </nav>

      {/* Header Banner */}
      <div className="relative mb-12 overflow-hidden rounded-3xl bg-ink p-8 text-white md:p-14">
        <div className="relative z-10 flex max-w-2xl flex-col gap-5">
          <div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[2px] text-white/70">
            <Sparkles className="size-4 text-yellow-400" />
            <span>Ready-To-Order Uniform Kits</span>
          </div>
          <h1 className="text-[36px] font-semibold leading-10 tracking-[-2px] sm:text-[48px] sm:leading-13 lg:text-[58px] lg:leading-15">
            Pre-Designed Jersey Kits & Existing Projects
          </h1>
          <p className="text-[15px] leading-6.5 text-white/80 sm:text-[17px]">
            Explore our curated catalog of sublimated team jerseys and club kit concepts. Select any design to customize player names, numbers, and team crests!
          </p>
          <div className="mt-2 flex flex-wrap gap-4">
            <Pill
              variant="solid"
              onClick={() => router.push('/custom-jersey')}
              className="bg-white text-ink hover:bg-neutral-100"
            >
              BUILD FROM SCRATCH
            </Pill>
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-hairline pb-6">
        <div className="flex flex-wrap gap-2.5">
          {CATEGORY_TABS.map((tab) => (
            <Pill
              key={tab}
              variant={activeTab === tab ? 'solid' : 'muted'}
              ariaPressed={activeTab === tab}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </Pill>
          ))}
        </div>
        <p className="text-[14px] text-ink/60 font-medium">
          Showing {dbDesigns.length + filteredShowcase.length} Designs
        </p>
      </div>

      {/* Admin DB Designs Section */}
      {dbDesigns.length > 0 && (
        <div className="mb-16">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-[26px] font-semibold tracking-[-1px] text-ink">
              Featured Admin Created Kits
            </h2>
            <span className="text-[13px] font-medium text-ink/50 uppercase tracking-[1px]">Official Templates</span>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {dbDesigns.map((design) => (
              <div
                key={design.id}
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-hairline bg-white p-4 transition-all duration-300 hover:shadow-xl"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-neutral-100">
                  <img
                    src={design.image}
                    alt={design.name}
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 rounded-full bg-black/80 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
                    Custom Template
                  </div>
                </div>

                <div className="mt-4 flex flex-1 flex-col justify-between gap-4">
                  <div>
                    <h3 className="text-[18px] font-semibold text-ink group-hover:underline">
                      {design.name}
                    </h3>
                    <p className="mt-1 text-[13px] text-ink/60">Sublimated Custom Jersey</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => router.push(`/custom-jersey?designId=${design.id}`)}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-ink px-4 py-3 text-[13px] font-semibold tracking-[0.5px] text-white transition-opacity hover:opacity-90"
                  >
                    <span>Customize This Jersey</span>
                    <ArrowShortRightIcon className="size-4 text-white" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pre-Designed Kit Catalog */}
      <div className="mb-16">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-[26px] font-semibold tracking-[-1px] text-ink">
            Popular Pre-Designed Uniform Kits
          </h2>
          <span className="text-[13px] font-medium text-ink/50 uppercase tracking-[1px]">Ready to Print</span>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredShowcase.map((kit) => (
            <div
              key={kit.id}
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-hairline bg-white p-4 transition-all duration-300 hover:shadow-xl"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-neutral-100">
                <img
                  src={kit.image}
                  alt={kit.name}
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 rounded-full bg-ink px-3 py-1 text-[11px] font-semibold text-white">
                  {kit.badge}
                </div>
              </div>

              <div className="mt-4 flex flex-1 flex-col justify-between gap-4">
                <div>
                  <div className="flex items-center justify-between text-[12px] font-medium text-ink/60">
                    <span>{kit.category}</span>
                    <span>৳ 2,499 base</span>
                  </div>
                  <h3 className="mt-1 text-[18px] font-semibold text-ink group-hover:underline">
                    {kit.name}
                  </h3>
                  <div className="mt-2 flex flex-col gap-1 text-[12px] text-ink/70">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="size-3.5 text-emerald-600" />
                      <span>{kit.fabric}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="size-3.5 text-blue-600" />
                      <span>{kit.sublimation}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => router.push('/custom-jersey')}
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-ink bg-transparent px-4 py-3 text-[13px] font-semibold tracking-[0.5px] text-ink transition-colors hover:bg-ink hover:text-white"
                >
                  <span>Select & Order Roster</span>
                  <ArrowShortRightIcon className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Past Custom Projects Banner */}
      <div className="rounded-3xl border border-hairline bg-neutral-50 p-8 md:p-12">
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
          <div className="max-w-xl">
            <h3 className="text-[24px] font-semibold text-ink sm:text-[30px]">
              Need a 100% Unique Design for Your Squad?
            </h3>
            <p className="mt-2 text-[15px] text-ink/70 leading-relaxed">
              Our in-house design team can construct bespoke sublimated uniforms from scratch with your custom sponsor logos, team emblems, and pantone colors.
            </p>
          </div>
          <button
            type="button"
            onClick={() => router.push('/custom-jersey')}
            className="flex items-center gap-2 rounded-full bg-ink px-8 py-4 text-[14px] font-semibold text-white transition-opacity hover:opacity-90 shrink-0"
          >
            <Shirt className="size-5" />
            <span>Start Custom Jersey Order</span>
          </button>
        </div>
      </div>
    </Container>
  );
}
