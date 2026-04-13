import Hero from '../components/Hero'
import CategoryGrid from '../components/CategoryGrid'
import FeaturedProducts from '../components/FeaturedProducts'
import PromoBanners from '../components/PromoBanners'
import ConsultantBanner from '../components/ConsultantBanner'

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoryGrid />
      <FeaturedProducts />
      <PromoBanners />
      <ConsultantBanner />
    </>
  )
}
