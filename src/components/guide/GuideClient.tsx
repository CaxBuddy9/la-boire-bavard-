'use client'

import { useState, useEffect, useRef } from 'react'
import { MENU } from '@/lib/menu'

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
  images?: string[]
  theme: RoomTheme
  details: { fr: string; en: string; es: string; pt: string }[]
}

// ─── Traductions ──────────────────────────────────────────────────────────────
const T = {
  tag:           { fr: 'Bienvenue · La Boire Bavard', en: 'Welcome · La Boire Bavard', es: 'Bienvenido · La Boire Bavard', pt: 'Bem-vindo · La Boire Bavard' },
  mainTitle:     { fr: 'Votre séjour en Anjou', en: 'Your Stay in Anjou', es: 'Su Estancia en Anjou', pt: 'A Sua Estadia no Anjou' },
  sandrineNote:  { fr: '"Nous sommes heureux de vous accueillir. Cette maison est la nôtre et chaque détail a été pensé pour vous. N\'hésitez jamais à nous demander quoi que ce soit."', en: '"We are delighted to welcome you. This is our home and every detail has been thought of for you. Please never hesitate to ask us anything at all."', es: '"Estamos encantados de recibirle. Esta casa es nuestra y cada detalle ha sido pensado para usted. No dude nunca en pedirnos lo que necesite."', pt: '"Estamos felizes por recebê-lo. Esta casa é nossa e cada detalhe foi pensado para si. Não hesite em pedir-nos o que precisar."' },
  sandrine:      { fr: '— Sandrine & Jean-Marc, vos hôtes', en: '— Sandrine & Jean-Marc, your hosts', es: '— Sandrine y Jean-Marc, sus anfitriones', pt: '— Sandrine e Jean-Marc, os seus anfitriões' },
  wifiTitle:     { fr: 'Connexion WiFi', en: 'WiFi Connection', es: 'Conexión WiFi', pt: 'Conexão WiFi' },
  network:       { fr: 'Réseau', en: 'Network', es: 'Red', pt: 'Rede' },
  password:      { fr: 'Mot de passe', en: 'Password', es: 'Contraseña', pt: 'Senha' },
  checkin:       { fr: 'Arrivée', en: 'Check-in', es: 'Llegada', pt: 'Check-in' },
  checkout:      { fr: 'Départ', en: 'Check-out', es: 'Salida', pt: 'Saída' },
  breakfastTime: { fr: 'Petit-déjeuner', en: 'Breakfast', es: 'Desayuno', pt: 'Café da manhã' },
  menuLabel:     { fr: 'Boissons & Snacks', en: 'Drinks & Snacks', es: 'Bebidas & Snacks', pt: 'Bebidas & Snacks' },
  morningTag:    { fr: 'TRADITIONS DU MATIN', en: 'MORNING TRADITIONS', es: 'TRADICIONES MATUTINAS', pt: 'TRADIÇÕES MATINAIS' },
  morningTitle:  { fr: 'Le Petit-Déjeuner', en: 'Breakfast at the Estate', es: 'El Desayuno de la Casa', pt: 'O Café da Manhã da Casa' },
  morningDesc:   { fr: 'Servi en salle ou en terrasse de 7h30 à 9h30. Sandrine & Jean-Marc préparent chaque matin un petit-déjeuner maison avec les meilleurs produits de la région.', en: 'Served indoors or on the terrace from 7:30 to 9:30. Sandrine & Jean-Marc prepare a homemade breakfast each morning with the finest local produce.', es: 'Servido en el salón o en la terraza de 7:30 a 9:30. Sandrine y Jean-Marc preparan cada mañana un desayuno casero con los mejores productos locales.', pt: 'Servido na sala ou na varanda das 7h30 às 9h30. A Sandrine e o Jean-Marc preparam todos os dias um pequeno-almoço caseiro com os melhores produtos locais.' },
  dietTag:       { fr: 'PRÉFÉRENCES ALIMENTAIRES', en: 'DIETARY PREFERENCES', es: 'PREFERENCIAS ALIMENTARIAS', pt: 'PREFERÊNCIAS ALIMENTARES' },
  dietDesc:      { fr: 'Nous adaptons le petit-déjeuner à vos besoins. Signalez vos préférences à vos hôtes la veille.', en: 'We tailor breakfast to your needs. Let your hosts know your preferences the evening before.', es: 'Adaptamos el desayuno a sus necesidades. Informe a sus anfitriones de sus preferencias la noche anterior.', pt: 'Adaptamos o café da manhã às suas necessidades. Informe os seus anfitriões das suas preferências na noite anterior.' },
  diets:         { fr: ['Végétarien', 'Végétalien', 'Sans gluten', 'Allergie fruits à coque', 'Sans lactose'], en: ['Vegetarian', 'Vegan', 'Gluten-Free', 'Nut Allergy', 'Dairy-Free'], es: ['Vegetariano', 'Vegano', 'Sin gluten', 'Alergia frutos secos', 'Sin lactosa'], pt: ['Vegetariano', 'Vegano', 'Sem glúten', 'Alergia a nozes', 'Sem lactose'] },
  plancheItems:  { fr: ['Saucisson sec', 'Chiffonade de chorizo', 'Fromages affinés du Maine-et-Loire', 'Quiche maison ou spécialité du jour', 'Pain frais & condiments'], en: ['Cured sausage', 'Chorizo', 'Aged Maine-et-Loire cheeses', 'Homemade quiche or dish of the day', 'Fresh bread & condiments'], es: ['Salchichón', 'Chorizo', 'Quesos curados de Maine-et-Loire', 'Quiche casera o plato del día', 'Pan fresco y condimentos'], pt: ['Salame seco', 'Chouriço', 'Queijos curados de Maine-et-Loire', 'Quiche caseira ou prato do dia', 'Pão fresco e condimentos'] },
  dietSent:      { fr: '✓ Vos hôtes ont été prévenus', en: '✓ Your hosts have been notified', es: '✓ Sus anfitriones han sido avisados', pt: '✓ Os seus anfitriões foram notificados' },
  plancheTag:    { fr: 'EN SOIRÉE · SUR RÉSERVATION', en: 'EVENINGS · ON REQUEST', es: 'POR LA NOCHE · BAJO RESERVA', pt: 'À NOITE · SOB RESERVA' },
  plancheTitle:  { fr: 'La Planche Apéritive du Soir', en: 'The Evening Aperitif Board', es: 'La Tabla Aperitiva de la Noche', pt: 'A Tábua de Aperitivo da Noite' },
  plancheDesc:   { fr: 'Envie de prolonger la soirée sans ressortir ? Sur réservation, nous vous préparons une planche généreuse à partager — 24 € pour 2, un verre de vin local chacun inclus. Prévenez-nous le matin même.', en: 'Want to extend the evening without going out? On request, we prepare a generous board to share — €24 for two, a glass of local wine each included. Just let us know in the morning.', es: '¿Quiere alargar la velada sin salir? Bajo reserva, preparamos una tabla generosa para compartir — 24 € para 2, una copa de vino local cada uno incluida. Avísenos por la mañana.', pt: 'Quer prolongar a noite sem sair? Sob reserva, preparamos uma tábua generosa para partilhar — 24 € para 2, um copo de vinho local cada um incluído. Avise-nos de manhã.' },
  plancheNote:   { fr: 'Réservez auprès de vos hôtes avant 15h.', en: 'Reserve with your hosts before 3 PM.', es: 'Reserve con sus anfitriones antes de las 15h.', pt: 'Reserve com os seus anfitriões antes das 15h.' },
  menuTag:       { fr: 'À TOUTE HEURE', en: 'ANYTIME', es: 'A CUALQUIER HORA', pt: 'A QUALQUER HORA' },
  menuTitle:     { fr: 'Boissons & Snacks', en: 'Drinks & Snacks', es: 'Bebidas & Snacks', pt: 'Bebidas & Snacks' },
  menuDesc:      { fr: 'Quelques douceurs et boissons sont à votre disposition. Servez-vous et réglez avec vos hôtes — en toute simplicité.', en: 'A few treats and drinks are at your disposal. Help yourself and settle up with your hosts — simple as that.', es: 'Algunas delicias y bebidas están a su disposición. Sírvase y abone con sus anfitriones, con toda sencillez.', pt: 'Algumas guloseimas e bebidas estão à sua disposição. Sirva-se e acerte contas com os seus anfitriões.' },
  menuNote:      { fr: 'Une question sur la carte ? Demandez à vos hôtes.', en: 'Any question about the menu? Just ask your hosts.', es: '¿Alguna pregunta sobre la carta? Pregunte a sus anfitriones.', pt: 'Alguma questão sobre a carta? Pergunte aos seus anfitriões.' },
  galleryTag:    { fr: 'EN IMAGES', en: 'IN PICTURES', es: 'EN IMÁGENES', pt: 'EM IMAGENS' },
  galleryTitle:  { fr: 'Votre chambre en photos', en: 'Your Room in Photos', es: 'Su Habitación en Fotos', pt: 'O Seu Quarto em Fotos' },
  galleryHint:   { fr: 'touchez pour agrandir', en: 'tap to enlarge', es: 'toque para ampliar', pt: 'toque para ampliar' },
  tipsTag:       { fr: 'BONS PLANS', en: 'LOCAL TIPS', es: 'CONSEJOS LOCALES', pt: 'DICAS LOCAIS' },
  tipsTitle:     { fr: 'À Découvrir', en: 'Things to Explore', es: 'Qué Descubrir', pt: 'O Que Descobrir' },
  tips: {
    fr: [
      { emoji: '🍷', name: 'Vignobles d\'Anjou', desc: 'Coteaux de l\'Aubance & Saumur — 5 min' },
      { emoji: '🚴', name: 'Loire à Vélo', desc: 'Départ depuis la propriété' },
      { emoji: '🏰', name: 'Château de Brissac', desc: 'Le plus haut château de France — 10 min' },
      { emoji: '🏙️', name: 'Angers', desc: 'Château, tapisserie, marché — 25 min' },
      { emoji: '🌸', name: 'Saumur', desc: 'Château, caves, équitation — 30 min' },
    ],
    en: [
      { emoji: '🍷', name: 'Anjou Vineyards', desc: 'Coteaux de l\'Aubance & Saumur — 5 min' },
      { emoji: '🚴', name: 'Loire Valley Cycling', desc: 'Departure from the property' },
      { emoji: '🏰', name: 'Château de Brissac', desc: 'Tallest castle in France — 10 min' },
      { emoji: '🏙️', name: 'Angers', desc: 'Castle, tapestry, market — 25 min' },
      { emoji: '🌸', name: 'Saumur', desc: 'Castle, caves, equestrian — 30 min' },
    ],
    es: [
      { emoji: '🍷', name: 'Viñedos de Anjou', desc: 'Coteaux de l\'Aubance & Saumur — 5 min' },
      { emoji: '🚴', name: 'Ciclismo por el Loira', desc: 'Salida desde la propiedad' },
      { emoji: '🏰', name: 'Castillo de Brissac', desc: 'El castillo más alto de Francia — 10 min' },
      { emoji: '🏙️', name: 'Angers', desc: 'Castillo, tapiz, mercado — 25 min' },
      { emoji: '🌸', name: 'Saumur', desc: 'Castillo, cuevas, hípica — 30 min' },
    ],
    pt: [
      { emoji: '🍷', name: 'Vinhedos de Anjou', desc: 'Coteaux de l\'Aubance & Saumur — 5 min' },
      { emoji: '🚴', name: 'Ciclismo no Loire', desc: 'Partida da propriedade' },
      { emoji: '🏰', name: 'Château de Brissac', desc: 'O castelo mais alto de França — 10 min' },
      { emoji: '🏙️', name: 'Angers', desc: 'Castelo, tapeçaria, mercado — 25 min' },
      { emoji: '🌸', name: 'Saumur', desc: 'Castelo, adegas, equitação — 30 min' },
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
  byeDesc:  { fr: 'Si votre séjour vous a plu, un avis Google nous aide beaucoup à faire connaître la maison. Merci du fond du cœur.', en: 'If you enjoyed your stay, a Google review means the world to us and helps share this place. Thank you so much.', es: 'Si ha disfrutado de su estancia, una reseña en Google nos ayuda mucho a dar a conocer la casa. Muchas gracias.', pt: 'Se gostou da sua estadia, uma avaliação no Google ajuda-nos muito a dar a conhecer a casa. Muito obrigado.' },
  rating:   { fr: 'Note actuelle', en: 'Current rating', es: 'Puntuación actual', pt: 'Avaliação atual' },
  navHome:  { fr: 'Accueil', en: 'Home', es: 'Inicio', pt: 'Início' },
  navGuide: { fr: 'Carnet', en: 'Guide', es: 'Guía', pt: 'Guia' },
  navCall:  { fr: 'Appeler', en: 'Call', es: 'Llamar', pt: 'Ligar' },
  navChat:  { fr: 'WhatsApp', en: 'WhatsApp', es: 'WhatsApp', pt: 'WhatsApp' },
}

const WIFI_RESEAU   = 'Livebox-D6B0'
const WIFI_PASSWORD = 'LSjfprSMoDSZCMp9xY'

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
  const [dietSent, setDietSent] = useState(false)
  const [wifiStatus, setWifiStatus] = useState<'idle' | 'done'>('idle')
  const [lightbox, setLightbox] = useState<number | null>(null)

  const connectWifi = async () => {
    // Copie le mot de passe WiFi dans le presse-papier
    try { await navigator.clipboard.writeText(WIFI_PASSWORD) } catch { /* silencieux */ }

    // Android : ouvre directement les réglages WiFi.
    // iOS n'autorise pas l'ouverture des réglages depuis une page web —
    // le mot de passe est copié, prêt à être collé.
    if (/Android/.test(navigator.userAgent)) {
      window.location.href = 'intent:#Intent;action=android.settings.WIFI_SETTINGS;end'
    }

    setWifiStatus('done')
    setTimeout(() => setWifiStatus('idle'), 6000)
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

  const sentBadge = (): React.CSSProperties => ({
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/icon-192.png" alt="La Boire Bavard" width={38} height={38} style={{ display: 'block', flexShrink: 0 }} />
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
              decoding="async"
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

        {/* Galerie photos */}
        {room.images && room.images.length > 0 && (
          <div style={{ marginBottom: '0.875rem' }}>
            <p style={{ fontSize: '0.68rem', color: theme.accent, letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 0.5rem' }}>
              {t('galleryTag')}
            </p>
            <h2 style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: 'clamp(1.5rem, 4vw, 2rem)', color: theme.heading, fontWeight: 700, margin: '0 0 1rem', lineHeight: 1.2 }}>
              {t('galleryTitle')}
            </h2>
            <div style={{ display: 'flex', gap: '0.625rem', overflowX: 'auto', WebkitOverflowScrolling: 'touch', paddingBottom: '0.4rem', scrollSnapType: 'x mandatory' }}>
              {room.images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setLightbox(i)}
                  aria-label={`Voir la photo ${i + 1}`}
                  style={{ flex: '0 0 78%', scrollSnapAlign: 'start', border: 'none', padding: 0, background: 'none', cursor: 'pointer', borderRadius: 16, overflow: 'hidden' }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`${room.name} — photo ${i + 1}`}
                    loading="lazy"
                    decoding="async"
                    style={{ width: '100%', height: 210, objectFit: 'cover', display: 'block', borderRadius: 16 }}
                  />
                </button>
              ))}
            </div>
            <p style={{ fontSize: '0.72rem', color: theme.textMuted, margin: '0.45rem 0 0' }}>
              {room.images.length} photos · {t('galleryHint')}
            </p>
          </div>
        )}

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
          {/* QR code WiFi — à scanner avec l'appareil photo */}
          <div style={{ padding: '1rem 1.5rem 1.5rem', borderTop: `1px solid rgba(${theme.accentRgb},.1)`, textAlign: 'center' }}>
            <p style={{ color: theme.textMuted, fontSize: '0.68rem', letterSpacing: '0.15em', textTransform: 'uppercase', margin: '0 0 0.75rem' }}>
              Scannez ce QR code avec l'appareil photo
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/photos/wifi-qr-lbb.png"
              alt="QR code WiFi La Boire Bavard"
              width={210}
              height={210}
              loading="lazy"
              decoding="async"
              style={{ display: 'block', borderRadius: 16, margin: '0 auto' }}
            />
            <p style={{ color: theme.textMuted, fontSize: '0.72rem', margin: '0.6rem 0 1rem', lineHeight: 1.5 }}>
              La connexion se fait automatiquement, sans saisir le mot de passe
            </p>
            <button
              onClick={connectWifi}
              style={{ width: '100%', background: `rgba(${theme.accentRgb},.15)`, color: theme.accent, border: `1px solid rgba(${theme.accentRgb},.3)`, borderRadius: 14, padding: '0.8rem 1rem', fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              {wifiStatus === 'done' ? '✓ Mot de passe copié — collez-le dans vos réglages WiFi' : '📶 Se connecter au WiFi'}
            </button>
          </div>
        </div>

        {/* 4 infos clés */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem', marginBottom: '0.875rem' }}>
          {[
            { emoji: '🕐', label: t('checkin'), val: 'Dès 16h00' },
            { emoji: '🚪', label: t('checkout'), val: 'Avant 10h00' },
            { emoji: '☕', label: t('breakfastTime'), val: '7h30 – 9h30' },
            { emoji: '🥂', label: t('menuLabel'), val: 'À la carte' },
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
              <div style={sentBadge()}>
                {dietSent ? t('dietSent') : '⏳ Envoi en cours…'}
              </div>
            )}
          </div>
        </div>

        {/* Planche du soir */}
        <div style={card}>
          <div style={{ background: 'linear-gradient(145deg, #3a2410 0%, #160d04 100%)', padding: '2.25rem 1.75rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', bottom: -20, right: -16, fontSize: '6.5rem', opacity: 0.14, lineHeight: 1 }}>🧀</div>
            <p style={{ color: 'rgba(196,160,80,0.85)', fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 0.75rem' }}>
              {t('plancheTag')}
            </p>
            <h2 style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: 'clamp(1.5rem, 4vw, 2rem)', color: 'white', fontWeight: 400, margin: '0 0 0.875rem', lineHeight: 1.3 }}>
              {t('plancheTitle')}
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem', lineHeight: 1.7, margin: 0 }}>
              {t('plancheDesc')}
            </p>
          </div>
          <div style={{ background: theme.cardBg, padding: '1.1rem 1.5rem 1.25rem' }}>
            {(T.plancheItems[lang] as string[]).map((item, i, arr) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.55rem 0', ...(i < arr.length - 1 ? cardDivider : {}) }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: theme.accent, flexShrink: 0 }} />
                <p style={{ fontSize: '0.95rem', color: theme.text, margin: 0, lineHeight: 1.4 }}>{item}</p>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '0.875rem', borderTop: `1px solid ${theme.divider}` }}>
              <p style={{ fontSize: '0.78rem', color: theme.textMuted, fontStyle: 'italic', margin: 0, lineHeight: 1.5 }}>
                {t('plancheNote')}
              </p>
              <span style={{ flexShrink: 0, fontSize: '1.05rem', fontWeight: 700, color: theme.accent, fontFamily: 'monospace', marginLeft: '1rem' }}>24 € / 2</span>
            </div>
          </div>
        </div>

        {/* Boissons & Snacks */}
        <div style={card}>
          <div style={{ background: `linear-gradient(145deg, ${room.bg} 0%, #0a1208 100%)`, padding: '2rem 1.75rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', bottom: -20, right: -20, fontSize: '7rem', opacity: 0.1, lineHeight: 1 }}>🥂</div>
            <p style={{ color: 'rgba(196,160,80,0.8)', fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 0.75rem' }}>
              {t('menuTag')}
            </p>
            <h2 style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: 'clamp(1.5rem, 4vw, 2rem)', color: 'white', fontWeight: 400, margin: '0 0 0.875rem', lineHeight: 1.3 }}>
              {t('menuTitle')}
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem', lineHeight: 1.7, margin: 0 }}>
              {t('menuDesc')}
            </p>
          </div>
          <div style={{ background: theme.cardBg, padding: '1.25rem 1.5rem' }}>
            {MENU.map((section, si) => (
              <div key={si} style={{ marginBottom: si < MENU.length - 1 ? '1.25rem' : 0 }}>
                <p style={{ fontSize: '0.7rem', color: theme.accent, letterSpacing: '0.15em', textTransform: 'uppercase', margin: '0 0 0.4rem' }}>
                  {section.emoji} {section.cat[lang]}
                </p>
                {section.items.map((item, ii) => (
                  <div key={ii} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', padding: '0.6rem 0', ...(ii < section.items.length - 1 ? cardDivider : {}) }}>
                    <p style={{ fontSize: '0.95rem', color: theme.text, margin: 0, lineHeight: 1.4 }}>{item.name[lang]}</p>
                    <span style={{ flexShrink: 0, fontSize: '0.98rem', fontWeight: 700, color: theme.accent, fontFamily: 'monospace' }}>{item.price}</span>
                  </div>
                ))}
              </div>
            ))}
            <p style={{ fontSize: '0.78rem', color: theme.textMuted, fontStyle: 'italic', margin: '1rem 0 0', lineHeight: 1.5 }}>
              {t('menuNote')}
            </p>
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
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', lineHeight: 1.75, margin: '0 0 1.5rem' }}>
            {t('byeDesc')}
          </p>
          <a
            href="https://www.google.com/travel/search?q=la%20boire%20bavard&ap=ugEHcmV2aWV3cw"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-block', padding: '13px 30px', background: theme.accent, color: theme.pillActiveText, textDecoration: 'none', fontSize: '0.7rem', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.875rem' }}
          >
            {lang === 'en' ? '⭐ Leave a review' : lang === 'es' ? '⭐ Dejar una reseña' : lang === 'pt' ? '⭐ Deixar uma avaliação' : '⭐ Laisser un avis'}
          </a>
          <br />
          <a
            href={`/chambres/cote-${room.slug}`}
            style={{ display: 'inline-block', color: 'rgba(255,255,255,0.6)', textDecoration: 'underline', fontSize: '0.78rem', marginBottom: '1rem' }}
          >
            {lang === 'en' ? 'Book again' : lang === 'es' ? 'Reservar de nuevo' : lang === 'pt' ? 'Reservar novamente' : 'Réserver à nouveau'}
          </a>
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

      {/* ── LIGHTBOX GALERIE ── */}
      {lightbox !== null && room.images && (
        <div
          onClick={() => setLightbox(null)}
          style={{ position: 'fixed', inset: 0, zIndex: 9998, background: 'rgba(0,0,0,.95)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
        >
          <button
            onClick={() => setLightbox(null)}
            aria-label="Fermer"
            style={{ position: 'absolute', top: 'calc(env(safe-area-inset-top) + 12px)', right: 18, background: 'none', border: 'none', color: 'rgba(255,255,255,.7)', fontSize: '2.4rem', lineHeight: 1, cursor: 'pointer' }}
          >
            ×
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={room.images[lightbox]}
            alt={`${room.name} — photo ${lightbox + 1}`}
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '92vw', maxHeight: '74vh', objectFit: 'contain', borderRadius: 10 }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: '1.25rem' }}>
            <button
              onClick={(e) => { e.stopPropagation(); setLightbox(v => v !== null ? (v - 1 + room.images!.length) % room.images!.length : v) }}
              aria-label="Photo précédente"
              style={{ background: 'none', border: '1px solid rgba(255,255,255,.25)', borderRadius: '50%', width: 44, height: 44, color: 'white', fontSize: '1.4rem', cursor: 'pointer' }}
            >
              ‹
            </button>
            <span style={{ color: 'rgba(255,255,255,.6)', fontSize: '0.8rem', fontFamily: 'monospace' }}>
              {lightbox + 1} / {room.images.length}
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); setLightbox(v => v !== null ? (v + 1) % room.images!.length : v) }}
              aria-label="Photo suivante"
              style={{ background: 'none', border: '1px solid rgba(255,255,255,.25)', borderRadius: '50%', width: 44, height: 44, color: 'white', fontSize: '1.4rem', cursor: 'pointer' }}
            >
              ›
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
