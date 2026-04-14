'use client'

import { useState, useEffect, useRef } from 'react'
import { LogoSVG } from '@/components/Logo'

type Lang = 'fr' | 'en' | 'es' | 'pt'

export type RoomTheme = {
  pageBg: string
  topbarBg: string
  topbarBorder: string
  accent: string
  accentRgb: string
  cardBg: string
  cardBorder: string
  cardShadow: string
  heading: string
  text: string
  textSub: string
  textMuted: string
  divider: string
  wifiBg: string
  byeBg: string
  pillBg: string
  pillActiveBg: string
  pillActiveText: string
  navBg: string
  navBorder: string
  navActive: string
  navInactive: string
}

export type RoomData = {
  name: string
  slug: string
  emoji: string
  bg: string
  image?: string
  theme: RoomTheme
  details: { fr: string; en: string; es: string; pt: string }[]
}

// ─── Traductions ──────────────────────────────────────────────────────────────
const T = {
  tag:           { fr: 'Bienvenue · La Boire Bavard', en: 'Welcome · La Boire Bavard', es: 'Bienvenido · La Boire Bavard', pt: 'Bem-vindo · La Boire Bavard' },
  mainTitle:     { fr: 'Votre séjour en Anjou', en: 'Your Stay in Anjou', es: 'Su Estancia en Anjou', pt: 'A Sua Estadia no Anjou' },
  sandrineNote:  { fr: '"Je suis heureuse de vous accueillir. Cette maison est la mienne et chaque détail a été pensé pour vous. N\'hésitez jamais à me demander quoi que ce soit."', en: '"I am delighted to welcome you. This is my home and every detail has been thought of for you. Please never hesitate to ask me anything at all."', es: '"Es un placer recibirle. Esta casa es mía y cada detalle ha sido pensado para usted. No dude nunca en pedirme lo que necesite."', pt: '"É um prazer recebê-lo. Esta casa é minha e cada detalhe foi pensado para si. Não hesite em pedir-me o que precisar."' },
  sandrine:      { fr: '— Sandrine, votre hôtesse', en: '— Sandrine, your host', es: '— Sandrine, su anfitriona', pt: '— Sandrine, a sua anfitriã' },
  wifiTitle:     { fr: 'Connexion WiFi', en: 'WiFi Connection', es: 'Conexión WiFi', pt: 'Conexão WiFi' },
  network:       { fr: 'Réseau', en: 'Network', es: 'Red', pt: 'Rede' },
  password:      { fr: 'Mot de passe', en: 'Password', es: 'Contraseña', pt: 'Senha' },
  checkin:       { fr: 'Arrivée', en: 'Check-in', es: 'Llegada', pt: 'Check-in' },
  checkout:      { fr: 'Départ', en: 'Check-out', es: 'Salida', pt: 'Saída' },
  breakfastTime: { fr: 'Petit-déjeuner', en: 'Breakfast', es: 'Desayuno', pt: 'Café da manhã' },
  tableLabel:    { fr: 'Table d\'hôtes', en: 'Dinner', es: 'Cena', pt: 'Jantar' },
  morningTag:    { fr: 'TRADITIONS DU MATIN', en: 'MORNING TRADITIONS', es: 'TRADICIONES MATUTINAS', pt: 'TRADIÇÕES MATINAIS' },
  morningTitle:  { fr: 'Le Petit-Déjeuner', en: 'Breakfast at the Estate', es: 'El Desayuno de la Casa', pt: 'O Café da Manhã da Casa' },
  morningDesc:   { fr: 'Servi en salle ou en terrasse de 7h30 à 10h00. Sandrine prépare chaque matin un petit-déjeuner maison avec les meilleurs produits de la région.', en: 'Served indoors or on the terrace from 7:30 to 10:00. Sandrine prepares a homemade breakfast each morning with the finest local produce.', es: 'Servido en el salón o en la terraza de 7:30 a 10:00. Sandrine prepara cada mañana un desayuno casero con los mejores productos locales.', pt: 'Servido na sala ou na varanda das 7h30 às 10h00. A Sandrine prepara todos os dias um pequeno-almoço caseiro com os melhores produtos locais.' },
  dietTag:       { fr: 'PRÉFÉRENCES ALIMENTAIRES', en: 'DIETARY PREFERENCES', es: 'PREFERENCIAS ALIMENTARIAS', pt: 'PREFERÊNCIAS ALIMENTARES' },
  dietDesc:      { fr: 'Nous adaptons le petit-déjeuner à vos besoins. Signalez vos préférences à Sandrine la veille.', en: 'We tailor breakfast to your needs. Let Sandrine know your preferences the evening before.', es: 'Adaptamos el desayuno a sus necesidades. Informe a Sandrine de sus preferencias la noche anterior.', pt: 'Adaptamos o café da manhã às suas necessidades. Informe a Sandrine das suas preferências na noite anterior.' },
  diets:         { fr: ['Végétarien', 'Végétalien', 'Sans gluten', 'Allergie fruits à coque', 'Sans lactose', 'Halal'], en: ['Vegetarian', 'Vegan', 'Gluten-Free', 'Nut Allergy', 'Dairy-Free', 'Halal'], es: ['Vegetariano', 'Vegano', 'Sin gluten', 'Alergia frutos secos', 'Sin lactosa', 'Halal'], pt: ['Vegetariano', 'Vegano', 'Sem glúten', 'Alergia a nozes', 'Sem lactose', 'Halal'] },
  dietSent:      { fr: '✓ Sandrine a été prévenue', en: '✓ Sandrine has been notified', es: '✓ Sandrine ha sido avisada', pt: '✓ Sandrine foi notificada' },
  dinnerTag:     { fr: 'DÎNER EN COMMUN', en: 'SHARED DINING', es: 'CENA COMPARTIDA', pt: 'JANTAR PARTILHADO' },
  dinnerTitle:   { fr: 'Table d\'Hôtes', en: 'Host\'s Table', es: 'Mesa de Huéspedes', pt: 'Mesa de Hóspedes' },
  dinnerDesc:    { fr: 'Sandrine cuisine chaque soir un repas généreux autour de la grande table — légumes du potager, produits du terroir angevin, vins de Loire sélectionnés.', en: 'Sandrine cooks a generous dinner around the long table each evening — garden vegetables, Anjou terroir produce, selected Loire wines.', es: 'Sandrine cocina cada noche una cena generosa alrededor de la gran mesa — verduras del huerto, productos del terruño angevino, vinos del Loira seleccionados.', pt: 'A Sandrine cozinha todas as noites um jantar generoso à volta da mesa grande — legumes da horta, produtos do terroir angevino, vinhos do Loira selecionados.' },
  dinnerBook:    { fr: 'Réservation obligatoire avant 18h00', en: 'Reservation required before 6:00 PM', es: 'Reserva obligatoria antes de las 18:00', pt: 'Reserva obrigatória antes das 18h00' },
  dinnerPrice:   { fr: '25 € par personne', en: '25 € per person', es: '25 € por persona', pt: '25 € por pessoa' },
  dinnerSlots:   { fr: 'Choisissez votre heure', en: 'Select your time', es: 'Elija su hora', pt: 'Escolha a sua hora' },
  dinnerConfirm: { fr: 'Confirmer par WhatsApp', en: 'Confirm via WhatsApp', es: 'Confirmar por WhatsApp', pt: 'Confirmar via WhatsApp' },
  dinnerSent:    { fr: '✓ Réservation envoyée à Sandrine', en: '✓ Reservation sent to Sandrine', es: '✓ Reserva enviada a Sandrine', pt: '✓ Reserva enviada à Sandrine' },
  poolTag:       { fr: 'BIEN-ÊTRE & DÉTENTE', en: 'WELLNESS & RELAXATION', es: 'BIENESTAR & RELAJACIÓN', pt: 'BEM-ESTAR & RELAXAMENTO' },
  poolTitle:     { fr: 'Piscine & Spa', en: 'Pool & Spa', es: 'Piscina & Spa', pt: 'Piscina & Spa' },
  poolHours:     { fr: 'Ouverte de 9h à 21h', en: 'Open from 9 AM to 9 PM', es: 'Abierta de 9:00 a 21:00', pt: 'Aberta das 9h às 21h' },
  spaNote:       { fr: 'Spa & Sauna sur réservation', en: 'Spa & Sauna by reservation', es: 'Spa & Sauna con reserva', pt: 'Spa & Sauna mediante reserva' },
  spaBookTitle:  { fr: 'Réserver le Spa & Sauna', en: 'Book the Spa & Sauna', es: 'Reservar el Spa & Sauna', pt: 'Reservar o Spa & Sauna' },
  spaBookDesc:   { fr: 'Choisissez votre créneau (1h à 1h30). Sandrine confirmera votre réservation.', en: 'Choose your slot (1h to 1.5h). Sandrine will confirm your booking.', es: 'Elija su franja horaria (1h a 1h30). Sandrine confirmará su reserva.', pt: 'Escolha o seu horário (1h a 1h30). Sandrine confirmará a sua reserva.' },
  spaSlots:      { fr: 'Choisissez un créneau', en: 'Select a time slot', es: 'Elija una franja', pt: 'Escolha um horário' },
  spaConfirm:    { fr: 'Demander ce créneau', en: 'Request this slot', es: 'Solicitar esta franja', pt: 'Solicitar este horário' },
  spaSent:       { fr: '✓ Demande envoyée à Sandrine', en: '✓ Request sent to Sandrine', es: '✓ Solicitud enviada a Sandrine', pt: '✓ Pedido enviado à Sandrine' },
  poolRules:     { fr: ['Douche obligatoire avant d\'entrer', 'Serviettes disponibles sur demande', 'Silence demandé après 22h'], en: ['Shower required before entering', 'Towels available on request', 'Quiet hours after 10 PM'], es: ['Ducha obligatoria antes de entrar', 'Toallas disponibles a petición', 'Silencio a partir de las 22:00'], pt: ['Duche obrigatório antes de entrar', 'Toalhas disponíveis a pedido', 'Silêncio após as 22h'] },
  tipsTag:       { fr: 'BONS PLANS', en: 'LOCAL TIPS', es: 'CONSEJOS LOCALES', pt: 'DICAS LOCAIS' },
  tipsTitle:     { fr: 'À Découvrir', en: 'Things to Explore', es: 'Qué Descubrir', pt: 'O Que Descobrir' },
  tips: {
    fr: [
      { emoji: '🍷', name: 'Vignobles d\'Anjou', desc: 'Coteaux de l\'Aubance & Saumur — 5 min' },
      { emoji: '🚴', name: 'Loire à Vélo', desc: 'Départ depuis la propriété' },
      { emoji: '🏰', name: 'Château de Brissac', desc: 'Le plus haut château de France — 10 min' },
      { emoji: '🏙️', name: 'Angers', desc: 'Château, tapisserie, marché — 25 min' },
      { emoji: '🌸', name: 'Saumur', desc: 'Château, caves, équitation — 35 min' },
    ],
    en: [
      { emoji: '🍷', name: 'Anjou Vineyards', desc: 'Coteaux de l\'Aubance & Saumur — 5 min' },
      { emoji: '🚴', name: 'Loire Valley Cycling', desc: 'Departure from the property' },
      { emoji: '🏰', name: 'Château de Brissac', desc: 'Tallest castle in France — 10 min' },
      { emoji: '🏙️', name: 'Angers', desc: 'Castle, tapestry, market — 25 min' },
      { emoji: '🌸', name: 'Saumur', desc: 'Castle, caves, equestrian — 35 min' },
    ],
    es: [
      { emoji: '🍷', name: 'Viñedos de Anjou', desc: 'Coteaux de l\'Aubance & Saumur — 5 min' },
      { emoji: '🚴', name: 'Ciclismo por el Loira', desc: 'Salida desde la propiedad' },
      { emoji: '🏰', name: 'Castillo de Brissac', desc: 'El castillo más alto de Francia — 10 min' },
      { emoji: '🏙️', name: 'Angers', desc: 'Castillo, tapiz, mercado — 25 min' },
      { emoji: '🌸', name: 'Saumur', desc: 'Castillo, cuevas, hípica — 35 min' },
    ],
    pt: [
      { emoji: '🍷', name: 'Vinhedos de Anjou', desc: 'Coteaux de l\'Aubance & Saumur — 5 min' },
      { emoji: '🚴', name: 'Ciclismo no Loire', desc: 'Partida da propriedade' },
      { emoji: '🏰', name: 'Château de Brissac', desc: 'O castelo mais alto de França — 10 min' },
      { emoji: '🏙️', name: 'Angers', desc: 'Castelo, tapeçaria, mercado — 25 min' },
      { emoji: '🌸', name: 'Saumur', desc: 'Castelo, adegas, equitação — 35 min' },
    ],
  },
  rulesTag:    { fr: 'LA MAISON', en: 'HOUSE RULES', es: 'LA CASA', pt: 'A CASA' },
  rulesTitle:  { fr: 'Informations Pratiques', en: 'Practical Information', es: 'Información Práctica', pt: 'Informação Prática' },
  rules: {
    fr: ['Non-fumeur à l\'intérieur — terrasse à disposition', 'Animaux non acceptés', 'Nuisances sonores à éviter après 22h', 'Clé à remettre au départ'],
    en: ['No smoking indoors — terrace available', 'No pets accepted', 'Please keep quiet after 10 PM', 'Return key upon departure'],
    es: ['No fumadores en el interior — terraza disponible', 'No se aceptan mascotas', 'Por favor, silencio a partir de las 22:00', 'Devolver la llave al salir'],
    pt: ['Não fumadores no interior — varanda disponível', 'Animais não aceites', 'Por favor silêncio após as 22h', 'Devolver a chave na saída'],
  },
  byeTag:   { fr: 'À BIENTÔT', en: 'SEE YOU SOON', es: 'HASTA PRONTO', pt: 'ATÉ BREVE' },
  byeTitle: { fr: 'Merci pour votre visite', en: 'Thank You for Staying', es: 'Gracias por su visita', pt: 'Obrigado pela sua visita' },
  byeDesc:  { fr: 'Si votre séjour vous a plu, un avis sur Booking.com ou Google aide beaucoup Sandrine à faire connaître la maison. Merci du fond du cœur.', en: 'If you enjoyed your stay, a review on Booking.com or Google means the world to Sandrine and helps share this place. Thank you so much.', es: 'Si ha disfrutado de su estancia, una reseña en Booking.com o Google ayuda mucho a Sandrine a dar a conocer la casa. Muchas gracias.', pt: 'Se gostou da sua estadia, uma avaliação no Booking.com ou Google ajuda muito a Sandrine a dar a conhecer a casa. Muito obrigado.' },
  rating:   { fr: 'Note actuelle', en: 'Current rating', es: 'Puntuación actual', pt: 'Avaliação atual' },
  navHome:  { fr: 'Accueil', en: 'Home', es: 'Inicio', pt: 'Início' },
  navGuide: { fr: 'Carnet', en: 'Guide', es: 'Guía', pt: 'Guia' },
  navCall:  { fr: 'Appeler', en: 'Call', es: 'Llamar', pt: 'Ligar' },
  navChat:  { fr: 'WhatsApp', en: 'WhatsApp', es: 'WhatsApp', pt: 'WhatsApp' },
}

const WIFI_RESEAU   = 'Livebox-D6B0'
const WIFI_PASSWORD = 'LSjfprSMoDSZCMp9xY'

const DINNER_SLOTS = ['19:00', '19:30', '20:00', '20:30']
const SPA_SLOTS    = ['10:00', '11:30', '14:00', '15:30', '17:00', '18:30', '20:00']

const BREAKFAST_ITEMS = {
  fr: ['Confitures maison', 'Viennoiseries du four', 'Oeufs frais du jardin', 'Fromages d\'Anjou', 'Jus de fruits pressés', 'Café · Thé · Chocolat chaud'],
  en: ['Homemade jams', 'Freshly baked pastries', 'Fresh garden eggs', 'Anjou cheeses', 'Freshly pressed juice', 'Coffee · Tea · Hot chocolate'],
  es: ['Mermeladas caseras', 'Bollería recién horneada', 'Huevos frescos del huerto', 'Quesos de Anjou', 'Zumo recién exprimido', 'Café · Té · Chocolate caliente'],
  pt: ['Compotas caseiras', 'Pastelaria recém-feita', 'Ovos frescos do jardim', 'Queijos de Anjou', 'Sumo de fruta fresco', 'Café · Chá · Chocolate quente'],
}

const LANGS: { code: Lang; label: string }[] = [
  { code: 'fr', label: 'FR' },
  { code: 'en', label: 'EN' },
  { code: 'es', label: 'ES' },
  { code: 'pt', label: 'PT' },
]

async function sendToAdmin(room: string, type: string, data: unknown, lang: string) {
  try {
    await fetch('/api/guide/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ room, type, data, lang }),
    })
  } catch {
    // dégradation gracieuse — ne pas planter si hors-ligne
  }
}

export default function GuideClient({ room }: { room: RoomData }) {
  const [lang, setLang] = useState<Lang>('fr')
  const [selectedDiets, setSelectedDiets] = useState<number[]>([])
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [selectedSpaSlot, setSelectedSpaSlot] = useState<string | null>(null)
  const [dietSent, setDietSent] = useState(false)
  const [dinnerSent, setDinnerSent] = useState(false)
  const [spaSent, setSpaSent] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showWifiQR, setShowWifiQR] = useState(false)
  const [wifiStatus, setWifiStatus] = useState<'idle' | 'done'>('idle')

  const copyPassword = () => {
    navigator.clipboard.writeText(WIFI_PASSWORD).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  const connectWifi = async () => {
    // 1. Copie le mot de passe dans le presse-papier
    try { await navigator.clipboard.writeText(WIFI_PASSWORD) } catch { /* silencieux */ }

    // 2. Tente d'ouvrir les réglages WiFi selon la plateforme
    const ua = navigator.userAgent
    if (/iPhone|iPad|iPod/.test(ua)) {
      window.location.href = 'App-prefs:root=WIFI'
    } else if (/Android/.test(ua)) {
      window.location.href = 'intent:#Intent;action=android.settings.WIFI_SETTINGS;end'
    }

    setWifiStatus('done')
    setTimeout(() => setWifiStatus('idle'), 5000)
  }

  const { theme } = room
  const t = (key: keyof typeof T) => (T[key] as Record<Lang, string>)[lang]

  // ── Sauvegarde auto des régimes (debounce 2s) ──────────────────────────────
  const dietTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const dietInitRef  = useRef(false)

  useEffect(() => {
    if (!dietInitRef.current) { dietInitRef.current = true; return }
    setDietSent(false)
    clearTimeout(dietTimerRef.current)
    dietTimerRef.current = setTimeout(async () => {
      const names = (T.diets['fr'] as string[]).filter((_, i) => selectedDiets.includes(i))
      await sendToAdmin(room.slug, 'diet', { diets: names }, lang)
      setDietSent(true)
    }, 2000)
    return () => clearTimeout(dietTimerRef.current)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDiets])

  const toggleDiet = (i: number) =>
    setSelectedDiets(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i])

  // ── Confirmer dîner ────────────────────────────────────────────────────────
  const confirmDinner = async () => {
    await sendToAdmin(room.slug, 'dinner', { slot: selectedSlot }, lang)
    setDinnerSent(true)
  }

  // ── Confirmer spa ──────────────────────────────────────────────────────────
  const confirmSpa = async () => {
    await sendToAdmin(room.slug, 'spa', { slot: selectedSpaSlot }, lang)
    setSpaSent(true)
  }

  // Helpers styles ─────────────────────────────────────────────────────────
  const card: React.CSSProperties = {
    background: theme.cardBg,
    border: theme.cardBorder !== 'transparent' ? `1px solid ${theme.cardBorder}` : undefined,
    boxShadow: theme.cardShadow,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: '0.875rem',
  }
  const cardInner: React.CSSProperties = { padding: '1.25rem 1.5rem' }
  const cardDivider: React.CSSProperties = { borderBottom: `1px solid ${theme.divider}` }

  const sentBadge = (label: string): React.CSSProperties => ({
    display: 'inline-block',
    background: 'rgba(109,184,122,.15)',
    color: '#6db87a',
    fontSize: '0.72rem',
    padding: '4px 12px',
    borderRadius: 20,
    marginTop: 10,
  })

  return (
    <div style={{ background: theme.pageBg, minHeight: '100vh', fontFamily: 'var(--font-raleway, Arial, sans-serif)', paddingBottom: '5rem' }}>

      {/* ── TOPBAR ── */}
      <div style={{ background: theme.topbarBg, borderBottom: `1px solid ${theme.topbarBorder}`, position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 600, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <LogoSVG height={36} variant="white" />
            <div>
              <p style={{ fontSize: '0.65rem', color: theme.accent, letterSpacing: '0.15em', textTransform: 'uppercase', margin: 0 }}>La Boire Bavard</p>
              <p style={{ fontSize: '0.82rem', fontWeight: 600, color: theme.heading, margin: 0 }}>{room.name}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.3rem', background: theme.pillBg, borderRadius: 20, padding: '0.25rem' }}>
            {LANGS.map(({ code, label }) => (
              <button
                key={code}
                onClick={() => setLang(code)}
                style={{
                  background: lang === code ? theme.pillActiveBg : 'transparent',
                  color: lang === code ? theme.pillActiveText : theme.navInactive,
                  border: 'none', borderRadius: 16,
                  padding: '0.3rem 0.6rem',
                  fontSize: '0.75rem', fontWeight: 700,
                  cursor: 'pointer', transition: 'all .2s',
                  fontFamily: 'inherit',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── PHOTO DE LA CHAMBRE ── */}
      {room.image && (
        <div style={{ maxWidth: 600, margin: '0 auto', padding: '1.25rem 1.25rem 0' }}>
          <div style={{ position: 'relative', width: '100%', height: 'clamp(200px, 55vw, 320px)', borderRadius: 20, overflow: 'hidden' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={room.image}
              alt={room.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 35%', display: 'block' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 45%, rgba(0,0,0,0.55) 100%)' }} />
            <div style={{ position: 'absolute', bottom: '1.25rem', left: '1.5rem' }}>
              <p style={{ color: theme.accent, fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 0.2rem' }}>
                {room.emoji} La Boire Bavard
              </p>
              <p style={{ color: 'white', fontSize: '1.4rem', fontFamily: 'var(--font-playfair, Georgia, serif)', margin: 0, fontStyle: 'italic', fontWeight: 400, lineHeight: 1.2 }}>
                {room.name}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── CONTENU ── */}
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '2rem 1.25rem 1rem' }}>

        {/* Intro */}
        <p style={{ fontSize: '0.7rem', color: theme.accent, letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 0.5rem' }}>
          {t('tag')}
        </p>
        <h1 style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: 'clamp(2rem, 6vw, 3rem)', fontWeight: 700, color: theme.heading, margin: '0 0 2rem', lineHeight: 1.15 }}>
          {t('mainTitle')}
        </h1>

        {/* Hero chambre */}
        <div style={{ background: `linear-gradient(160deg, ${room.bg} 0%, #0a1208 100%)`, borderRadius: 20, padding: '2.5rem 2rem', marginBottom: '0.875rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: `rgba(${theme.accentRgb},0.08)`, pointerEvents: 'none' }} />
          <p style={{ color: theme.accent, fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 0.75rem' }}>
            {room.emoji} {room.name}
          </p>
          <h2 style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', color: 'white', fontWeight: 400, fontStyle: 'italic', margin: '0 0 1.25rem', lineHeight: 1.3 }}>
            {room.details[0][lang]}
          </h2>
          {room.details.slice(1).map((d, i) => (
            <p key={i} style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.92rem', margin: '0.3rem 0', lineHeight: 1.6 }}>
              · {d[lang]}
            </p>
          ))}
        </div>

        {/* Mot de Sandrine */}
        <div style={{ ...card, overflow: 'visible' as const }}>
          <div style={cardInner}>
            <p style={{ fontSize: '1.05rem', color: theme.text, lineHeight: 1.8, margin: 0, fontStyle: 'italic', fontFamily: 'var(--font-playfair, Georgia, serif)' }}>
              {t('sandrineNote')}
            </p>
            <p style={{ fontSize: '0.88rem', color: theme.accent, fontWeight: 700, margin: '1rem 0 0' }}>
              {t('sandrine')}
            </p>
          </div>
        </div>

        {/* WiFi — design épuré */}
        <div style={{ background: theme.wifiBg, borderRadius: 20, marginBottom: '0.875rem', border: `1px solid rgba(${theme.accentRgb},.18)`, overflow: 'hidden' }}>
          {/* En-tête */}
          <div style={{ padding: '1.1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 40, height: 40, background: `rgba(${theme.accentRgb},.15)`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', flexShrink: 0 }}>📶</div>
            <div>
              <p style={{ color: theme.accent, fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', margin: 0 }}>{t('wifiTitle')}</p>
              <p style={{ color: theme.textSub, fontSize: '0.8rem', margin: '0.1rem 0 0' }}>Connexion gratuite & illimitée</p>
            </div>
          </div>
          {/* Réseau */}
          <div style={{ padding: '0.875rem 1.5rem', borderTop: `1px solid rgba(${theme.accentRgb},.1)`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: theme.textSub, fontSize: '0.82rem' }}>{t('network')}</span>
            <span style={{ color: theme.heading, fontSize: '0.95rem', fontWeight: 700, fontFamily: 'monospace' }}>{WIFI_RESEAU}</span>
          </div>
          {/* Mot de passe */}
          <div style={{ padding: '0.875rem 1.5rem', borderTop: `1px solid rgba(${theme.accentRgb},.1)` }}>
            <p style={{ color: theme.textSub, fontSize: '0.78rem', margin: '0 0 0.3rem' }}>{t('password')}</p>
            <p style={{ color: theme.heading, fontSize: '1.1rem', fontWeight: 700, fontFamily: 'monospace', margin: 0, letterSpacing: '0.04em', wordBreak: 'break-all' }}>{WIFI_PASSWORD}</p>
          </div>
          {/* QR code WiFi + bouton copier */}
          <div style={{ padding: '1rem 1.5rem 1.5rem', borderTop: `1px solid rgba(${theme.accentRgb},.1)`, textAlign: 'center' }}>
            <p style={{ color: theme.textMuted, fontSize: '0.68rem', letterSpacing: '0.15em', textTransform: 'uppercase', margin: '0 0 0.75rem' }}>
              Appuyez sur le QR code pour vous connecter
            </p>
            <a
              href={`WIFI:T:WPA;S:${WIFI_RESEAU};P:${WIFI_PASSWORD};;`}
              title="Touchez pour connecter automatiquement"
              style={{ display: 'inline-block', borderRadius: 16, overflow: 'hidden', cursor: 'pointer' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/photos/wifi-qr-lbb.png"
                alt="QR code WiFi La Boire Bavard — appuyez pour connecter"
                style={{ width: 210, height: 210, display: 'block', borderRadius: 16 }}
              />
            </a>
            <p style={{ color: theme.textMuted, fontSize: '0.72rem', margin: '0.6rem 0 1rem', lineHeight: 1.5 }}>
              Ou scannez avec l'appareil photo
            </p>
            <button
              onClick={connectWifi}
              style={{ width: '100%', background: `rgba(${theme.accentRgb},.15)`, color: theme.accent, border: `1px solid rgba(${theme.accentRgb},.3)`, borderRadius: 14, padding: '0.8rem 1rem', fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              {wifiStatus === 'done' ? '✓ Mot de passe copié dans le presse-papier' : '📋 Copier le mot de passe & ouvrir le WiFi'}
            </button>
          </div>
        </div>

        {/* 4 infos clés */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem', marginBottom: '0.875rem' }}>
          {[
            { emoji: '🕐', label: t('checkin'), val: 'Dès 15h00' },
            { emoji: '🚪', label: t('checkout'), val: 'Avant 11h00' },
            { emoji: '☕', label: t('breakfastTime'), val: '7h30 – 10h00' },
            { emoji: '🍽️', label: t('tableLabel'), val: '25 € / pers.' },
          ].map(({ emoji, label, val }) => (
            <div key={label} style={{ ...card, overflow: 'visible' as const, marginBottom: 0, textAlign: 'center', padding: '1.1rem 1rem', borderTop: `3px solid ${theme.accent}` }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.35rem' }}>{emoji}</div>
              <p style={{ fontSize: '0.72rem', color: theme.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 0.25rem' }}>{label}</p>
              <p style={{ fontSize: '0.92rem', fontWeight: 700, color: theme.heading, margin: 0 }}>{val}</p>
            </div>
          ))}
        </div>

        {/* Petit-déjeuner */}
        <div style={card}>
          <div style={{ background: 'linear-gradient(145deg, #3d2008 0%, #1a0d04 100%)', padding: '2.5rem 1.75rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', bottom: -20, right: -20, fontSize: '7rem', opacity: 0.15, lineHeight: 1 }}>☕</div>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 0.75rem' }}>
              {t('morningTag')}
            </p>
            <h2 style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: 'clamp(1.5rem, 4vw, 2rem)', color: 'white', fontWeight: 400, margin: 0, lineHeight: 1.3 }}>
              {t('morningTitle')}
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', lineHeight: 1.7, margin: '0.875rem 0 0' }}>
              {t('morningDesc')}
            </p>
          </div>
          <div style={{ background: theme.cardBg, padding: '1.25rem 1.5rem' }}>
            {(BREAKFAST_ITEMS[lang] as string[]).map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.7rem 0', ...(i < 5 ? cardDivider : {}) }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: theme.accent, flexShrink: 0 }} />
                <p style={{ fontSize: '0.98rem', color: theme.text, margin: 0, fontWeight: 500 }}>{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Préférences alimentaires — avec sauvegarde auto */}
        <div style={{ ...card, overflow: 'visible' as const }}>
          <div style={cardInner}>
            <p style={{ fontSize: '0.68rem', color: theme.accent, letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 0.375rem' }}>
              {t('dietTag')}
            </p>
            <p style={{ fontSize: '0.9rem', color: theme.textSub, lineHeight: 1.6, margin: '0 0 1.25rem' }}>
              {t('dietDesc')}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {(T.diets[lang] as string[]).map((d, i) => (
                <button
                  key={i}
                  onClick={() => toggleDiet(i)}
                  style={{
                    background: selectedDiets.includes(i) ? theme.pillActiveBg : theme.pillBg,
                    color: selectedDiets.includes(i) ? theme.pillActiveText : theme.text,
                    border: 'none', borderRadius: 20, padding: '0.5rem 1rem',
                    fontSize: '0.88rem', fontWeight: 600, fontFamily: 'inherit',
                    display: 'flex', alignItems: 'center', gap: '0.35rem',
                    cursor: 'pointer', transition: 'all .18s',
                  }}
                >
                  {selectedDiets.includes(i) && <span style={{ fontSize: '0.75rem' }}>✓</span>}
                  {d}
                </button>
              ))}
            </div>
            {selectedDiets.length > 0 && (
              <div style={sentBadge('')}>
                {dietSent ? t('dietSent') : '⏳ Envoi en cours…'}
              </div>
            )}
          </div>
        </div>

        {/* Table d'hôtes — avec sauvegarde */}
        <div style={card}>
          <div style={{ background: `linear-gradient(145deg, ${room.bg} 0%, #0a1208 100%)`, padding: '2rem 1.75rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', bottom: -20, right: -20, fontSize: '7rem', opacity: 0.1, lineHeight: 1 }}>🍷</div>
            <p style={{ color: 'rgba(196,160,80,0.8)', fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 0.75rem' }}>
              {t('dinnerTag')}
            </p>
            <h2 style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: 'clamp(1.5rem, 4vw, 2rem)', color: 'white', fontWeight: 400, margin: '0 0 0.875rem', lineHeight: 1.3 }}>
              {t('dinnerTitle')}
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem', lineHeight: 1.7, margin: '0 0 0.75rem' }}>
              {t('dinnerDesc')}
            </p>
            <span style={{ background: '#c4a050', color: '#1a3320', borderRadius: 20, padding: '0.3rem 0.875rem', fontSize: '0.88rem', fontWeight: 700 }}>
              {t('dinnerPrice')}
            </span>
          </div>
          <div style={{ background: theme.cardBg, padding: '1.5rem' }}>
            <p style={{ fontSize: '0.72rem', color: theme.textMuted, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 0.875rem' }}>
              {t('dinnerSlots')}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
              {DINNER_SLOTS.map(slot => (
                <button
                  key={slot}
                  onClick={() => { setSelectedSlot(slot); setDinnerSent(false) }}
                  style={{
                    background: selectedSlot === slot ? theme.pillActiveBg : theme.pillBg,
                    color: selectedSlot === slot ? theme.pillActiveText : theme.text,
                    border: `2px solid ${selectedSlot === slot ? theme.accent : theme.divider}`,
                    borderRadius: 12, padding: '0.6rem 1.25rem',
                    fontSize: '1rem', fontWeight: 700, fontFamily: 'monospace',
                    cursor: 'pointer', transition: 'all .18s',
                  }}
                >
                  {slot}
                </button>
              ))}
            </div>
            <p style={{ fontSize: '0.82rem', color: '#e07050', fontWeight: 600, margin: '0 0 1rem' }}>
              ⚠ {t('dinnerBook')}
            </p>
            {dinnerSent ? (
              <div style={{ ...sentBadge(''), display: 'block', textAlign: 'center', padding: '12px' }}>
                {t('dinnerSent')}
              </div>
            ) : (
              <a
                href={`https://wa.me/33675786335?text=${encodeURIComponent(selectedSlot ? `Bonjour Sandrine, je souhaite réserver la table d'hôtes pour ${selectedSlot}.` : 'Bonjour Sandrine, je souhaite réserver la table d\'hôtes.')}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={confirmDinner}
                style={{ display: 'block', background: '#25D366', color: 'white', borderRadius: 14, padding: '1rem', textAlign: 'center', fontWeight: 700, fontSize: '1rem', textDecoration: 'none' }}
              >
                {t('dinnerConfirm')}
              </a>
            )}
          </div>
        </div>

        {/* Piscine & Spa — avec réservation créneau */}
        <div style={card}>
          <div style={{ background: 'linear-gradient(145deg, #0d2e32 0%, #051518 100%)', padding: '2rem 1.75rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', bottom: -20, right: -20, fontSize: '7rem', opacity: 0.1 }}>🏊</div>
            <p style={{ color: 'rgba(196,160,80,0.8)', fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 0.75rem' }}>
              {t('poolTag')}
            </p>
            <h2 style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: 'clamp(1.5rem, 4vw, 2rem)', color: 'white', fontWeight: 400, margin: '0 0 0.5rem' }}>
              {t('poolTitle')}
            </h2>
            <p style={{ color: '#7dd4e0', fontSize: '1rem', fontWeight: 600, margin: '0 0 0.25rem' }}>{t('poolHours')}</p>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.88rem', margin: 0 }}>{t('spaNote')}</p>
          </div>
          <div style={{ background: theme.cardBg, padding: '1.25rem 1.5rem' }}>
            {(T.poolRules[lang] as string[]).map((rule, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.875rem', padding: '0.6rem 0', ...(i < 2 ? cardDivider : {}), alignItems: 'center' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#7dd4e0', flexShrink: 0 }} />
                <p style={{ fontSize: '0.98rem', color: theme.text, margin: 0 }}>{rule}</p>
              </div>
            ))}

            {/* Réservation spa */}
            <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: `1px solid ${theme.divider}` }}>
              <p style={{ fontSize: '0.72rem', color: '#7dd4e0', letterSpacing: '0.15em', textTransform: 'uppercase', margin: '0 0 0.5rem' }}>
                🛁 {t('spaBookTitle')}
              </p>
              <p style={{ fontSize: '0.85rem', color: theme.textSub, lineHeight: 1.6, margin: '0 0 1rem' }}>
                {t('spaBookDesc')}
              </p>
              <p style={{ fontSize: '0.65rem', color: theme.textMuted, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 0.75rem' }}>
                {t('spaSlots')}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                {SPA_SLOTS.map(slot => (
                  <button
                    key={slot}
                    onClick={() => { setSelectedSpaSlot(slot); setSpaSent(false) }}
                    style={{
                      background: selectedSpaSlot === slot ? '#7dd4e0' : theme.pillBg,
                      color: selectedSpaSlot === slot ? '#051518' : theme.text,
                      border: `2px solid ${selectedSpaSlot === slot ? '#7dd4e0' : theme.divider}`,
                      borderRadius: 10, padding: '0.5rem 1rem',
                      fontSize: '0.92rem', fontWeight: 700, fontFamily: 'monospace',
                      cursor: 'pointer', transition: 'all .18s',
                    }}
                  >
                    {slot}
                  </button>
                ))}
              </div>
              {spaSent ? (
                <div style={{ ...sentBadge(''), display: 'block', textAlign: 'center', padding: '10px' }}>
                  {t('spaSent')}
                </div>
              ) : (
                <a
                  href={`https://wa.me/33675786335?text=${encodeURIComponent(selectedSpaSlot ? `Bonjour Sandrine, je souhaite réserver le spa pour ${selectedSpaSlot}.` : 'Bonjour Sandrine, je souhaite réserver le spa.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={confirmSpa}
                  style={{ display: 'block', background: '#0d2e32', border: '1px solid #7dd4e040', color: '#7dd4e0', borderRadius: 14, padding: '0.875rem', textAlign: 'center', fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none' }}
                >
                  {t('spaConfirm')}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bons plans */}
        <div style={{ marginBottom: '0.875rem' }}>
          <p style={{ fontSize: '0.68rem', color: theme.accent, letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 0.5rem' }}>
            {t('tipsTag')}
          </p>
          <h2 style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: 'clamp(1.5rem, 4vw, 2rem)', color: theme.heading, fontWeight: 700, margin: '0 0 1rem', lineHeight: 1.2 }}>
            {t('tipsTitle')}
          </h2>
          <div style={{ display: 'grid', gap: '0.625rem' }}>
            {(T.tips[lang] as { emoji: string; name: string; desc: string }[]).map(({ emoji, name, desc }) => (
              <div key={name} style={{ ...card, overflow: 'visible' as const, marginBottom: 0, display: 'flex', gap: '1rem', alignItems: 'center', padding: '1.1rem 1.25rem' }}>
                <span style={{ fontSize: '2rem', flexShrink: 0 }}>{emoji}</span>
                <div>
                  <p style={{ fontSize: '0.98rem', fontWeight: 700, color: theme.heading, margin: 0 }}>{name}</p>
                  <p style={{ fontSize: '0.82rem', color: theme.textSub, margin: '0.15rem 0 0' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* La maison */}
        <div style={card}>
          <div style={{ ...cardDivider, ...cardInner }}>
            <p style={{ fontSize: '0.68rem', color: theme.accent, letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 0.25rem' }}>{t('rulesTag')}</p>
            <h2 style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: '1.4rem', color: theme.heading, fontWeight: 700, margin: 0 }}>{t('rulesTitle')}</h2>
          </div>
          <div style={{ background: theme.cardBg, padding: '0.5rem 1.5rem 1.25rem' }}>
            {(T.rules[lang] as string[]).map((rule, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.875rem', padding: '0.65rem 0', ...(i < 3 ? cardDivider : {}), alignItems: 'flex-start' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: theme.accent, flexShrink: 0, marginTop: '0.45rem' }} />
                <p style={{ fontSize: '0.98rem', color: theme.text, margin: 0, lineHeight: 1.5 }}>{rule}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Au revoir */}
        <div style={{ background: theme.byeBg, borderRadius: 20, padding: '2.5rem 1.75rem', textAlign: 'center', border: `1px solid rgba(${theme.accentRgb},.2)` }}>
          <p style={{ color: theme.accent, fontSize: '0.68rem', letterSpacing: '0.22em', textTransform: 'uppercase', margin: '0 0 0.75rem' }}>{t('byeTag')}</p>
          <h2 style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: 'clamp(1.5rem, 4vw, 2rem)', color: 'white', fontWeight: 400, fontStyle: 'italic', margin: '0 0 1rem', lineHeight: 1.3 }}>
            {t('byeTitle')}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', lineHeight: 1.75, margin: '0 0 1rem' }}>
            {t('byeDesc')}
          </p>
          <p style={{ color: theme.accent, fontSize: '0.88rem', margin: 0, opacity: 0.8 }}>{t('rating')} : ⭐ 9,9 / 10</p>
        </div>

      </div>

      {/* ── BOTTOM NAV ── */}
      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 600, background: theme.navBg, backdropFilter: 'blur(12px)', borderTop: `1px solid ${theme.navBorder}`, display: 'flex', padding: '0 0 env(safe-area-inset-bottom)' }}>
        {[
          { href: '/', icon: '🏠', label: t('navHome'), active: false },
          { href: '#top', icon: '📖', label: t('navGuide'), active: true },
          { href: 'tel:+33675786335', icon: '📞', label: t('navCall'), active: false },
          { href: 'https://wa.me/33675786335', icon: '💬', label: t('navChat'), active: false },
        ].map(({ href, icon, label, active }) => (
          <a
            key={label}
            href={href}
            target={href.startsWith('http') ? '_blank' : undefined}
            rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0.75rem 0.25rem 0.875rem', textDecoration: 'none', color: active ? theme.navActive : theme.navInactive, fontSize: '0.65rem', fontWeight: active ? 700 : 500, letterSpacing: '0.05em', textTransform: 'uppercase', gap: '0.25rem', borderTop: active ? `3px solid ${theme.accent}` : '3px solid transparent' }}
          >
            <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>{icon}</span>
            {label}
          </a>
        ))}
      </div>

    </div>
  )
}
