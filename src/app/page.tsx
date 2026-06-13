import Nav from '@/components/sections/Nav'
import Hero from '@/components/sections/Hero'
import IntroStrip from '@/components/sections/IntroStrip'
import RoomsTeaser from '@/components/sections/RoomsTeaser'
import LifeGallery from '@/components/sections/LifeGallery'
import AvisPreview from '@/components/sections/AvisPreview'
import BookingBand from '@/components/sections/BookingBand'
import Footer from '@/components/sections/Footer'

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <IntroStrip />
        <RoomsTeaser />
        <LifeGallery />
        <AvisPreview />
        <BookingBand />
      </main>
      <Footer />
    </>
  )
}
