import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact & Accès — La Boire Bavard',
  description: "Contactez Sandrine & Jean-Marc pour réserver votre séjour à La Boire Bavard. Téléphone, email, WhatsApp · Adresse à Blaison-Saint-Sulpice, entre Angers et Saumur.",
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
