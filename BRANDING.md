# BRANDING — La Boire Bavard

> Chambres d'Hôtes de charme · Anjou · Blaison-Saint-Sulpice

---

## 1. Logo

**Fichier :** `logo.svg`

Le logo est un monogramme **BB** stylisé composé de trois éléments superposés :

- **Les deux B** — tracés en or ancien (#b8922a), formés de deux hampes verticales avec des courbes latérales qui évoquent le double B de "Boire Bavard"
- **Le calice** — descend depuis la jonction des deux lettres, rappelant la vigne et le vin (hommage à l'Anjou viticole)
- **Les vignes** — branches et feuilles vertes qui s'enroulent autour du calice, symbolisant le jardin, la nature et l'Anjou

### Variantes logo
| Variante | Usage |
|----------|-------|
| Monogramme seul (`logo.svg`) | Favicon, réseaux sociaux, tampon |
| Monogramme + "La Boire Bavard" + "Chambres d'Hôtes · Anjou" | Navigation site, papier à en-tête |

### Zone de protection
Prévoir un espace vide autour du logo équivalent à **la largeur du calice** (~20px à taille normale).

---

## 2. Palette de couleurs

### Couleurs primaires
| Nom | HEX | Usage |
|-----|-----|-------|
| **Or Anjou** | `#c4a050` | Navigation, accents, hover, bordures actives |
| **Or Terre** | `#b89a5a` | Accents sur fonds clairs (pages intérieures) |
| **Or Logo** | `#b8922a` | Logo SVG uniquement |
| **Or Logo Dark** | `#d4ac3a` | Logo SVG en dark mode |

### Couleurs de fond
| Nom | HEX | Usage |
|-----|-----|-------|
| **Vert Nuit** | `#0e130e` | Fond principal pages chambre (.rd-left) |
| **Vert Forêt** | `#141c14` | Fond secondaire (.rd-right), body global |
| **Vert Abyssal** | `#0a0e0a` | Barre onglets, éléments les plus sombres |
| **Vert Galerie** | `#080c08` | Fond galerie filmstrip |
| **Noir Footer** | `#0d110e` | Footer du site |
| **Nav fond** | `rgba(20,28,22,.88)` | Navbar fixe (avec blur) |

### Couleurs de texte
| Nom | HEX / valeur | Usage |
|-----|-------------|-------|
| **Crème principal** | `#f4eedf` | Titres h1, prix, éléments forts |
| **Crème nav** | `#f4f0e6` | Nom dans la nav |
| **Crème corps** | `rgba(240,235,225,.65)` | Corps de texte courant |
| **Crème atténué** | `rgba(240,235,225,.45)` | Textes secondaires, unités |
| **Or texte** | `rgba(196,160,80,.7–.8)` | Labels, étiquettes, tags |

### Couleurs accent (pages spécifiques)
| Page | Couleur dominante | HEX |
|------|-------------------|-----|
| Accueil | Vert foncé | `#1a2e1a` |
| Bien-être | Vert forêt | `#1e3320` |
| Petit-déjeuner | Terracotta | `#c4603a` |
| Avis | Blanc épuré | `#f5f0e8` |
| Contact | Ardoise | `#2a3540` |

---

## 3. Typographie

La typographie varie **par page** pour renforcer l'identité de chaque univers. C'est une règle fondamentale du branding.

### Police Globale (Nav + Boutons + Labels)
- **Raleway** — sans-serif géométrique, utilisé pour tous les éléments d'interface
  - Navigation : `0.62rem`, `letter-spacing: .18em`, uppercase
  - Boutons CTA : `0.72rem`, `letter-spacing: .3em`, uppercase
  - Labels section : `0.58rem`, `letter-spacing: .42em`, uppercase

### Polices par page
| Page | Police titre | Famille | Caractère |
|------|-------------|---------|-----------|
| **Accueil** | Playfair Display | Serif | Élégance classique, grand format |
| **Chambres** | DM Serif Display | Serif | Contemporain, lisible, haut de gamme |
| **Bien-être** | Libre Baskerville | Serif | Chaleureux, nature, organique |
| **Petit-déjeuner** | Lora | Serif | Doux, convivial, gourmand |
| **Avis** | EB Garamond | Serif | Historique, citations, témoignages |
| **Contact** | Cormorant Garamond | Serif | Raffiné, formulaire haut de gamme |
| **Chambres (détail)** | Playfair Display + Raleway | Serif + Sans | Titres serif, corps sans |
| **Interface générale** | Montserrat | Sans-serif | Éléments secondaires, formulaires |

### Hiérarchie typographique type
```
h1 hero        → Playfair Display, 4–5rem, font-weight: 400, color: #f4eedf
label section  → Raleway, 0.58rem, letter-spacing: .42em, uppercase, color: or atténué
corps texte    → Raleway, 0.95rem, line-height: 1.9, color: crème 65%
tag / badge    → Raleway, 0.65rem, letter-spacing: .2em, uppercase, border or
prix           → Playfair Display, 2rem, color: #f4eedf
```

---

## 4. Composants UI

### Boutons
```
CTA principal  → background: #c4a050 · color: #0e130e · padding: 16px 36px
                 font: Raleway 0.72rem uppercase · hover: #b89a5a

CTA ghost      → border: 1px solid rgba(196,160,80,.4) · color: or atténué
                 hover: border + couleur → #c4a050

Nav CTA        → border: 1px solid #c4a050 · color: #c4a050
                 hover: background #c4a050 · color: #111
```

### Tags / Badges
```
border: 1px solid rgba(196,160,80,.3)
color: rgba(196,160,80,.8)
font: Raleway 0.65rem uppercase letter-spacing .2em
padding: 6px 14px
background: transparent
```

### Cards chambre (page listing)
```
Layout alterné gauche/droite (image | texte)
Image: object-fit cover, hauteur fixe
Fond texte: #f5f0e8 (crème) ou vert foncé selon thème
Accent: ligne or #c4a050 (2px, largeur 40px)
```

### Onglets chambre
```
Fond: #0a0e0a
Bordure bas active: 2px solid #c4a050
Couleur active: #c4a050 · background: rgba(196,160,80,.05)
Couleur inactive: rgba(240,235,225,.45)
Font: Raleway 0.62rem uppercase letter-spacing .3em
Numéro: 0.5rem, color: rgba(196,160,80,.4)
```

### Galerie filmstrip
```
Fond: #080c08
Items alternés: hauteur 420px/380px · largeur 300px/520px
Hover: zoom scale(1.05) + overlay sombre + icône "+" or
Scroll: horizontal, drag-to-scroll souris, scroll-snap
```

---

## 5. Iconographie & illustrations

- **Émojis** utilisés comme icônes fonctionnelles dans les listes équipements
  - 📺 TV · 📶 WiFi · 🚿 Douche · 🛁 Baignoire · 🌿 Jardin · ☕ Petit-déj · 🏊 Piscine
- **Trait décoratif** : ligne horizontale fine `rgba(196,160,80,.3)` de 40px avant les titres de section
- **Séparateur section** : `border-top: 1px solid rgba(196,160,80,.15)` ou `.3`

---

## 6. Photographie (guidelines pour Sandrine)

Les photos de remplacement actuelles sont issues d'Unsplash. Les vraies photos doivent respecter :

| Critère | Recommandation |
|---------|----------------|
| **Ambiance** | Lumière naturelle, dorée, heure magique |
| **Couleurs** | Tons chauds (pierre, bois, verdure), pas de blanc clinique |
| **Format** | Paysage 16:9 pour les héros · Carré ou portrait pour les galeries |
| **Résolution** | 2400px min côté long pour le web |
| **Sujets prioritaires** | Lit fait, terrasse, piscine, petit-déj dressé, jardin, cheminée |
| **À éviter** | Flash direct, retouche excessive, filtres Instagram |

### Nommage fichiers photos
```
chambre-jardin-01.jpg, chambre-jardin-02.jpg ...
chambre-cedre-01.jpg ...
piscine-01.jpg
petitdej-01.jpg
jardin-01.jpg
hero-accueil.jpg
```

---

## 7. Tone of voice

| Registre | Oui | Non |
|----------|-----|-----|
| **Langue** | Français soigné, chaleureux | Familier, argot |
| **Ton** | Doux, poétique, précis | Vendeur, promotionnel |
| **Ponctuation** | Tirets cadratins —, points médians · | !!! exclamations |
| **Chiffres** | 88 €/nuit, 9.9/10, 25 €/pers. | "pas cher", "offre" |
| **Adjectifs** | Authentique, généreux, intime, rare | "luxueux", "parfait" |

---

## 8. Identité en ligne

| Canal | Handle / URL |
|-------|-------------|
| Email | laboirebavard@gmail.com |
| WhatsApp | wa.me/33675786335 |
| Booking | Note 9.9/10 — Exceptionnel |
| Hébergement | Netlify (index.html drop) |

---

## 9. À créer (roadmap branding)

- [ ] **Logo couleur crème** — version fond sombre pour impressions
- [ ] **Logo noir** — version print, tampon, broderie
- [ ] **Favicon 32×32** — version simplifiée du monogramme BB
- [ ] **Og:image** — visuel 1200×630 pour partage réseaux sociaux
- [ ] **Papier à en-tête** — PDF A4 pour confirmations de réservation
- [ ] **Carte de visite** — recto : logo + coordonnées · verso : photo
