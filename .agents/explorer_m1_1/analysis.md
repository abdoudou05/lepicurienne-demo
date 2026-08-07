# Implementation Strategy Report: Milestone 1 — Product Lineup & Detail Integration

**Agent**: Explorer M1 (Implementation Strategy Specialist for Product Lineup & Detail Integration)  
**Date**: 2026-08-07  
**Project**: L'Épicurienne By Waycha (`lepicurienne-demo`)  
**Target Files**: `client/src/pages/Home.tsx`, `client/src/components/ui/dialog.tsx`, `client/src/components/ui/drawer.tsx`, `client/src/components/ui/badge.tsx`

---

## 1. Executive Summary & Mission Scope

The goal of **Milestone 1** is to elevate the product presentation of **L'Épicurienne By Waycha** from static, incomplete placeholder entries to a rich, authentic luxury food & beverage showcase.

### Key Objectives:
1. **5 Authentic Products**: Complete data representation in both French (`fr`) and English (`en`) for:
   - **Gingembre** ($12, 1L) — Piquant, pur, anti-nausée & digestif.
   - **Bouye Fraise** ($12, 1L) — Baobab & Fraise, style smoothie, Vit C & antioxydants.
   - **Maad** ($15, 1L) — Trésor sauvage d'Afrique de l'Ouest (Saba senegalensis), riche en Vit C, B6, B3, Ca, Mg.
   - **Diabolo Menthe** ($12, 1L) — Onctueux menthe fraîche & lait, saveur crème glacée.
   - **Bouye (Plain Baobab)** ($12, 1L) — Pain de singe 100% naturel, riche en fibres (replacing `bouye-passion`).
2. **Card Visual Enhancements**: Floating price tags (`$12` / `$15`), volume badges (`1L`), and interactive health benefit pills on product cards.
3. **Responsive Modal / Drawer Architecture**: Desktop `Dialog` modal and Mobile `Drawer` bottom-sheet triggered on card or benefit pill click, displaying complete culinary origin stories, ingredients list, health benefits breakdown, and order call-to-action (CTA).

---

## 2. TypeScript Data Model Extension (`JuiceItem`)

To support rich authentic metadata, health benefits, and modal detail views, the existing minimalistic juice item interface must be extended.

### 2.1 Interface Definition (`client/src/pages/Home.tsx` or `client/src/types/product.ts`)

```typescript
export interface JuiceItem {
  id: string;
  name: string;
  tagline: string;             // Subtitle e.g. "Pain de singe 100% naturel"
  price: number;               // 12 or 15
  formattedPrice: string;      // "$12" or "$15"
  volume: string;              // "1L"
  description: string;         // Short card description
  longDescription: string;     // Full culinary origin story for modal view
  tasteProfile: string;        // e.g. "Onctueux, doux, style smoothie"
  ingredients: string[];       // Array of authentic ingredients
  healthBenefits: string[];    // Array of key health benefit pills
  image: string;               // Path to asset image
  color: string;               // Tailwind gradient overlay class
  badge?: string;              // Optional badge e.g. "Trésor Sauvage" or "Coup de Cœur"
}
```

---

## 3. Exact Localized Product Dictionaries (French & English)

Below are the exact, ready-to-integrate French (`copy.fr.flavors.juices`) and English (`copy.en.flavors.juices`) data arrays for all 5 products.

### 3.1 French Dictionary Data (`copy.fr.flavors.juices`)

```typescript
juices: [
  {
    id: "gingembre",
    name: "Gingembre",
    tagline: "Naturel, Pur, Bienfaisant",
    price: 12,
    formattedPrice: "$12",
    volume: "1L",
    description: "Extrait de gingembre pur pressé à froid, offrant un piquant authentique, vivifiant et profondément revitalisant.",
    longDescription: "Préparé selon des méthodes traditionnelles d'Afrique de l'Ouest, notre nectar de gingembre pur exprime la puissance brute de la racine sacrée. Une boisson vivifiante, piquante et bienfaisante qui réveille l'organisme tout en procurant un bien-être digestif immédiat.",
    tasteProfile: "Intense, piquant, chaleureux avec des notes citronnées et épicées.",
    ingredients: [
      "Gingembre frais bio",
      "Eau pure de source",
      "Jus de citron vert fraîchement pressé",
      "Touche de miel d'acacia"
    ],
    healthBenefits: [
      "Anti-nausée",
      "Apaisant maux de gorge",
      "Stimule la digestion",
      "Anti-inflammatoire"
    ],
    image: "/assets/juice_gingembre_ananas.png",
    color: "from-amber-400 to-yellow-600",
    badge: "Incontournable"
  },
  {
    id: "bouye-fraise",
    name: "Bouye Fraise",
    tagline: "Smoothie Baobab & Fraise",
    price: 12,
    formattedPrice: "$12",
    volume: "1L",
    description: "L'alliance parfaite entre l'onctuosité veloutée du pain de singe et la douceur fruitée des fraises mûres.",
    longDescription: "Un nectar crémeux à la texture de smoothie gourmand. Le fruit du baobab (pain de singe) apporte une consistance veloutée unique et un profil nutritionnel remarquable, sublimé par la fraîcheur sucrée de la fraise.",
    tasteProfile: "Onctueux, crémeux, velouté aux douceurs de fraise fraîche.",
    ingredients: [
      "Pulpe naturelle de Baobab (Pain de singe)",
      "Purée de fraises fraîches",
      "Eau de source pure",
      "Lait vanillé léger",
      "Sucre de canne bio"
    ],
    healthBenefits: [
      "Riche en Vitamine C",
      "Puissants Antioxydants",
      "Apport en Fibres doux",
      "Énergie Naturelle"
    ],
    image: "/assets/juice_bouye_fraise.png",
    color: "from-pink-400 to-red-500",
    badge: "Smoothie Crémeux"
  },
  {
    id: "maad",
    name: "Maad",
    tagline: "Trésor Sauvage d'Afrique de l'Ouest",
    price: 15,
    formattedPrice: "$15",
    volume: "1L",
    description: "Nectar rare d'exception issu de la liane sauvage Saba Senegalensis, mariage captivant d'acidité et de sucres naturels.",
    longDescription: "Le Maad est l'un des fruits sauvages les plus précieux du Sénégal et de l'Afrique de l'Ouest. Récolté de façon artisanale au cœur de la brousse, son jus délivre une explosion aromatique unique et une richesse minérale hors du commun.",
    tasteProfile: "Intensément acidulé, fruité, envoûtant avec des notes tropicales sauvages.",
    ingredients: [
      "Pulpe de fruit sauvage Maad (Saba senegalensis)",
      "Eau pure de source",
      "Sucre de canne naturel",
      "Pincée de sel marin traditionnel"
    ],
    healthBenefits: [
      "Riche en Vitamine C",
      "Vitamines B6 & B3",
      "Source de Calcium (Ca)",
      "Riche en Magnésium (Mg)"
    ],
    image: "/assets/juice_cinematic.png",
    color: "from-amber-500 to-orange-700",
    badge: "Trésor Sauvage ($15)"
  },
  {
    id: "diabolo-menthe",
    name: "Diabolo Menthe",
    tagline: "Onctueux Menthe Fraîche & Lait",
    price: 12,
    formattedPrice: "$12",
    volume: "1L",
    description: "La vivacité de la menthe poivrée fraîche fondue dans la douceur du lait, évoquant la saveur d'une crème glacée artisanale.",
    longDescription: "Une création réconfortante et rafraîchissante. La menthe fraîche cueillie à la main s'unit à la douceur lactée pour composer un nectar onctueux qui apaise le palais et rappelle la gourmandise d'un dessert glacé.",
    tasteProfile: "Frais, lacté, onctueux aux notes de crème glacée menthe-vanille.",
    ingredients: [
      "Feuilles de menthe poivrée fraîche",
      "Lait entier onctueux",
      "Sirop de menthe artisanale",
      "Extrait naturel de vanille"
    ],
    healthBenefits: [
      "Digestif Apaisé",
      "Rafraîchissement Intense",
      "Douceur Lactée Réconfortante"
    ],
    image: "/assets/juice_diabolo_menthe.png",
    color: "from-emerald-400 to-teal-600",
    badge: "Gourmandise Glacée"
  },
  {
    id: "bouye",
    name: "Bouye (Plain Baobab)",
    tagline: "Pain de Singe 100% Naturel",
    price: 12,
    formattedPrice: "$12",
    volume: "1L",
    description: "Le nectar traditionnel du Baobab sénégalais dans sa pureté absolue, super-aliment d'exception riche en fibres.",
    longDescription: "Symbole de longévité et de santé en Afrique, le Baobab offre son fruit mythique : le Pain de Singe. Ce nectar traditionnellement préparé délivre une texture veloutée incomparable, gorgée de fibres prébiotiques et de nutriments fortifiants.",
    tasteProfile: "Doux, suave, délicatement acidulé au corps riche et velouté.",
    ingredients: [
      "100% Pulpe de Baobab naturel (Pain de singe)",
      "Eau de source pure",
      "Lait doux",
      "Sucre de canne roux",
      "Arôme naturel de fleur d'oranger"
    ],
    healthBenefits: [
      "Prébiotique Naturel",
      "Riche en Fibres",
      "Fortifiant Immunitaire",
      "Vitalité & Énergie"
    ],
    image: "/assets/juice_bouye_passion.png",
    color: "from-amber-200 to-orange-400",
    badge: "100% Naturel"
  }
]
```

### 3.2 English Dictionary Data (`copy.en.flavors.juices`)

```typescript
juices: [
  {
    id: "gingembre",
    name: "Ginger",
    tagline: "Natural, Pure, Healing",
    price: 12,
    formattedPrice: "$12",
    volume: "1L",
    description: "Pure cold-pressed ginger nectar delivering an authentic, zesty, and deeply revitalizing warmth.",
    longDescription: "Crafted following ancestral West African recipes, our pure ginger nectar captures the raw power of the sacred root. An invigorating, spicy potion that wakes up your energy while promoting optimal digestive comfort.",
    tasteProfile: "Intense, zesty, warm with citrus and spicy undertones.",
    ingredients: [
      "Fresh organic ginger",
      "Pure spring water",
      "Freshly squeezed lime juice",
      "Touch of acacia honey"
    ],
    healthBenefits: [
      "Anti-nausea",
      "Sore throat relief",
      "Digestion boost",
      "Anti-inflammatory"
    ],
    image: "/assets/juice_gingembre_ananas.png",
    color: "from-amber-400 to-yellow-600",
    badge: "Bestseller"
  },
  {
    id: "bouye-fraise",
    name: "Baobab Strawberry",
    tagline: "Baobab & Strawberry Smoothie",
    price: 12,
    formattedPrice: "$12",
    volume: "1L",
    description: "The velvety creaminess of baobab fruit paired with the sweet, vibrant burst of sun-ripened strawberries.",
    longDescription: "A lush, smoothie-style nectar with an ultra-smooth velvety texture. Baobab fruit (monkey bread) gives an unmatched nutritional richness and silky body, elevated by fresh strawberry puree.",
    tasteProfile: "Creamy, velvety, gently tangy with sweet strawberry notes.",
    ingredients: [
      "Natural Baobab fruit pulp (Monkey bread)",
      "Fresh strawberry puree",
      "Pure spring water",
      "Light vanilla milk",
      "Organic cane sugar"
    ],
    healthBenefits: [
      "Rich in Vitamin C",
      "Powerful Antioxidants",
      "Gentle Fiber Boost",
      "Natural Energy"
    ],
    image: "/assets/juice_bouye_fraise.png",
    color: "from-pink-400 to-red-500",
    badge: "Creamy Smoothie"
  },
  {
    id: "maad",
    name: "Maad",
    tagline: "Wild Treasure of West Africa",
    price: 15,
    formattedPrice: "$15",
    volume: "1L",
    description: "Rare wild fruit nectar extracted from Saba Senegalensis, a sublime harmony of tangy vitality and sweetness.",
    longDescription: "Maad is West Africa's most coveted wild fruit. Hand-harvested deep in tropical forests, this legendary nectar delivers a vibrant burst of natural acidity, rich minerals, and essential vitamins.",
    tasteProfile: "Intensely tangy, fruity, exotic with wild tropical notes.",
    ingredients: [
      "Wild Maad fruit pulp (Saba senegalensis)",
      "Pure spring water",
      "Natural cane sugar",
      "Pinch of traditional sea salt"
    ],
    healthBenefits: [
      "Rich in Vitamin C",
      "Vitamins B6 & B3",
      "Calcium Source (Ca)",
      "Rich in Magnesium (Mg)"
    ],
    image: "/assets/juice_cinematic.png",
    color: "from-amber-500 to-orange-700",
    badge: "Wild Treasure ($15)"
  },
  {
    id: "diabolo-menthe",
    name: "Mint Diabolo",
    tagline: "Smooth Fresh Mint & Milk",
    price: 12,
    formattedPrice: "$12",
    volume: "1L",
    description: "Crisp garden peppermint seamlessly blended with silky milk, evoking the delight of artisanal mint ice cream.",
    longDescription: "A comforting and refreshing creation combining hand-picked peppermint with smooth milk. It offers an ice-cream-like delicacy that cools the throat and soothes digestion.",
    tasteProfile: "Fresh, milky, velvety with light mint ice cream notes.",
    ingredients: [
      "Fresh peppermint leaves",
      "Creamy whole milk",
      "Artisanal mint syrup",
      "Natural vanilla extract"
    ],
    healthBenefits: [
      "Soothing Digestion",
      "Intense Cooling",
      "Velvety Milk Comfort"
    ],
    image: "/assets/juice_diabolo_menthe.png",
    color: "from-emerald-400 to-teal-600",
    badge: "Ice Cream Delight"
  },
  {
    id: "bouye",
    name: "Pure Baobab (Bouye)",
    tagline: "100% Natural Monkey Bread",
    price: 12,
    formattedPrice: "$12",
    volume: "1L",
    description: "The authentic traditional African Baobab nectar in its purest form, an extraordinary superfood packed with fibers.",
    longDescription: "A symbol of health and longevity in Africa, the Baobab tree yields the sacred Monkey Bread fruit. This traditionally prepared nectar provides a smooth, satisfying texture packed with prebiotic fiber and fortifying nutrients.",
    tasteProfile: "Smooth, sweet, delicately tangy with a rich velvety body.",
    ingredients: [
      "100% Natural Baobab pulp (Monkey bread)",
      "Pure spring water",
      "Sweet light milk",
      "Raw cane sugar",
      "Natural orange blossom scent"
    ],
    healthBenefits: [
      "Natural Prebiotic",
      "Rich in Fibers",
      "Immune System Boost",
      "Vitality & Strength"
    ],
    image: "/assets/juice_bouye_passion.png",
    color: "from-amber-200 to-orange-400",
    badge: "100% Natural"
  }
]
```

---

## 4. UI Component Architecture for Product Cards

Each product card in the `#saveurs` section grid will display visual badges and benefit pills, while serving as an interactive trigger for the detail view.

```
+-------------------------------------------------------------------+
|  [ 1L ]                                            [ $12 / $15 ]  |
|                                                                   |
|                   [ Product Bottle Image ]                        |
|                                                                   |
|-------------------------------------------------------------------|
|  Maad                                                             |
|  Trésor Sauvage d'Afrique de l'Ouest                              |
|  Nectar rare d'exception issu de la liane sauvage...              |
|                                                                   |
|  [ Riche en Vit C ] [ Vit B6 & B3 ] [ Calcium ] [ Magnésium ]     |
|                                                                   |
|  Découvrir les bienfaits & commander  -->                         |
+-------------------------------------------------------------------+
```

### 4.1 Card JSX Layout Details
- **Image Overlays & Badges**:
  - `top-4 left-4`: `<Badge className="bg-black/70 text-white border-white/20 backdrop-blur-md px-3 py-1 font-semibold text-xs">1L</Badge>`
  - `top-4 right-4`: `<Badge className="bg-primary text-black font-bold text-sm px-3 py-1 shadow-lg shadow-primary/20">{juice.formattedPrice}</Badge>`
  - Optional `badge` tag (e.g. `Trésor Sauvage`): top center or inline above title.
- **Interactive Benefit Pills**:
  - `flex flex-wrap gap-1.5 my-4`
  - `<Badge key={benefit} variant="outline" className="bg-primary/10 text-primary border-primary/30 text-[11px] font-medium py-0.5 px-2.5 hover:bg-primary/20 transition-colors">{benefit}</Badge>`
- **Click Action**:
  - Wrapping card with `onClick={() => setSelectedJuice(juice)}` and `role="button"`.

---

## 5. State Management & Responsive Modal/Drawer Design

### 5.1 State in `Home.tsx`
```typescript
const [selectedJuice, setSelectedJuice] = useState<JuiceItem | null>(null);
```

### 5.2 Responsive Detection (`useMediaQuery`) or Responsive Primitive Wrapper

To maximize mobile UX and desktop elegance, we implement a `JuiceDetailModal` component that dynamically adapts between Radix UI `Dialog` (Desktop ≥768px) and Vaul `Drawer` (Mobile <768px).

#### Desktop `Dialog` Specifications (≥768px):
- **Container**: `DialogContent` with `className="max-w-4xl bg-black/95 border-primary/30 text-white rounded-3xl p-0 overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.9)]"`
- **Layout**: 2-Column Grid (`grid grid-cols-1 md:grid-cols-12`)
  - **Col 1 (md:col-span-5)**: Full height bottle display with background radial glow matching `juice.color`, floating `$12/$15` badge, `1L` volume pill.
  - **Col 2 (md:col-span-7)**: Detailed content area:
    1. Title & Tagline (`text-3xl font-serif text-white` + `text-primary italic text-sm`)
    2. Pricing & Volume Indicator (`$12 / $15 — Format 1 Litre`)
    3. Culinary Origin Story (`longDescription`)
    4. Taste Profile (`tasteProfile`)
    5. Authentic Ingredients Grid (`ingredients` with custom bullet dots)
    6. Health Benefit Pills (`healthBenefits` rendered as Badges)
    7. Primary CTA: Button `Commander ce nectar ($12)` linking to `#contact` with pre-filled context, closing modal.

#### Mobile `Drawer` Specifications (<768px):
- **Container**: `DrawerContent` with `className="bg-[#080808] border-t border-primary/30 text-white rounded-t-[2.5rem] max-h-[90vh] p-6 focus:outline-none"`
- **Content**: Scrollable content with top drag indicator handle, high-res image preview, price tag, benefits breakdown, ingredients, and bottom fixed CTA button.

---

## 6. Code Blueprint for Implementer

### 6.1 UI Component File Structure

Implementer M1 will create or update:
- `client/src/components/JuiceDetailModal.tsx` (Responsive modal/drawer component using `dialog.tsx`, `drawer.tsx`, `badge.tsx`)
- `client/src/pages/Home.tsx` (Data dictionary update + `JuiceDetailModal` integration + card grid polish)

### 6.2 `JuiceDetailModal.tsx` Code Structure Blueprint

```tsx
import React from "react";
import { JuiceItem } from "@/types/product"; // or inline in Home.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle2, Sparkles, X } from "lucide-react";

interface JuiceDetailModalProps {
  juice: JuiceItem | null;
  onClose: () => void;
  orderCtaText: string;
}

export function JuiceDetailModal({ juice, onClose, orderCtaText }: JuiceDetailModalProps) {
  if (!juice) return null;

  const handleOrderClick = () => {
    onClose();
    const contactSection = document.getElementById("contact");
    contactSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Desktop Dialog View (Hidden on mobile) */}
      <div className="hidden md:block">
        <Dialog open={!!juice} onOpenChange={(open) => !open && onClose()}>
          <DialogContent className="max-w-4xl bg-black/95 border-primary/30 text-white rounded-3xl p-0 overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.9)] backdrop-blur-2xl">
            <div className="grid grid-cols-12 min-h-[520px]">
              {/* Left Column: Image & Glow */}
              <div className="col-span-5 relative flex items-center justify-center p-8 overflow-hidden bg-gradient-to-br from-black/80 to-black">
                <div className={`absolute inset-0 bg-gradient-to-t ${juice.color} mix-blend-multiply opacity-40`} />
                <div className="absolute top-4 left-4 z-10">
                  <Badge className="bg-black/70 text-white border-white/20 backdrop-blur-md px-3 py-1 font-semibold text-xs">
                    {juice.volume}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4 z-10">
                  <Badge className="bg-primary text-black font-bold text-base px-3.5 py-1 shadow-lg shadow-primary/30">
                    {juice.formattedPrice}
                  </Badge>
                </div>
                <img
                  src={juice.image}
                  alt={juice.name}
                  className="relative z-10 max-h-[380px] w-auto object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.9)] hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Right Column: Information & Details */}
              <div className="col-span-7 p-8 flex flex-col justify-between border-l border-white/10">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-primary">
                      {juice.tagline}
                    </span>
                    {juice.badge && (
                      <Badge variant="outline" className="border-primary/40 text-primary text-[10px]">
                        {juice.badge}
                      </Badge>
                    )}
                  </div>

                  <h3 className="text-3xl md:text-4xl font-serif text-white mb-2">{juice.name}</h3>
                  
                  <p className="text-white/70 text-sm leading-relaxed mb-6 font-light">
                    {juice.longDescription}
                  </p>

                  {/* Taste Profile */}
                  <div className="mb-5 p-3 rounded-xl bg-white/[0.03] border border-white/10">
                    <span className="text-xs font-bold text-primary block mb-1">Profil Dégustation :</span>
                    <p className="text-xs text-white/80 italic">{juice.tasteProfile}</p>
                  </div>

                  {/* Ingredients */}
                  <div className="mb-5">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Ingrédients Authentiques</h4>
                    <div className="flex flex-wrap gap-2">
                      {juice.ingredients.map((ing) => (
                        <span key={ing} className="text-xs bg-white/[0.05] border border-white/10 px-2.5 py-1 rounded-md text-white/80 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-primary shrink-0" />
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Health Benefits */}
                  <div className="mb-6">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Bienfaits pour la Santé</h4>
                    <div className="flex flex-wrap gap-2">
                      {juice.healthBenefits.map((benefit) => (
                        <Badge key={benefit} className="bg-primary/15 text-primary border-primary/30 text-xs py-1 px-3">
                          <Sparkles className="w-3 h-3 mr-1 text-primary" />
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <button
                  onClick={handleOrderClick}
                  className="w-full btn-cinematic justify-center text-sm py-3.5 flex items-center gap-2"
                >
                  {orderCtaText} ({juice.formattedPrice}) <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Mobile Drawer View (Visible on mobile <768px) */}
      <div className="md:hidden">
        <Drawer open={!!juice} onOpenChange={(open) => !open && onClose()}>
          <DrawerContent className="bg-[#0a0a0a] border-t border-primary/30 text-white rounded-t-[2.5rem] max-h-[88vh] focus:outline-none">
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-primary block">
                    {juice.tagline}
                  </span>
                  <h3 className="text-3xl font-serif text-white">{juice.name}</h3>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge className="bg-primary text-black font-bold text-sm px-3 py-1">
                    {juice.formattedPrice}
                  </Badge>
                  <Badge variant="outline" className="border-white/20 text-white/70 text-[10px]">
                    {juice.volume}
                  </Badge>
                </div>
              </div>

              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-black/60 border border-white/10 flex items-center justify-center">
                <div className={`absolute inset-0 bg-gradient-to-t ${juice.color} opacity-30`} />
                <img src={juice.image} alt={juice.name} className="h-full w-auto object-contain py-4 relative z-10" />
              </div>

              <p className="text-white/80 text-sm leading-relaxed font-light">
                {juice.longDescription}
              </p>

              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
                <span className="text-xs font-bold text-primary block mb-1">Profil Dégustation :</span>
                <p className="text-xs text-white/80 italic">{juice.tasteProfile}</p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Ingrédients</h4>
                <div className="flex flex-wrap gap-1.5">
                  {juice.ingredients.map((ing) => (
                    <span key={ing} className="text-xs bg-white/[0.06] px-2.5 py-1 rounded-md text-white/80">
                      {ing}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Bienfaits Santé</h4>
                <div className="flex flex-wrap gap-1.5">
                  {juice.healthBenefits.map((b) => (
                    <Badge key={b} className="bg-primary/20 text-primary border-primary/30 text-xs py-1 px-2.5">
                      {b}
                    </Badge>
                  ))}
                </div>
              </div>

              <button
                onClick={handleOrderClick}
                className="w-full btn-cinematic justify-center text-sm py-4 flex items-center gap-2 mt-4"
              >
                {orderCtaText} ({juice.formattedPrice}) <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </>
  );
}
```

---

## 7. Implementation Plan Checklist & Verification Strategy

### 7.1 Action Steps for Implementer
1. **Extend `JuiceItem` type** definition in `client/src/pages/Home.tsx` (or dedicated types file).
2. **Update French (`copy.fr`) & English (`copy.en`) dictionaries** in `Home.tsx` with all 5 core products and complete authentic attributes ($12/$15, 1L, ingredients, health benefits, long descriptions).
3. **Create `client/src/components/JuiceDetailModal.tsx`** implementing responsive `Dialog` (desktop) and `Drawer` (mobile).
4. **Update Product Cards in `Home.tsx`**:
   - Render floating price badge (`$12` / `$15`)
   - Render floating volume badge (`1L`)
   - Render interactive health benefit pills (`Badge`)
   - Add `onClick={() => setSelectedJuice(juice)}` to trigger modal.
5. **Verify Typescript Compilation & Build**:
   - Execute `npm run check` (0 errors)
   - Execute `npm run build` (0 errors)

---
*Report formulated by Explorer M1.*
