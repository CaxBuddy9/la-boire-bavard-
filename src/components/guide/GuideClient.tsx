'use client'

import { useState } from 'react'
import { LogoSVG } from '@/components/Logo'

type Lang = 'fr' | 'en' | 'es' | 'pt'

// ─── Toutes les traductions ───────────────────────────────────────────────────
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
  dinnerTag:     { fr: 'DÎNER EN COMMUN', en: 'SHARED DINING', es: 'CENA COMPARTIDA', pt: 'JANTAR PARTILHADO' },
  dinnerTitle:   { fr: 'Table d\'Hôtes', en: 'Host\'s Table', es: 'Mesa de Huéspedes', pt: 'Mesa de Hóspedes' },
  dinnerDesc:    { fr: 'Sandrine cuisine chaque soir un repas généreux autour de la grande table — légumes du potager, produits du terroir angevin, vins de Loire sélectionnés.', en: 'Sandrine cooks a generous dinner around the long table each evening — garden vegetables, Anjou terroir produce, selected Loire wines.', es: 'Sandrine cocina cada noche una cena generosa alrededor de la gran mesa — verduras del huerto, productos del terruño angevino, vinos del Loira seleccionados.', pt: 'A Sandrine cozinha todas as noites um jantar generoso à volta da mesa grande — legumes da horta, produtos do terroir angevino, vinhos do Loira selecionados.' },
  dinnerBook:    { fr: 'Réservation obligatoire avant 18h00', en: 'Reservation required before 6:00 PM', es: 'Reserva obligatoria antes de las 18:00', pt: 'Reserva obrigatória antes das 18h00' },
  dinnerPrice:   { fr: '25 € par personne', en: '25 € per person', es: '25 € por persona', pt: '25 € por pessoa' },
  dinnerSlots:   { fr: 'Choisissez votre heure', en: 'Select your time', es: 'Elija su hora', pt: 'Escolha a sua hora' },
  dinnerConfirm: { fr: 'Confirmer par WhatsApp', en: 'Confirm via WhatsApp', es: 'Confirmar por WhatsApp', pt: 'Confirmar via WhatsApp' },
  poolTag:       { fr: 'BIEN-ÊTRE & DÉTENTE', en: 'WELLNESS & RELAXATION', es: 'BIENESTAR & RELAJACIÓN', pt: 'BEM-ESTAR & RELAXAMENTO' },
  poolTitle:     { fr: 'Piscine & Spa', en: 'Pool & Spa', es: 'Piscina & Spa', pt: 'Piscina & Spa' },
  poolHours:     { fr: 'Ouverte de 9h à 21h', en: 'Open from 9 AM to 9 PM', es: 'Abierta de 9:00 a 21:00', pt: 'Aberta das 9h às 21h' },
  spaNote:       { fr: 'Spa & Sauna sur réservation', en: 'Spa & Sauna by reservation', es: 'Spa & Sauna con reserva', pt: 'Spa & Sauna mediante reserva' },
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

// ─── Données WiFi ─────────────────────────────────────────────────────────────
const WIFI_RESEAU   = 'LaBoireBavard'
const WIFI_PASSWORD = 'boire2024'

type RoomData = {
  name: string
  emoji: string
  bg: string
  details: { fr: string; en: string; es: string; pt: string }[]
}

const DINNER_SLOTS = ['19:00', '19:30', '20:00', '20:30']

const BREAKFAST_ITEMS = {
  fr: ['Confitures maison', 'Viennoiseries du four', 'Oeufs frais du jardin', 'Fromages d\'Anjou', 'Jus de fruits pressés', 'Café · Thé · Chocolat chaud'],
  en: ['Homemade jams', 'Freshly baked pastries', 'Fresh garden eggs', 'Anjou cheeses', 'Freshly pressed juice', 'Coffee · Tea · Hot chocolate'],
  es: ['Mermeladas caseras', 'Bollería recién horneada', 'Huevos frescos del huerto', 'Quesos de Anjou', 'Zumo recién exprimido', 'Café · Té · Chocolate caliente'],
  pt: ['Compotas caseiras', 'Pastelaria recém-feita', 'Ovos frescos do jardim', 'Queijos de Anjou', 'Sumo de fruta fresco', 'Café · Chá · Chocolate quente'],
}

export default function GuideClient({ room }: { room: RoomData }) {
  const [lang, setLang] = useState<Lang>('fr')
  const [selectedDiets, setSelectedDiets] = useState<number[]>([])
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)

  const t = (key: keyof typeof T) => (T[key] as Record<Lang, string>)[lang]

  const toggleDiet = (i: number) =>
    setSelectedDiets(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i])

  const LANGS: { code: Lang; label: string }[] = [
    { code: 'fr', label: 'FR' },
    { code: 'en', label: 'EN' },
    { code: 'es', label: 'ES' },
    { code: 'pt', label: 'PT' },
  ]

  return (
    <>
      {/* ── Styles responsives ── */}
      <style>{`
        .guide-wrap { max-width: 600px; margin: 0 auto; }
        .guide-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
        .guide-tips  { display: grid; grid-template-columns: 1fr; gap: 0.625rem; }
        @media (min-width: 768px) {
          .guide-wrap { max-width: 820px; }
          .guide-grid-2 { grid-template-columns: 1fr 1fr 1fr 1fr; }
          .guide-tips { grid-template-columns: 1fr 1fr; }
        }
        @media (min-width: 1024px) {
          .guide-wrap { max-width: 1000px; }
        }
        .diet-pill { cursor: pointer; transition: all .18s; }
        .diet-pill:hover { opacity: .85; }
        .slot-btn { cursor: pointer; transition: all .18s; }
        .slot-btn:hover { border-color: #c4a050 !important; }
      `}</style>

      <div style={{ background: '#f5f0e6', minHeight: '100vh', fontFamily: 'var(--font-raleway, Arial, sans-serif)', paddingBottom: '5rem' }}>

        {/* ══ TOPBAR ══════════════════════════════════════════════════════════ */}
        <div style={{ background: 'white', borderBottom: '1px solid #ece6da', position: 'sticky', top: 0, zIndex: 100 }}>
          <div className="guide-wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <LogoSVG height={36} />
              <div>
                <p style={{ fontSize: '0.65rem', color: '#c4a050', letterSpacing: '0.15em', textTransform: 'uppercase', margin: 0 }}>La Boire Bavard</p>
                <p style={{ fontSize: '0.82rem', fontWeight: 600, color: '#1a3320', margin: 0 }}>{room.name}</p>
              </div>
            </div>
            {/* Sélecteur de langue */}
            <div style={{ display: 'flex', gap: '0.3rem', background: '#f5f0e6', borderRadius: 20, padding: '0.25rem' }}>
              {LANGS.map(({ code, label }) => (
                <button
                  key={code}
                  onClick={() => setLang(code)}
                  style={{
                    background: lang === code ? '#1a3320' : 'transparent',
                    color: lang === code ? 'white' : '#888',
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

        {/* ══ CONTENU ══════════════════════════════════════════════════════════ */}
        <div className="guide-wrap" style={{ padding: '2rem 1.25rem 1rem' }}>

          {/* ── Intro éditoriale ── */}
          <p style={{ fontSize: '0.7rem', color: '#c4a050', letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 0.5rem' }}>
            {t('tag')}
          </p>
          <h1 style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: 'clamp(2rem, 6vw, 3rem)', fontWeight: 700, color: '#1a1a1a', margin: '0 0 2rem', lineHeight: 1.15 }}>
            {t('mainTitle')}
          </h1>

          {/* ── Hero chambre ── */}
          <div style={{
            background: `linear-gradient(160deg, ${room.bg} 0%, #0a1208 100%)`,
            borderRadius: 20, padding: '2.5rem 2rem', marginBottom: '1rem',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(196,160,80,0.08)', pointerEvents: 'none' }} />
            <p style={{ color: '#c4a050', fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 0.75rem' }}>
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

          {/* ── Mot de Sandrine ── */}
          <div style={{ background: 'white', borderRadius: 20, padding: '1.75rem 1.5rem', marginBottom: '1rem', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
            <p style={{ fontSize: '1.05rem', color: '#2a2a2a', lineHeight: 1.8, margin: 0, fontStyle: 'italic', fontFamily: 'var(--font-playfair, Georgia, serif)' }}>
              {t('sandrineNote')}
            </p>
            <p style={{ fontSize: '0.88rem', color: '#c4a050', fontWeight: 700, margin: '1rem 0 0', fontStyle: 'normal' }}>
              {t('sandrine')}
            </p>
          </div>

          {/* ── WiFi ── */}
          <div style={{ background: '#1a3320', borderRadius: 20, padding: '1.75rem 1.5rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <p style={{ color: '#c4a050', fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', margin: 0 }}>📶 {t('wifiTitle')}</p>
              <div style={{ width: 32, height: 32, background: 'rgba(255,255,255,0.08)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>✓</div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.07)', borderRadius: 14, padding: '1rem', textAlign: 'center' }}>
                <p style={{ color: '#8aaa7a', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 0.5rem' }}>{t('network')}</p>
                <p style={{ color: 'white', fontSize: '1rem', fontWeight: 700, fontFamily: 'monospace', margin: 0 }}>{WIFI_RESEAU}</p>
              </div>
              <div style={{ flex: 1, background: '#c4a050', borderRadius: 14, padding: '1rem', textAlign: 'center' }}>
                <p style={{ color: 'rgba(0,0,0,0.45)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 0.5rem' }}>{t('password')}</p>
                <p style={{ color: '#1a3320', fontSize: '1.25rem', fontWeight: 800, fontFamily: 'monospace', margin: 0, letterSpacing: '0.05em' }}>{WIFI_PASSWORD}</p>
              </div>
            </div>
          </div>

          {/* ── 4 infos clés ── */}
          <div className="guide-grid-2" style={{ marginBottom: '1rem' }}>
            {[
              { emoji: '🕐', label: t('checkin'), val: 'Dès 15h00' },
              { emoji: '🚪', label: t('checkout'), val: 'Avant 11h00' },
              { emoji: '☕', label: t('breakfastTime'), val: '7h30 – 10h00' },
              { emoji: '🍽️', label: t('tableLabel'), val: '25 € / pers.' },
            ].map(({ emoji, label, val }) => (
              <div key={label} style={{ background: 'white', borderRadius: 16, padding: '1.1rem 1rem', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', borderTop: `3px solid ${room.bg}` }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.35rem' }}>{emoji}</div>
                <p style={{ fontSize: '0.72rem', color: '#999', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 0.25rem' }}>{label}</p>
                <p style={{ fontSize: '0.92rem', fontWeight: 700, color: '#1a1a1a', margin: 0 }}>{val}</p>
              </div>
            ))}
          </div>

          {/* ─────────────────────────────────────────────────────────────── */}
          {/* ── Petit-déjeuner ── */}
          <div style={{ background: 'white', borderRadius: 20, overflow: 'hidden', marginBottom: '1rem', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
            {/* Photo hero */}
            <div style={{
              background: 'linear-gradient(145deg, #3d2008 0%, #1a0d04 100%)',
              padding: '2.5rem 1.75rem', position: 'relative', overflow: 'hidden',
            }}>
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
            {/* Items petit-dej */}
            <div style={{ padding: '1.25rem 1.5rem' }}>
              {(BREAKFAST_ITEMS[lang] as string[]).map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.7rem 0', borderBottom: i < 5 ? '1px solid #f0ece4' : 'none' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#c4a050', flexShrink: 0 }} />
                  <p style={{ fontSize: '0.98rem', color: '#2a2a2a', margin: 0, fontWeight: 500 }}>{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Préférences alimentaires ── */}
          <div style={{ background: 'white', borderRadius: 20, padding: '1.5rem', marginBottom: '1rem', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
            <p style={{ fontSize: '0.68rem', color: '#c4a050', letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 0.375rem' }}>
              {t('dietTag')}
            </p>
            <p style={{ fontSize: '0.9rem', color: '#666', lineHeight: 1.6, margin: '0 0 1.25rem' }}>
              {t('dietDesc')}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {(T.diets[lang] as string[]).map((d, i) => (
                <button
                  key={i}
                  className="diet-pill"
                  onClick={() => toggleDiet(i)}
                  style={{
                    background: selectedDiets.includes(i) ? '#1a3320' : '#f5f0e6',
                    color: selectedDiets.includes(i) ? 'white' : '#3a3a3a',
                    border: 'none', borderRadius: 20, padding: '0.5rem 1rem',
                    fontSize: '0.88rem', fontWeight: 600, fontFamily: 'inherit',
                    display: 'flex', alignItems: 'center', gap: '0.35rem',
                  }}
                >
                  {selectedDiets.includes(i) && <span style={{ fontSize: '0.75rem' }}>✓</span>}
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* ── Table d'hôtes ── */}
          <div style={{ background: 'white', borderRadius: 20, overflow: 'hidden', marginBottom: '1rem', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
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
            <div style={{ padding: '1.5rem' }}>
              <p style={{ fontSize: '0.72rem', color: '#999', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 0.875rem' }}>
                {t('dinnerSlots')}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
                {DINNER_SLOTS.map(slot => (
                  <button
                    key={slot}
                    className="slot-btn"
                    onClick={() => setSelectedSlot(slot)}
                    style={{
                      background: selectedSlot === slot ? '#1a3320' : '#f5f0e6',
                      color: selectedSlot === slot ? 'white' : '#333',
                      border: `2px solid ${selectedSlot === slot ? '#1a3320' : '#e0d8cc'}`,
                      borderRadius: 12, padding: '0.6rem 1.25rem',
                      fontSize: '1rem', fontWeight: 700, fontFamily: 'monospace',
                      cursor: 'pointer',
                    }}
                  >
                    {slot}
                  </button>
                ))}
              </div>
              <p style={{ fontSize: '0.82rem', color: '#e07050', fontWeight: 600, margin: '0 0 1rem' }}>
                ⚠ {t('dinnerBook')}
              </p>
              <a
                href={`https://wa.me/33675786335?text=${encodeURIComponent(selectedSlot ? `Bonjour Sandrine, je souhaite réserver la table d'hôtes pour ${selectedSlot}.` : 'Bonjour Sandrine, je souhaite réserver la table d\'hôtes.')}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'block', background: '#25D366', color: 'white', borderRadius: 14, padding: '1rem', textAlign: 'center', fontWeight: 700, fontSize: '1rem', textDecoration: 'none' }}
              >
                {t('dinnerConfirm')}
              </a>
            </div>
          </div>

          {/* ── Piscine & Spa ── */}
          <div style={{ background: 'white', borderRadius: 20, overflow: 'hidden', marginBottom: '1rem', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
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
            <div style={{ padding: '1.25rem 1.5rem' }}>
              {(T.poolRules[lang] as string[]).map((rule, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.875rem', padding: '0.6rem 0', borderBottom: i < 2 ? '1px solid #f0ece4' : 'none', alignItems: 'center' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#7dd4e0', flexShrink: 0 }} />
                  <p style={{ fontSize: '0.98rem', color: '#2a2a2a', margin: 0 }}>{rule}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Bons plans ── */}
          <div style={{ marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.68rem', color: '#c4a050', letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 0.5rem' }}>
              {t('tipsTag')}
            </p>
            <h2 style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: 'clamp(1.5rem, 4vw, 2rem)', color: '#1a1a1a', fontWeight: 700, margin: '0 0 1rem', lineHeight: 1.2 }}>
              {t('tipsTitle')}
            </h2>
            <div className="guide-tips">
              {(T.tips[lang] as { emoji: string; name: string; desc: string }[]).map(({ emoji, name, desc }) => (
                <div key={name} style={{ background: 'white', borderRadius: 16, padding: '1.1rem 1.25rem', display: 'flex', gap: '1rem', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                  <span style={{ fontSize: '2rem', flexShrink: 0 }}>{emoji}</span>
                  <div>
                    <p style={{ fontSize: '0.98rem', fontWeight: 700, color: '#1a3320', margin: 0 }}>{name}</p>
                    <p style={{ fontSize: '0.82rem', color: '#888', margin: '0.15rem 0 0' }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── La maison ── */}
          <div style={{ background: 'white', borderRadius: 20, overflow: 'hidden', marginBottom: '1rem', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ borderBottom: '1px solid #f0ece4', padding: '1.25rem 1.5rem' }}>
              <p style={{ fontSize: '0.68rem', color: '#c4a050', letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 0.25rem' }}>{t('rulesTag')}</p>
              <h2 style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: '1.4rem', color: '#1a1a1a', fontWeight: 700, margin: 0 }}>{t('rulesTitle')}</h2>
            </div>
            <div style={{ padding: '0.5rem 1.5rem 1.25rem' }}>
              {(T.rules[lang] as string[]).map((rule, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.875rem', padding: '0.65rem 0', borderBottom: i < 3 ? '1px solid #f0ece4' : 'none', alignItems: 'flex-start' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#c4a050', flexShrink: 0, marginTop: '0.45rem' }} />
                  <p style={{ fontSize: '0.98rem', color: '#2a2a2a', margin: 0, lineHeight: 1.5 }}>{rule}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Au revoir ── */}
          <div style={{ background: '#1a3320', borderRadius: 20, padding: '2.5rem 1.75rem', textAlign: 'center' }}>
            <p style={{ color: '#c4a050', fontSize: '0.68rem', letterSpacing: '0.22em', textTransform: 'uppercase', margin: '0 0 0.75rem' }}>{t('byeTag')}</p>
            <h2 style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: 'clamp(1.5rem, 4vw, 2rem)', color: 'white', fontWeight: 400, fontStyle: 'italic', margin: '0 0 1rem', lineHeight: 1.3 }}>
              {t('byeTitle')}
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', lineHeight: 1.75, margin: '0 0 1rem' }}>
              {t('byeDesc')}
            </p>
            <p style={{ color: '#7a9a6a', fontSize: '0.88rem', margin: 0 }}>{t('rating')} : ⭐ 9,9 / 10</p>
          </div>

        </div>

        {/* ══ BOTTOM NAV ══════════════════════════════════════════════════════ */}
        <div style={{
          position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
          width: '100%', maxWidth: 600,
          background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(12px)',
          borderTop: '1px solid #ece6da',
          display: 'flex',
          padding: '0 0 env(safe-area-inset-bottom)',
        }}>
          {[
            { href: '/', icon: '🏠', label: t('navHome') },
            { href: '#top', icon: '📖', label: t('navGuide'), active: true },
            { href: 'tel:+33675786335', icon: '📞', label: t('navCall') },
            { href: 'https://wa.me/33675786335', icon: '💬', label: t('navChat') },
          ].map(({ href, icon, label, active }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
              style={{
                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                padding: '0.75rem 0.25rem 0.875rem',
                textDecoration: 'none',
                color: active ? '#1a3320' : '#999',
                fontSize: '0.65rem', fontWeight: active ? 700 : 500,
                letterSpacing: '0.05em', textTransform: 'uppercase',
                gap: '0.25rem',
                borderTop: active ? `3px solid #c4a050` : '3px solid transparent',
              }}
            >
              <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>{icon}</span>
              {label}
            </a>
          ))}
        </div>

      </div>
    </>
  )
}
