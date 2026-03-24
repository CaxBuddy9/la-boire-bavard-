# CLAUDE.md — La Boire Bavard

## Rôle
Tu es l'assistant développeur du site web de **La Boire Bavard**, une maison d'hôtes en Anjou.
Le site est une **application Next.js 16 (App Router)** avec React 19, TypeScript et Tailwind CSS v4.
Tu travailles exclusivement dans `src/app/` et `src/components/`.
**L'ancien index.html vanilla est obsolète — ne jamais y toucher ni s'en inspirer pour le code.**

---

## L'établissement

| Champ | Valeur |
|-------|--------|
| Nom | La Boire Bavard |
| Propriétaire | **Sandrine** (ne jamais écrire Maryline) |
| Adresse | 4 chemin de la Boire Bavard, Lieu-dit La Hutte, 49320 Blaison-Saint-Sulpice |
| Téléphone | 06 75 78 63 35 |
| Email | laboirebavard@gmail.com |
| WhatsApp | https://wa.me/33675786335 |
| Note Booking | 9.9/10 — Exceptionnel |
| Tarif | 88 €/nuit petit-déjeuner inclus |
| Table d'hôtes | 25 €/pers. sur réservation |

### 4 Chambres
| Slug | Nom | Capacité | Caractère |
|------|-----|----------|-----------|
| `jardin` | Côté Jardin | 1–4 pers. | Cheminée, terrasse directe |
| `cedre` | Côté Cèdre | 1–2 pers. | Romantique, accès piscine direct |
| `vallee` | Côté Vallée | 1–4 pers. | Vue Loire, escalier privé |
| `potager` | Côté Potager | 1–2 pers. | Calme absolu, SdB séparée |

---

## Architecture Next.js (App Router)

```
src/
  app/
    layout.tsx              ← Root layout : Nav + Footer + WhatsAppFloat + MeteoWidget
    page.tsx                ← Accueil
    chambres/
      page.tsx              ← Listing 4 chambres
      [slug]/page.tsx       ← Détail chambre (jardin | cedre | vallee | potager)
    bienetre/page.tsx       ← Piscine, spa, sauna, nature, saisons
    petitdej/page.tsx       ← Petit-déjeuner + table d'hôtes
    avis/page.tsx           ← Avis 9.9/10 + témoignages
    contact/page.tsx        ← Formulaire + accès + carte
    paiement/page.tsx       ← Récapitulatif + paiement Stripe
    propriete/page.tsx      ← Histoire + galerie + localisation
    mentions-legales/page.tsx
  components/
    sections/
      Nav.tsx               ← Navbar fixe globale (use client)
      Footer.tsx            ← Footer unifié global
    BookingCard.tsx         ← Carte réservation sticky (use client)
    DateRangePicker.tsx     ← Calendrier custom (use client)
    RoomPicker.tsx          ← Select chambre custom (use client)
    Logo.tsx                ← LogoSVG + LogoWatermark
    MeteoWidget.tsx         ← Open-Meteo temps réel (use client)
    WhatsAppFloat.tsx       ← Bouton flottant WhatsApp
    TourismLogos.tsx        ← Logos partenaires SVG
  context/
    LangContext.tsx         ← FR/EN toggle (use client, localStorage)
  lib/
    rooms.ts                ← Données des 4 chambres
    stripe.ts               ← Config Stripe server-side
    supabase.ts             ← Config Supabase client
```

### Pages et leur police titre (respecter BRANDING.md)
| Page | Police titre | Fond dominant |
|------|-------------|---------------|
| Accueil | Playfair Display | `#1a2e1a` vert foncé |
| Chambres | DM Serif Display | `#f5f0e8` crème |
| Bien-être | Libre Baskerville | `#1e3320` vert forêt |
| Petit-déjeuner | Lora | terracotta `#c4603a` |
| Avis | EB Garamond | `#f5f0e8` blanc épuré |
| Contact | Cormorant Garamond | `#2a3540` ardoise |
| Chambres (détail) | Playfair Display + Raleway | `#0e130e` vert nuit |
| Paiement | Raleway | `#0e1510` sombre |

---

## Règles de développement (OBLIGATOIRES)

1. **Jamais de HTML brut** — pas de `dangerouslySetInnerHTML`, pas de `<style>` global inline, pas de `<script>` vanilla
2. **Server Components par défaut** — `"use client"` uniquement pour : Nav, modals, formulaires avec état, calendrier, MeteoWidget
3. **Ne jamais écrire Maryline** — c'est Sandrine
4. **Ne jamais dupliquer le footer** — il est dans `layout.tsx`, pas dans les pages
5. **Toujours exporter `metadata`** sur chaque page (title, description, og:image)
6. **Couleur gold** = `#c4a050` (nav/accent) | `#b89a5a` (pages claires) | `#b8922a` (logo SVG uniquement)
7. **Police par page** — respecter le tableau ci-dessus, ne pas mélanger les familles
8. **next/image** pour toutes les photos (jamais `<img>` direct)
9. **next/link** pour tous les liens internes (jamais `<a href="/">`)
10. **Données chambres** → toujours lire depuis `src/lib/rooms.ts`, ne pas hardcoder

---

## Navbar (`src/components/sections/Nav.tsx`)

- `"use client"` — gère scroll + menu burger mobile + langue FR/EN
- Fond fixe : `rgba(20,28,22,.88)` + `backdrop-filter: blur(14px)` → `rgba(14,20,15,.97)` au scroll
- Logo : `<LogoSVG height={52} />` + "La Boire Bavard" (Playfair) + "Chambres d'Hôtes · Anjou" (Raleway or)
- Liens actifs : `#c4a050` via `usePathname()`
- CTA "Réserver" : border `#c4a050` → hover bg `#c4a050`
- Liens de nav actuels : Accueil · La propriété · Chambres · Bien-être · Petit-déjeuner · Avis · Contact & Accès

---

## Footer (`src/components/sections/Footer.tsx`)

- Server Component — dans `layout.tsx` (donc présent sur toutes les pages automatiquement)
- Fond : `#0d110e`
- Contenu : logo texte · tagline · ligne or · nav links · logos partenaires · contact links · copyright
- **Règle absolue** : ne jamais remettre un footer dans une page individuelle

---

## Système FR/EN (`src/context/LangContext.tsx`)

```tsx
// Hook dans un composant client
const { lang, setLang } = useLang()
const t = useT()

// Utilisation
<h1>{t('Bienvenue', 'Welcome')}</h1>
```

- `useLang()` → `{ lang: 'fr'|'en', setLang }`
- `useT()` → `(fr: string, en: string) => string`
- Persisté dans `localStorage`

---

## Tunnel de réservation

**Flux Next.js :**
1. `/chambres/[slug]` → `BookingCard` (sticky sidebar) → `DateRangePicker` + nb personnes
2. Bouton "Réserver" → `router.push('/paiement?chambre=jardin&arrive=...&depart=...&nuits=2&pers=2')`
3. `/paiement` lit `useSearchParams()` → affiche récap + formulaire carte
4. `processPayment()` → **TODO : Stripe PaymentIntent** (clé `STRIPE_SECRET_KEY` dans `.env.local`)

---

## Formulaire Contact (`/contact`)

**Champs :** Prénom* · Nom* · Email* · Téléphone · Arrivée · Départ · Nb personnes · Chambre (RoomPicker) · Message

**Soumission :**
- **TODO : brancher Formspree** → `fetch('https://formspree.io/f/XXXXX', { method:'POST', body: formData })`
- En attendant : simulation avec `setTimeout`

---

## Ce qu'il reste à faire

### 🔴 Prioritaire
- [ ] **Stripe** : créer route API `/api/checkout` → PaymentIntent + brancher `/paiement`
- [ ] **Formspree** : remplacer simulation contact par vrai `fetch` POST
- [ ] **Photos réelles** : remplacer `/photos/photo*.jpg` par les vraies photos de Sandrine

### 🟡 Améliorations
- [ ] Ajouter "Bien-être" dans les liens Nav + Footer
- [ ] Couverture FR/EN plus complète (descriptions longues des chambres)
- [ ] Google Maps : vraies coordonnées GPS (lat 47.368, lon -0.511)
- [ ] Page propriété : compléter galerie

### 🟢 Optionnel
- [ ] Galerie lightbox (composant LightboxModal)
- [ ] Framer-motion pour transitions de pages
- [ ] Supabase : table `reservations` + gestion disponibilités

---

## Stack technique

| Outil | Version | Usage |
|-------|---------|-------|
| Next.js | 16.2.1 | Framework App Router |
| React | 19 | UI |
| TypeScript | 5 | Types |
| Tailwind CSS | v4 | Styles |
| next/font | — | Google Fonts (Playfair, Raleway, etc.) |
| Stripe.js + stripe | latest | Paiement — **à brancher** |
| Supabase | latest | BDD réservations — **à brancher** |
| Open-Meteo API | — | Météo (lat:47.368, lon:-0.511), sans clé |
| Vercel | — | Hébergement + déploiement auto depuis GitHub |

---

## Déploiement (Vercel)

- **Repo GitHub** : `https://github.com/CaxBuddy9/la-boire-bavard-`
- Push sur `master` → déploiement automatique Vercel
- Variables d'environnement à ajouter dans Vercel Dashboard :
  - `STRIPE_SECRET_KEY`
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## Migration HTML → Next.js (NOUVELLES RÈGLES)

- Ce projet est maintenant une vraie app **Next.js 16.2.1** (App Router) avec React 19, TypeScript et Tailwind CSS v4.
- Tu travailles exclusivement dans le dossier `src/app/` (et `src/components/`).
- N'utilise **JAMAIS** de HTML brut, de `dangerouslySetInnerHTML`, ni de grands blocs `<style>` ou `<script>` comme dans l'ancien `index.html`.
- Convertis tout en **composants React Server Components** par défaut. Utilise `"use client"` uniquement pour l'interactivité (nav, modals, formulaires avec état, calendrier, etc.).
- Respecte à 100% le branding de `BRANDING.md` (couleurs exactes, polices par page, tone of voice, logo SVG, etc.).
- Utilise les couleurs définies dans `tailwind.config.ts` (`gold`, `cream`, `forest-dark`, etc.).
- Charge les polices avec `next/font` (Playfair Display, Raleway, DM Serif Display, Libre Baskerville, Lora, EB Garamond, Cormorant Garamond, Montserrat).
- Toutes les pages doivent être des Server Components avec metadata SEO correcte.
- Le site doit rester une SPA-like avec navigation fluide (utilise `next/navigation` → `useRouter` ou `Link`).

### Plan de reconstruction (5 étapes)

| Étape | Action | Statut |
|-------|--------|--------|
| 1 | Mettre à jour les dépendances React 19 + Next.js 16.2.1 | ⬜ |
| 2 | Supprimer `index.html` racine + nettoyage | ⬜ |
| 3 | Compléter pages manquantes + Nav (ajouter Bien-être) | 🔄 |
| 4 | Brancher Stripe (route API `/api/checkout`) | ⬜ |
| 5 | Brancher Formspree + vraies photos | ⬜ |
