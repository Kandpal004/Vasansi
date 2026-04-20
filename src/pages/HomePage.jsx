import Hero from '../components/Hero'
import CategorySlider from '../components/CategorySlider'
import CategoryGrid from '../components/CategoryGrid'
import AprilEdit from '../components/AprilEdit'
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
      <FeaturedProducts />
      <AprilEdit />
      <CategoryGrid />
      <PromoBanners />
      <ConsultantBanner />
    </>
  )
}
