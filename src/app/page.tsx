import Nav from '@/components/sections/Nav'
import Hero from '@/components/sections/Hero'
import IntroStrip from '@/components/sections/IntroStrip'
import RoomsTeaser from '@/components/sections/RoomsTeaser'
import AvisPreview from '@/components/sections/AvisPreview'
import Footer from '@/components/sections/Footer'

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <IntroStrip />
        <RoomsTeaser />
        <AvisPreview />
      </main>
      <Footer />
    </>
  )
}
