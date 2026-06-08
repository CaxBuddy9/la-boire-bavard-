// ─── Carte Boissons & Snacks ────────────────────────────────────────────────
// Source unique partagée par le livret numérique (/guide/[chambre])
// et la carte imprimable (/guide/carte).
// Pour mettre à jour les prix ou les articles, modifiez UNIQUEMENT ce fichier :
// les deux versions (écran + papier) seront actualisées automatiquement.

export type MenuLang = 'fr' | 'en' | 'es' | 'pt'
export type MenuItem = { name: Record<MenuLang, string>; price: string }
export type MenuSection = { emoji: string; cat: Record<MenuLang, string>; items: MenuItem[] }

export const MENU: MenuSection[] = [
  {
    emoji: '🥂',
    cat: { fr: 'Boissons', en: 'Drinks', es: 'Bebidas', pt: 'Bebidas' },
    items: [
      { name: { fr: 'Café · Thé · Infusion', en: 'Coffee · Tea · Herbal tea', es: 'Café · Té · Infusión', pt: 'Café · Chá · Infusão' }, price: '2 €' },
      { name: { fr: 'Canette — soda · jus de fruits', en: 'Can — soda · fruit juice', es: 'Lata — refresco · zumo', pt: 'Lata — refrigerante · sumo' }, price: '3 €' },
      { name: { fr: 'Bière artisanale', en: 'Craft beer', es: 'Cerveza artesanal', pt: 'Cerveja artesanal' }, price: '3,50 €' },
      { name: { fr: 'Bière en canette', en: 'Canned beer', es: 'Cerveza en lata', pt: 'Cerveja em lata' }, price: '3 €' },
      { name: { fr: 'Verre de vin de Loire', en: 'Glass of Loire wine', es: 'Copa de vino del Loira', pt: 'Copo de vinho do Loire' }, price: '4 €' },
    ],
  },
  {
    emoji: '🧀',
    cat: { fr: 'Planches', en: 'Boards', es: 'Tablas', pt: 'Tábuas' },
    items: [
      { name: { fr: 'Planche apéritive pour 2 — charcuterie & fromages d\'Anjou, 1 verre de vin chacun', en: 'Aperitif board for 2 — Anjou cured meats & cheeses, a glass of wine each', es: 'Tabla de aperitivo para 2 — embutidos y quesos de Anjou, una copa de vino cada uno', pt: 'Tábua de aperitivo para 2 — enchidos e queijos de Anjou, um copo de vinho cada' }, price: '24 €' },
    ],
  },
]
