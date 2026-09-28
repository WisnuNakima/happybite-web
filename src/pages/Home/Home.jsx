import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '@/components/Navbar'
import Hero from '@/pages/Home/components/Hero'
import AboutSection from '@/pages/Home/components/AboutSection'
import GalleryShowcase from '@/pages/Home/components/GalleryShowcase'
import HowItWorksSteps from '@/pages/Home/components/HowItWorksSteps'
import Testimonials from '@/pages/Home/components/Testimonials'
import Footer from '@/components/Footer'
import SiteDialog from '@/components/SiteDialog'

export default function Home({ cartCount }) {
  const [dialog, setDialog] = useState(null)
  const navigate = useNavigate()
  const openAccount = () => navigate('/login')

  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <a
        href="#main"
        className="fixed left-4 top-4 z-50 -translate-y-24 rounded-full bg-baked px-5 py-3 text-white focus:translate-y-0"
      >
        Langsung ke konten
      </a>
      <Navbar
        onAccount={openAccount}
        onSearch={() => setDialog('search')}
        cartCount={cartCount}
      />
      <main id="main" className="flex-1">
        <Hero onAccount={openAccount} />
        <AboutSection />
        <GalleryShowcase onAccount={openAccount} />
        <HowItWorksSteps />
        <Testimonials />
      </main>
      <Footer onAccount={openAccount} onInfo={setDialog} />
      {dialog && (
        <SiteDialog
          kind={dialog}
          onClose={() => setDialog(null)}
          onAccount={openAccount}
        />
      )}
    </div>
  )
}
