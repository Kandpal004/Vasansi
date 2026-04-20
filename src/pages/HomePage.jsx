import Hero from '../components/Hero'
import CategorySlider from '../components/CategorySlider'
import CategoryGrid from '../components/CategoryGrid'
import FeaturedProducts from '../components/FeaturedProducts'
import PromoBanners from '../components/PromoBanners'
import ConsultantBanner from '../components/ConsultantBanner'
import { useDefaultMeta } from '../lib/ShopContext'

export default function HomePage() {
  // Homepage ka title + meta Shopify Shop object se aata hai
  useDefaultMeta()

  return (
    <>
      <CategorySlider />
      <Hero />
      <CategoryGrid />
      <FeaturedProducts />
      <PromoBanners />
      <ConsultantBanner />
    </>
  )
}
