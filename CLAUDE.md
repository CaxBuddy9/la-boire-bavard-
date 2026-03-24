# CLAUDE.md — La Boire Bavard

## Rôle
Tu es l'assistant développeur du site web de **La Boire Bavard**, une maison d'hôtes en Anjou. Le site est un SPA (Single Page Application) en un seul fichier HTML vanilla. Tu travailles directement sur `index.html`.

---

## L'établissement

| Champ | Valeur |
|-------|--------|
| Nom | La Boire Bavard |
| Propriétaire | **Sandrine** (ne jamais écrire Maryline) |
| Adresse | 4 chemin de la Boire Bavard, 49320 Blaison-Saint-Sulpice |
| Téléphone | 06 75 78 63 35 |
| Email | laboirebavard@gmail.com |
| WhatsApp | https://wa.me/33675786335 |
| Note Booking | 9.9/10 — Exceptionnel |
| Tarif | 88€/nuit petit-déjeuner inclus |
| Table d'hôtes | 25€/pers. sur réservation |

### 4 Chambres
| ID | Nom | Capacité | Caractère |
|----|-----|----------|-----------|
| `jardin` | Côté Jardin | 1–4 pers. | Cheminée, terrasse directe |
| `cedre` | Côté Cèdre | 1–2 pers. | Romantique, accès piscine direct |
| `vallee` | Côté Vallée | 1–4 pers. | Vue Loire, escalier privé |
| `potager` | Côté Potager | 1–2 pers. | Calme absolu, SdB séparée |

---

## Architecture du fichier

### Pages SPA
```
showPage(id)  →  affiche #p-{id}, masque les autres
```

| ID page | Contenu | Style |
|---------|---------|-------|
| `index` | Hero, intro, chambres teaser, quote, previews | Playfair / Raleway, vert foncé |
| `chambres` | 4 chambres en layout alterné | DM Serif Display, noir & crème |
| `bienetre` | Piscine, spa, sauna, nature, saisons | Libre Baskerville, vert forêt |
| `petitdej` | Petit-déjeuner, produits, table d'hôtes | Lora, terracotta |
| `avis` | Score 9.9, témoignages masonry, chiffres | EB Garamond, blanc épuré |
| `contact` | Info + formulaire 2 colonnes + map | Cormorant/Montserrat, ardoise |
| `jardin` | Page détail chambre + réservation | Raleway |
| `cedre` | Page détail chambre + réservation | Raleway |
| `vallee` | Page détail chambre + réservation | Raleway |
| `potager` | Page détail chambre + réservation | Raleway |
| `paiement` | Récapitulatif + formulaire carte | Raleway, fond sombre |

### allPages (obligatoire dans showPage)
```js
var allPages = ['index','chambres','bienetre','petitdej','avis','contact',
                'jardin','cedre','vallee','potager','paiement'];
```

---

## NAV globale (`#gnav`)

```html
<nav id="gnav">
  <!-- Logo SVG BB inline -->
  <!-- Nav links avec data-page + data-fr + data-en -->
  <!-- Switch langue : btn-fr / btn-en -->
  <!-- Bouton Réserver -->
  <!-- Burger mobile -->
</nav>
```

**CSS clés :**
- Fond fixe : `rgba(20,28,22,.88)` + `backdrop-filter:blur(14px)`
- Liens : `color:rgba(240,235,225,.75)` → hover/active : `#c4a050`
- `.scrolled` : padding réduit au scroll

---

## Footer unifié (`.site-footer`)

Identique sur **toutes** les pages. Structure :
```html
<div class="site-footer">
  <div class="sf-name">La Boire Bavard</div>
  <div class="sf-tagline">Chambres d'Hôtes · Anjou</div>
  <div class="sf-line"></div>
  <nav class="sf-nav">
    <!-- 6 liens showPage -->
  </nav>
  <div class="sf-contact">
    <a href="tel:0675786335" class="sf-a">📞 06 75 78 63 35</a>
    <span class="sf-dot">·</span>
    <a href="mailto:laboirebavard@gmail.com" class="sf-a">✉ laboirebavard@gmail.com</a>
    <span class="sf-dot">·</span>
    <a href="https://wa.me/33675786335" target="_blank" class="sf-wa">💬 WhatsApp</a>
  </div>
  <p class="sf-copy">© 2026 La Boire Bavard · 4 chemin de la Boire Bavard, 49320 Blaison-Saint-Sulpice</p>
</div>
```

**Règle absolue :** le footer doit toujours être **en dehors** des grilles/layouts internes (ex: page contact a un `.ct-main` en 2 colonnes — le footer vient APRÈS).

---

## Système de traduction FR/EN

```js
// Boutons dans la nav
<button id="btn-fr" onclick="setLang('fr')">FR</button>
<button id="btn-en" onclick="setLang('en')">EN</button>

// Sur les éléments traduisibles
<a data-fr="Accueil" data-en="Home">Accueil</a>

// Fonction
function setLang(l) { ... walkText(document.body, dict) ... }
```

**Pour ajouter une traduction :** ajouter l'entrée dans `var D = { 'FR': 'EN' }` ET ajouter `data-fr`/`data-en` sur l'élément HTML si c'est un nœud avec attributs, sinon `walkText` le captera automatiquement via les text nodes.

---

## Tunnel de réservation (pages chambre détail)

**Flux :**
1. `showPage('jardin')` → page détail avec formulaire
2. Calendrier custom : `openCal(id, 'in'/'out')` → `selectDay()` → `calcCR(id, 88)`
3. Validation : `goToPayment(id, prix, nom, img)` → vérifie champs → `showPage('paiement')`
4. Page paiement : `processPayment()` → simulation (Stripe à brancher)

**IDs des champs (pattern) :**
```
in-{id}        date arrivée (hidden)
out-{id}       date départ (hidden)
disp-{id}-in   date arrivée affichée
disp-{id}-out  date départ affichée
pers-{id}      nombre personnes
nom-{id}       nom du client
email-{id}     email
tel-{id}       téléphone
```

**Validation erreurs :**
```js
showFieldError('field-id', 'Message')  // bordure rouge + message
clearFieldError('field-id')            // reset
```

---

## Formulaire Contact (`#p-contact`)

**Champs :**
- Arrivée / Départ (type date)
- Adultes (select, obligatoire) / Enfants (select)
- Chambre : menu custom `.csel-wrap` avec `toggleCsel()` / `pickCsel()`
- Nom*, Prénom*, Email*, Téléphone*
- Message (textarea)

**Validation :** `submitContactForm()` → `cfError(id, msg)` / `cfClear(id)` → `mailto:` pré-rempli

---

## Ce qu'il reste à faire

### 🔴 Prioritaire
- [ ] **Stripe** : remplacer `processPayment()` simulation par vrai Stripe.js
  ```js
  // Quand la clé pk_live_... est dispo :
  const stripe = Stripe('pk_live_...');
  // Créer PaymentIntent côté serveur ou utiliser Stripe Checkout
  ```
- [ ] **Formspree** : remplacer `mailto:` du formulaire contact par fetch POST
  ```js
  fetch('https://formspree.io/f/XXXXX', { method:'POST', body: formData })
  ```
- [ ] **Photos réelles** : remplacer toutes les URLs Unsplash par les vraies photos de Sandrine

### 🟡 Améliorations
- [ ] Switch FR/EN : couvrir plus de textes (descriptions longues des chambres)
- [ ] Mobile : tester et corriger les pages détail chambre sur petit écran
- [ ] Google Maps : mettre les vraies coordonnées GPS dans l'iframe
- [ ] SEO : meta description, og:image, og:title

### 🟢 Optionnel / Idées
- [ ] Galerie lightbox sur les pages chambre (clic photo = plein écran)
- [ ] Disponibilités visuelles (calendrier global sur la page d'accueil)
- [ ] Section "Offres spéciales" (pack romantique, séjour 3 nuits = 1 offerte)
- [ ] Bouton WhatsApp flottant sur toutes les pages

---

## Règles de développement

1. **Ne jamais dupliquer le footer** — un seul `.site-footer` par page, toujours en dehors des grilles
2. **Ne jamais écrire Maryline** — c'est Sandrine
3. **Toujours mettre à jour `allPages`** si une nouvelle page est ajoutée
4. **Couleur gold** = `#c4a050` (nav) ou `#b89a5a` (pages claires)
5. **Police principale** selon la page — ne pas mélanger les familles entre pages
6. **Tester showPage('contact')** après chaque modif du formulaire
7. **Le footer de contact** doit être APRÈS `</div><!-- fin ct-main -->` pas dedans

---

## Stack technique

| Outil | Usage |
|-------|-------|
| HTML/CSS/JS vanilla | Tout le site |
| Google Fonts | Playfair Display, Raleway, DM Serif, Lora, EB Garamond, Cormorant, Montserrat |
| Open-Meteo API | Météo temps réel (lat:47.368, lon:-0.511) — gratuit, sans clé |
| Stripe.js | Paiement carte — **à brancher** |
| Formspree | Formulaire contact — **à brancher** |
| Netlify | Hébergement (déposer index.html dans le dossier) |

---

## Mise en ligne (Netlify)

1. Renommer `site_final.html` → `index.html`
2. Glisser le fichier sur app.netlify.com/drop
3. Domaine actuel chez Wix → mettre à jour les DNS vers Netlify
4. HTTPS activé automatiquement par Netlify

