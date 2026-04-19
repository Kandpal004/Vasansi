import { Link } from 'react-router-dom'
import { useMeta } from '../lib/meta'
import { useShop } from '../lib/ShopContext'

// Images — live Vasansi Shopify CDN se
const IMG_HERO    = 'https://www.vasansi.com/cdn/shop/files/Untitled_design_16_1920x.png'
const IMG_FOUNDER = 'https://www.vasansi.com/cdn/shop/files/IMG_20200226_211213_26d1d6b2-b440-46f7-b979-2d245b5f9eef_900x.jpg'
const IMG_CRAFT_1 = 'https://www.vasansi.com/cdn/shop/files/DX_1847_final_1080x.jpg?v=1613779213'
const IMG_CRAFT_2 = 'https://www.vasansi.com/cdn/shop/files/Untitled_design_17_1080x.png'
const IMG_ARTISAN = 'https://www.vasansi.com/cdn/shop/files/vlcsnap-2020-08-22-13h45m05s847_1920x.png'
const IMG_FINAL   = 'https://www.vasansi.com/cdn/shop/files/IMG_20200226_211213_1080x.jpg'

export default function OurStoryPage() {
  const shop = useShop()
  useMeta({
    title: shop?.name ? `Our Story — ${shop.name}` : '',
    description: shop?.description || shop?.brand?.shortDescription || '',
    url: shop?.primaryDomain?.url ? `${shop.primaryDomain.url}/pages/our-story` : undefined,
    type: 'article',
  })
  return (
    <div className="pt-[108px] lg:pt-[108px] bg-white">

      {/* ═══════ HERO ═══════ */}
      <section className="relative h-[60vh] lg:h-[80vh] w-full overflow-hidden">
        <img src={IMG_HERO} alt="Vasansi Jaipur" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60" />
        <div className="relative h-full flex flex-col items-center justify-end pb-16 lg:pb-24 px-4 text-center">
          <p className="text-[10px] lg:text-xs tracking-[0.4em] uppercase text-white/80 font-light mb-4">Vasansi Jaipur</p>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-7xl text-white font-light uppercase tracking-wide leading-[1.1] mb-5">
            The Story Of<br />Vasansi Jaipur
          </h1>
          <div className="w-14 h-px bg-white/80" />
        </div>
      </section>

      {/* ═══════ JAIPUR SAREE KENDRA ═══════ */}
      <section className="bg-cream py-20 lg:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            <div>
              <p className="text-[10px] lg:text-xs tracking-[0.35em] uppercase text-charcoal font-semibold mb-4">Chapter One</p>
              <h2 className="font-serif text-3xl lg:text-5xl text-charcoal font-light uppercase tracking-wide mb-8 leading-[1.1]">
                Jaipur Saree Kendra
              </h2>
              <div className="space-y-5 text-charcoal text-[15px] lg:text-base font-light leading-[1.9]">
                <p>
                  Jaipur city, its pink washed walls, its vibrant streets, and the joy in its air shaped his childhood,
                  his vision, his eye for the aesthetics.
                </p>
                <p>
                  Amidst the old city, stood the family owned trading shop of traditional jaipur textiles —
                  <span className="font-semibold"> Shop no. 153, Johari Bazaar.</span>
                </p>
                <p>
                  This man — <span className="italic font-medium">Shailendra Sancheti</span>, his muse — Jaipur Saree Kendra,
                  which he visited each day, the starting point of his journey.
                </p>
              </div>
            </div>

            <div className="relative aspect-[4/5] overflow-hidden">
              <img src={IMG_FOUNDER} alt="Jaipur Saree Kendra — Shop 153, Johari Bazaar" className="absolute inset-0 w-full h-full object-cover" />
            </div>

          </div>
        </div>
      </section>

      {/* ═══════ PULL QUOTE ═══════ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 text-center">
        <p className="text-[10px] lg:text-xs tracking-[0.35em] uppercase text-charcoal font-semibold mb-6">Shailendra Sancheti</p>
        <p className="font-serif text-2xl sm:text-3xl lg:text-4xl text-charcoal font-light leading-[1.4] italic uppercase tracking-wide">
          "He who finds his melody in colors"
        </p>
        <div className="w-16 h-px bg-charcoal mx-auto mt-10" />
      </section>

      {/* ═══════ WHEN IT ALL BEGAN ═══════ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="text-center mb-12 lg:mb-14">
          <p className="text-[10px] lg:text-xs tracking-[0.35em] uppercase text-charcoal font-semibold mb-4">Chapter Two</p>
          <h2 className="font-serif text-3xl lg:text-5xl text-charcoal font-light uppercase tracking-wide leading-[1.1]">
            When It All Began
          </h2>
        </div>
        <div className="max-w-3xl mx-auto space-y-5 text-charcoal text-[15px] lg:text-base font-light leading-[1.9]">
          <p>
            A master of colors, and a graduate in Chemistry. Blessed with the unique ability to experiment with fabric properties,
            he innovates fabric processing techniques in the blink of an eye.
          </p>
          <p>
            In his early days, notorious for he was, as a 10 year old, he scribbled his shop's name in pencil and distributed
            those chits to customers right outside their competitor's store.
          </p>
        </div>
      </section>

      {/* ═══════ MASTER OF COLORS ═══════ */}
      <section className="bg-cream py-20 lg:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            <div className="order-2 lg:order-1 relative aspect-[4/5] overflow-hidden">
              <img src={IMG_CRAFT_1} alt="Hand block print craft" className="absolute inset-0 w-full h-full object-cover" />
            </div>

            <div className="order-1 lg:order-2">
              <p className="text-[10px] lg:text-xs tracking-[0.35em] uppercase text-charcoal font-semibold mb-4">Chapter Three</p>
              <h2 className="font-serif text-3xl lg:text-5xl text-charcoal font-light uppercase tracking-wide mb-8 leading-[1.1]">
                Master of Colors
              </h2>
              <div className="space-y-5 text-charcoal text-[15px] lg:text-base font-light leading-[1.9]">
                <p>
                  A visionary with an exceptional flair for prints, he was the first to introduce traditional
                  tie-dyes and hand block prints in pastel and earthy hues.
                </p>
                <p>
                  Revered for his colors, ace Designer <span className="italic">Krishna Mehta</span> has mentioned him in her
                  recent publication. He modernised bandhej and innovated a eight metre long saree which turned a rage pan India, back then.
                </p>
                <p>
                  In no time, Jaipur Saree Kendra became the most sought after name for traditional Indian
                  <span className="font-semibold"> "Bandhani", "Leheriya", "Kota Doria" & "Block Printed"</span> sarees.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════ BANDHEJ & LEHERIYA — full-bleed ═══════ */}
      <section className="relative py-24 lg:py-40 overflow-hidden">
        <img src={IMG_ARTISAN} alt="Artisans at work" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
        <div className="relative max-w-3xl px-4 sm:px-6 lg:px-20">
          <p className="text-[10px] lg:text-xs tracking-[0.35em] uppercase text-white/80 font-medium mb-4">Chapter Four</p>
          <h2 className="font-serif text-3xl lg:text-5xl text-white font-light uppercase tracking-wide mb-6 leading-[1.1]">
            Bandhej & Leheriya
          </h2>
          <div className="space-y-5 text-white/90 text-base lg:text-lg font-light leading-[1.9]">
            <p>
              He routinely traveled distances to reach out to skilled women artisans in villages to guide them through a
              fresh take on their handicraft. He revered it as his duty to community — never missing a single visit.
            </p>
            <p>
              The artisans blessed him, with all their heart. He believes those blessings have in some way played a part in
              driving him so far.
            </p>
            <p>
              Back in the day, he used to single-handedly transport huge bundles of fabric printed by him, all the way from Sanganer.
              His pillar, his backbone, his wife, <span className="italic">Jyoti</span>, used to run down the stairs at just the
              sound of the scooter overloaded with fabric potlis.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════ JOURNEY — timeline ═══════ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="text-center mb-14 lg:mb-16">
          <p className="text-[10px] lg:text-xs tracking-[0.35em] uppercase text-charcoal font-semibold mb-4">Chapter Five</p>
          <h2 className="font-serif text-3xl lg:text-5xl text-charcoal font-light uppercase tracking-wide leading-[1.1]">
            The Journey
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-14">
          {[
            { year: '1983', label: 'First Manufacturing Factory', desc: 'Textile printing factory opens — the foundation of the Vasansi legacy.' },
            { year: '2002', label: 'Vasansi Jaipur Established', desc: 'A turning point — the brand Vasansi Jaipur is formally born.' },
            { year: 'Today', label: 'A Family of Hundreds', desc: 'From dying fabric with his own hands to a thriving family of workers.' },
          ].map(t => (
            <div key={t.year} className="border-2 border-charcoal p-6 lg:p-8 text-center">
              <p className="font-serif text-4xl lg:text-5xl text-charcoal font-light mb-3">{t.year}</p>
              <p className="text-[10px] tracking-[0.25em] uppercase text-charcoal font-semibold mb-3">{t.label}</p>
              <p className="text-sm text-charcoal font-light leading-[1.8]">{t.desc}</p>
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto text-center text-charcoal text-[15px] lg:text-base font-light leading-[1.9]">
          <p>
            He started his first manufacturing factory for textile printing in <span className="font-semibold">1983</span>.
            The manufacturing increased manifold, and so did the retail and wholesale operations.
            Vasansi Jaipur then got established in <span className="font-semibold">2002</span>, marking a turning point.
            From dying fabric with his own hands to now having a family of hundreds of workers,
            he has come a long way.
          </p>
        </div>
      </section>

      {/* ═══════ MANUFACTURING EXTENT ═══════ */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <img src={IMG_CRAFT_2} alt="Vasansi manufacturing" className="absolute inset-0 w-full h-full object-cover opacity-15" />
        <div className="absolute inset-0 bg-white/70" />
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <p className="text-[10px] lg:text-xs tracking-[0.35em] uppercase text-charcoal font-semibold mb-5">Chapter Six</p>
          <h2 className="font-serif text-3xl lg:text-5xl text-charcoal font-light uppercase tracking-wide mb-10 leading-[1.1]">
            Manufacturing Extent
          </h2>
          <p className="font-serif text-xl lg:text-2xl text-charcoal italic font-light leading-[1.7]">
            "We are driven by an unknown force, creating fresh prints, experimenting with patterns,
            playing with colours, producing new each day. Not bounded by the constraints of set collections or seasons,
            we manufacture around hundred new styles every month. The products showcased digitally in each collection are a mere
            glimpse of the vast expanse of Vasansi Jaipur's production."
          </p>
        </div>
      </section>

      {/* ═══════ CTA ═══════ */}
      <section className="bg-charcoal text-white py-20 lg:py-24">
        <div className="max-w-3xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <p className="text-[10px] lg:text-xs tracking-[0.35em] uppercase text-white/80 font-semibold mb-4">A Continuing Story</p>
          <h2 className="font-serif text-3xl lg:text-5xl text-white font-light uppercase tracking-wide mb-8 leading-[1.1]">
            Woven For You
          </h2>
          <p className="text-white/90 text-base lg:text-lg font-light leading-[1.9] mb-10 max-w-2xl mx-auto">
            Every Vasansi piece is a chapter in this ongoing journey — crafted by hands that have known this art for generations.
          </p>
          <Link
            to="/collections/shop-all"
            className="inline-block bg-white text-charcoal text-sm tracking-[0.25em] uppercase px-10 py-4 font-semibold hover:bg-cream transition-colors"
          >
            Explore the Collection →
          </Link>
        </div>
      </section>

    </div>
  )
}
