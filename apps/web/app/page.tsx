import React from 'react'
import Navbar from '@/components/navbar'
import HeroSection from '@/components/homepage/hero-section'
import ShopByCategory from '@/components/homepage/shop-by-category'
import ShopPromotion from '@/components/homepage/shop-promotion'
import WhyChooseUs from '@/components/homepage/why-choose-us'
import Reviews from '@/components/homepage/reviews'
import Features from '@/components/homepage/features'
import Banner from '@/components/homepage/banner'
import NewsLetter from '@/components/homepage/news-letter'
import Footer from '@/components/footer'

const page = () => {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <ShopByCategory />
      <ShopPromotion />
      <WhyChooseUs />
      <Reviews />
      <Features />
      <Banner />
      <NewsLetter />
      <Footer />
    </div>
  )
}

export default page
