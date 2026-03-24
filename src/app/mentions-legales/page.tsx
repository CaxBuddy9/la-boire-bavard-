import Nav from '@/components/sections/Nav'
import Footer from '@/components/sections/Footer'

export const metadata = {
  title: "Mentions légales — La Boire Bavard",
  description: "Mentions légales du site La Boire Bavard, chambres d'hôtes à Blaison-Saint-Sulpice, Anjou.",
}

export default function MentionsLegalesPage() {
  return (
    <>
      <Nav />
      <main>
        {/* Hero */}
        <section style={{ background: '#141c16', paddingTop: 140, paddingBottom: 60, paddingLeft: 52, paddingRight: 52 }}>
          <div className="max-w-3xl mx-auto">
            <p className="label-caps mb-4">Informations légales</p>
            <h1 className="font-serif font-normal text-white"
              style={{ fontSize: 'clamp(2.5rem,5vw,4rem)' }}>
              Mentions légales
            </h1>
          </div>
        </section>

        {/* Contenu */}
        <section style={{ background: '#0f1509', padding: '60px 52px 100px' }}>
          <div className="max-w-3xl mx-auto" style={{ color: 'rgba(255,255,255,.62)', lineHeight: 1.9, fontSize: '0.95rem' }}>

            <div style={{ marginBottom: 48 }}>
              <h2 className="font-serif font-normal text-white mb-4" style={{ fontSize: '1.4rem' }}>
                Éditeur du site
              </h2>
              <div style={{ borderLeft: '2px solid rgba(196,160,80,.3)', paddingLeft: 20 }}>
                <p><strong style={{ color: 'rgba(255,255,255,.85)' }}>Raison sociale :</strong> La Boire Bavard</p>
                <p><strong style={{ color: 'rgba(255,255,255,.85)' }}>Propriétaire :</strong> Sandrine</p>
                <p><strong style={{ color: 'rgba(255,255,255,.85)' }}>Adresse :</strong> 4 chemin de la Boire Bavard, Lieu-dit La Hutte, 49320 Blaison-Saint-Sulpice</p>
                <p><strong style={{ color: 'rgba(255,255,255,.85)' }}>Téléphone :</strong>{' '}
                  <a href="tel:0675786335" className="text-gold hover:text-white transition-colors">06 75 78 63 35</a>
                </p>
                <p><strong style={{ color: 'rgba(255,255,255,.85)' }}>Email :</strong>{' '}
                  <a href="mailto:laboirebavard@gmail.com" className="text-gold hover:text-white transition-colors">laboirebavard@gmail.com</a>
                </p>
                <p><strong style={{ color: 'rgba(255,255,255,.85)' }}>Statut :</strong> Particulier — chambre d'hôtes déclarée</p>
              </div>
            </div>

            <div style={{ marginBottom: 48 }}>
              <h2 className="font-serif font-normal text-white mb-4" style={{ fontSize: '1.4rem' }}>
                Hébergement
              </h2>
              <div style={{ borderLeft: '2px solid rgba(196,160,80,.3)', paddingLeft: 20 }}>
                <p><strong style={{ color: 'rgba(255,255,255,.85)' }}>Hébergeur :</strong> Vercel Inc.</p>
                <p><strong style={{ color: 'rgba(255,255,255,.85)' }}>Adresse :</strong> 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis</p>
                <p><strong style={{ color: 'rgba(255,255,255,.85)' }}>Site :</strong>{' '}
                  <a href="https://vercel.com" target="_blank" rel="noopener noreferrer"
                    className="text-gold hover:text-white transition-colors">vercel.com</a>
                </p>
              </div>
            </div>

            <div style={{ marginBottom: 48 }}>
              <h2 className="font-serif font-normal text-white mb-4" style={{ fontSize: '1.4rem' }}>
                Propriété intellectuelle
              </h2>
              <p>
                L'ensemble des contenus présents sur ce site (textes, photos, logos, mise en page) sont la propriété exclusive
                de La Boire Bavard, sauf mention contraire. Toute reproduction, représentation ou utilisation sans
                autorisation écrite préalable est interdite.
              </p>
            </div>

            <div style={{ marginBottom: 48 }}>
              <h2 className="font-serif font-normal text-white mb-4" style={{ fontSize: '1.4rem' }}>
                Données personnelles
              </h2>
              <p className="mb-4">
                Les informations recueillies via le formulaire de contact sont utilisées exclusivement pour répondre
                à votre demande de réservation. Elles ne sont ni cédées, ni vendues à des tiers.
              </p>
              <p className="mb-4">
                Conformément à la loi Informatique et Libertés du 6 janvier 1978 modifiée et au Règlement Général
                sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de rectification et de
                suppression de vos données personnelles.
              </p>
              <p>
                Pour exercer ce droit, contactez-nous par email à{' '}
                <a href="mailto:laboirebavard@gmail.com" className="text-gold hover:text-white transition-colors">
                  laboirebavard@gmail.com
                </a>
              </p>
            </div>

            <div style={{ marginBottom: 48 }}>
              <h2 className="font-serif font-normal text-white mb-4" style={{ fontSize: '1.4rem' }}>
                Cookies
              </h2>
              <p>
                Ce site n'utilise pas de cookies de traçage ou publicitaires. Un cookie de session peut être utilisé
                pour mémoriser votre préférence de langue (FR/EN). Il est supprimé à la fermeture du navigateur.
              </p>
            </div>

            <div>
              <h2 className="font-serif font-normal text-white mb-4" style={{ fontSize: '1.4rem' }}>
                Responsabilité
              </h2>
              <p>
                La Boire Bavard s'efforce de maintenir les informations publiées sur ce site exactes et à jour.
                Nous ne pouvons garantir l'exactitude ou l'exhaustivité des informations présentes et déclinons
                toute responsabilité pour les éventuelles erreurs ou omissions.
              </p>
            </div>

          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
