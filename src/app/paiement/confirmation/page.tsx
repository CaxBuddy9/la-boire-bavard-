'use client'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Nav from '@/components/sections/Nav'
import Footer from '@/components/sections/Footer'

function ConfirmationContent() {
  const params  = useSearchParams()
  const nom     = params.get('nom')     || 'cher hôte'
  const chambre = params.get('chambre') || ''
  const arrive  = params.get('arrive')  || ''
  const depart  = params.get('depart')  || ''

  return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 40px' }}>
      <div className="text-center max-w-lg">

        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'rgba(196,160,80,.12)', border: '1px solid rgba(196,160,80,.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 32px', fontSize: '1.8rem',
        }}>✓</div>

        <p className="label-caps mb-4">Réservation confirmée</p>
        <h1 className="font-serif font-normal text-white mb-6" style={{ fontSize: 'clamp(2rem,4vw,3rem)' }}>
          Merci, {nom} !
        </h1>
        <div style={{ height: 1, background: 'rgba(196,160,80,.25)', width: 48, margin: '0 auto 28px' }} />

        {(chambre || arrive || depart) && (
          <div style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(196,160,80,.15)', padding: '24px 32px', marginBottom: 32 }}>
            <div className="font-sans text-[0.85rem] flex flex-col gap-3" style={{ color: 'rgba(255,255,255,.55)' }}>
              {chambre && <div className="flex justify-between"><span>Chambre</span>  <span style={{ color: '#f5f0e8' }}>{chambre}</span></div>}
              {arrive  && <div className="flex justify-between"><span>Arrivée</span>  <span style={{ color: '#f5f0e8' }}>{arrive}</span></div>}
              {depart  && <div className="flex justify-between"><span>Départ</span>   <span style={{ color: '#f5f0e8' }}>{depart}</span></div>}
            </div>
          </div>
        )}

        <p className="font-sans text-[0.95rem] leading-[1.85] text-white/50 mb-10">
          Un email de confirmation vous a été envoyé. Sandrine vous contactera dans les 24h
          pour finaliser les détails de votre séjour.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/" className="btn-gold">Retour à l'accueil</Link>
          <a href="https://wa.me/33675786335" target="_blank" rel="noopener noreferrer" className="btn-ghost">
            Contacter Sandrine
          </a>
        </div>
      </div>
    </div>
  )
}

export default function ConfirmationPage() {
  return (
    <>
      <Nav />
      <main style={{ background: '#0e1510' }}>
        <div style={{ paddingTop: 80 }}>
          <Suspense fallback={<div style={{ minHeight: '60vh' }} />}>
            <ConfirmationContent />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  )
}
