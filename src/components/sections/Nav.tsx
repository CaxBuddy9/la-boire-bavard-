'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogoSVG } from '@/components/Logo'
import { useLang, useT } from '@/context/LangContext'

const links = [
  { href: '/',          fr: 'Accueil',         en: 'Home' },
  { href: '/propriete', fr: 'La propriété',     en: 'The Estate' },
  { href: '/chambres',  fr: 'Chambres',         en: 'Rooms' },
  { href: '/petitdej',  fr: 'Petit-déjeuner',   en: 'Breakfast' },
  { href: '/avis',      fr: 'Avis',             en: 'Reviews' },
  { href: '/contact',   fr: 'Contact & Accès',  en: 'Contact & Access' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const isHome = pathname === '/'
  const { lang, setLang } = useLang()
  const t = useT()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Always dark — transparent when at top, solid dark when scrolled
  const navBg = scrolled
    ? 'bg-[rgba(14,20,15,0.97)] backdrop-blur-md border-b border-white/5'
    : 'bg-[rgba(20,28,22,0.88)] backdrop-blur-sm'

  const logoColor = 'text-white'
  const subColor  = 'text-[#c4a050]'
  const linkBase  = 'text-[rgba(240,235,225,0.75)] hover:text-[#c4a050]'
  const langBtnBase = 'text-white/40 hover:text-[#c4a050]'
  const langBtnActive = 'text-[#c4a050]'

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg} ${scrolled ? 'py-3' : 'py-5'}`}>
      <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <LogoSVG height={52} />
          <div className="flex flex-col leading-none">
            <span className={`font-serif text-[1.1rem] tracking-[0.06em] font-normal transition-colors duration-300 ${logoColor}`}>
              La Boire Bavard
            </span>
            <span className={`font-sans text-[0.52rem] tracking-[0.3em] uppercase transition-colors duration-300 ${subColor}`}>
              Chambres d'Hôtes · Anjou
            </span>
          </div>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-7">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={`font-sans text-[0.62rem] tracking-[0.18em] uppercase transition-colors duration-200 ${linkBase} ${pathname === l.href ? 'text-[#c4a050]' : ''}`}
              >
                {lang === 'en' ? l.en : l.fr}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right side: Lang switch + CTA */}
        <div className="hidden md:flex items-center gap-6">
          {/* FR / EN toggle */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setLang('fr')}
              className={`font-sans text-[0.58rem] tracking-[0.16em] uppercase transition-colors duration-200 ${lang === 'fr' ? langBtnActive : langBtnBase}`}
            >
              FR
            </button>
            <span className={`text-[0.5rem] ${scrolled && !isHome ? 'text-ink/20' : 'text-white/20'}`}>|</span>
            <button
              onClick={() => setLang('en')}
              className={`font-sans text-[0.58rem] tracking-[0.16em] uppercase transition-colors duration-200 ${lang === 'en' ? langBtnActive : langBtnBase}`}
            >
              EN
            </button>
          </div>

          {/* CTA */}
          <Link
            href="/contact"
            className="font-sans text-[0.62rem] tracking-[0.16em] uppercase px-5 py-2.5 border border-[#c4a050] text-[#c4a050] hover:bg-[#c4a050] hover:text-ink transition-all duration-200"
          >
            {t('Réserver', 'Book')}
          </Link>
        </div>

        {/* Burger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {[
            open ? 'rotate-45 translate-y-2' : '',
            open ? 'opacity-0' : '',
            open ? '-rotate-45 -translate-y-2' : '',
          ].map((cls, i) => (
            <span
              key={i}
              className={`block w-6 h-0.5 transition-all duration-200 bg-white ${cls}`}
            />
          ))}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[rgba(20,28,22,0.97)] px-8 py-6 flex flex-col gap-5">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`font-sans text-[0.72rem] tracking-[0.25em] uppercase hover:text-[#c4a050] transition-colors ${pathname === l.href ? 'text-[#c4a050]' : 'text-[rgba(255,255,255,0.8)]'}`}
            >
              {lang === 'en' ? l.en : l.fr}
            </Link>
          ))}
          {/* Mobile lang switch */}
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={() => setLang('fr')}
              className={`font-sans text-[0.65rem] tracking-[0.2em] uppercase ${lang === 'fr' ? 'text-[#c4a050]' : 'text-white/40'}`}
            >
              FR
            </button>
            <span className="text-white/20 text-xs">|</span>
            <button
              onClick={() => setLang('en')}
              className={`font-sans text-[0.65rem] tracking-[0.2em] uppercase ${lang === 'en' ? 'text-[#c4a050]' : 'text-white/40'}`}
            >
              EN
            </button>
          </div>
          <Link href="/contact" onClick={() => setOpen(false)} className="btn-gold text-center mt-2">
            {t('Réserver', 'Book')}
          </Link>
        </div>
      )}
    </nav>
  )
}
