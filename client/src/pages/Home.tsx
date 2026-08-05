import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Facebook, Globe2, Instagram, Mail, MapPin, Menu, Phone, Send, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Language = "fr" | "en";
type Copy = (typeof copy)[Language];

const languageOptions: Array<{
  code: Language;
  label: string;
  shortLabel: string;
}> = [
  { code: "fr", label: "Français", shortLabel: "FR" },
  { code: "en", label: "English", shortLabel: "EN" },
];

const navItems: Array<{
  key: keyof Copy["nav"]["items"];
  href: string;
}> = [
  { key: "story", href: "#histoire" },
  { key: "flavors", href: "#saveurs" },
  { key: "services", href: "#services" },
  { key: "contact", href: "#contact" },
];

const organicParticles = Array.from({ length: 15 }, (_, index) => {
  const seed = index + 1;

  return {
    id: index,
    size: ((seed * 7) % 8) + 4,
    left: `${(seed * 23) % 100}%`,
    top: `${(seed * 41) % 100}%`,
    y: -(((seed * 29) % 200) + 50),
    x: ((seed * 17) % 50) - 25,
    duration: ((seed * 11) % 5) + 5,
    delay: (seed * 13) % 5,
  };
});

const copy = {
  fr: {
    meta: {
      title: "L'Épicurienne by Waycha — Jus exotiques, brunch & traiteur | Québec",
      description:
        "Saveurs africaines authentiques, jus exotiques maison, brunch gourmand et service traiteur à Québec. L'Épicurienne by Waycha.",
      htmlLang: "fr-CA",
    },
    language: {
      switcherLabel: "Changer de langue",
    },
    nav: {
      items: {
        story: "Histoire",
        flavors: "Saveurs",
        services: "Services",
        contact: "Contact",
      },
      order: "Commander",
      openMenu: "Ouvrir le menu de navigation",
      closeMenu: "Fermer le menu de navigation",
    },
    marquee: ["Authenticité", "Tradition", "Fait Maison", "Élégance"],
    hero: {
      imageAlt: "Plat africain authentique",
      titleLineOne: "L'Authenticité",
      titleHighlight: "Africaine",
      subtitle: "Le Plaisir de Manger Tout Simplement.",
      body: "Un nouveau concept de brunch maison. Des plaisirs gourmands et des mets préparés avec passion. Redécouvrez la richesse de notre terroir.",
      primaryCta: "Découvrir nos jus",
      secondaryCta: "Nos Services",
    },
    story: {
      eyebrow: "Notre Histoire",
      imageAlt: "Tajine authentique préparé maison",
      headingPrefix: "Préparé avec",
      headingHighlight: "passion",
      headingSuffix: "et amour.",
      paragraphs: [
        "L'Épicurienne by Waycha est née d'une vision simple mais puissante : partager la chaleur, la générosité et l'incroyable diversité de la cuisine africaine.",
        "Chaque recette est un héritage, soigneusement adaptée pour vous offrir une expérience culinaire inoubliable.",
      ],
      founderLabel: "Fondatrice",
      founderName: "Aïcha",
    },
    flavors: {
      eyebrow: "Nos Nectars",
      heading: "Les Jus Naturels",
      body: "Embouteillés avec soin, nos jus rafraîchissants capturent l'essence pure des fruits et des fleurs d'Afrique.",
      orderCta: "Commander",
      juices: [
        {
          id: "mangue",
          name: "Mangue",
          description: "Un nectar riche et onctueux, gorgé de soleil et de douceur tropicale.",
          image: "/assets/juice_mangue.png",
          color: "from-yellow-400 to-orange-500",
        },
        {
          id: "bouye-fraise",
          name: "Bouye Fraise",
          description: "L'alliance parfaite entre l'acidité de la fraise et la douceur crémeuse du pain de singe.",
          image: "/assets/juice_bouye_fraise.png",
          color: "from-pink-400 to-red-500",
        },
        {
          id: "hibiscus-bissap",
          name: "Hibiscus Bissap",
          description: "Une infusion rouge rubis aux notes acidulées et florales, rafraîchissante et revigorante.",
          image: "/assets/juice_bissap.png",
          color: "from-red-600 to-purple-800",
        },
        {
          id: "gingembre-ananas",
          name: "Gingembre Ananas",
          description: "Un cocktail piquant et sucré qui réveille les papilles avec une chaleur exotique.",
          image: "/assets/juice_gingembre_ananas.png",
          color: "from-yellow-300 to-yellow-600",
        },
        {
          id: "diabolo-menthe",
          name: "Diabolo Menthe",
          description: "Une fraîcheur éclatante et mentholée, idéale pour apaiser la soif.",
          image: "/assets/juice_diabolo_menthe.png",
          color: "from-green-400 to-emerald-600",
        },
        {
          id: "bouye-passion",
          name: "Bouye Passion",
          description: "Le velouté du baobab sublimé par la touche acidulée et parfumée du fruit de la passion.",
          image: "/assets/juice_bouye_passion.png",
          color: "from-orange-300 to-orange-600",
        },
      ],
    },
    services: {
      eyebrow: "Notre Expertise",
      heading: "Traiteur et Réceptions",
      items: [
        {
          title: "Traiteur Événementiel",
          description:
            "Des réceptions sur mesure qui célèbrent la richesse des saveurs africaines avec élégance.",
          features: ["Mariages", "Événements d'entreprise", "Réceptions privées"],
          delay: 0.1,
        },
        {
          title: "Boîtes à Lunch",
          description:
            "Des repas équilibrés, savoureux et prêts à déguster pour vos journées chargées.",
          features: ["Options végétariennes", "Ingrédients frais", "Livraison rapide"],
          delay: 0.2,
        },
        {
          title: "Brunch Maison",
          description:
            "L'Épicurienne est un nouveau concept de brunch maison, des plaisirs gourmands préparés avec passion.",
          features: ["Menu varié", "Convivialité", "Saveurs uniques"],
          delay: 0.3,
        },
      ],
    },
    contact: {
      heading: "Restons en Contact",
      newsletterBody:
        "Inscrivez-vous à notre newsletter pour découvrir nos nouvelles saveurs et offres exclusives.",
      newsletterPlaceholder: "votre@email.com",
      messageHeading: "Envoyer un Message",
      namePlaceholder: "Votre nom",
      emailPlaceholder: "Email",
      messagePlaceholder: "Votre demande",
      submitMessage: "Envoyer",
    },
    footer: {
      description:
        "L'Épicurienne By Waycha propose une expérience culinaire africaine haut de gamme, mariant tradition et élégance.",
      navigationHeading: "Navigation",
      contactHeading: "Contact",
      socialHeading: "Réseaux",
      location: "Québec, QC, Canada",
      phone: "Sur réservation",
      rights: "Tous droits réservés.",
      legal: "Mentions Légales",
      privacy: "Politique de Confidentialité",
    },
    toasts: {
      contact: "Votre message a été envoyé avec succès !",
      newsletter: "Merci pour votre inscription à la newsletter !",
    },
    alt: {
      logo: "Logo L'Épicurienne By Waycha",
    },
  },
  en: {
    meta: {
      title: "L'Épicurienne by Waycha — Exotic Juices, Brunch & Catering | Québec",
      description:
        "Authentic African flavors, house-made exotic juices, generous brunches, and elegant catering in Québec. L'Épicurienne by Waycha.",
      htmlLang: "en-CA",
    },
    language: {
      switcherLabel: "Change language",
    },
    nav: {
      items: {
        story: "Story",
        flavors: "Flavors",
        services: "Services",
        contact: "Contact",
      },
      order: "Order",
      openMenu: "Open navigation menu",
      closeMenu: "Close navigation menu",
    },
    marquee: ["Authenticity", "Tradition", "Homemade", "Elegance"],
    hero: {
      imageAlt: "Authentic African dish",
      titleLineOne: "African",
      titleHighlight: "Authenticity",
      subtitle: "The Simple Pleasure of Eating Well.",
      body: "A fresh take on homemade brunch. Generous dishes and gourmet pleasures prepared with passion. Rediscover the richness of our culinary heritage.",
      primaryCta: "Discover our juices",
      secondaryCta: "Our Services",
    },
    story: {
      eyebrow: "Our Story",
      imageAlt: "Authentic homemade tajine",
      headingPrefix: "Prepared with",
      headingHighlight: "passion",
      headingSuffix: "and love.",
      paragraphs: [
        "L'Épicurienne by Waycha was born from a simple yet powerful vision: to share the warmth, generosity, and incredible diversity of African cuisine.",
        "Every recipe carries a legacy, carefully adapted to offer you an unforgettable culinary experience.",
      ],
      founderLabel: "Founder",
      founderName: "Aïcha",
    },
    flavors: {
      eyebrow: "Our Nectars",
      heading: "Natural Juices",
      body: "Bottled with care, our refreshing juices capture the pure essence of African fruits and flowers.",
      orderCta: "Order",
      juices: [
        {
          id: "mangue",
          name: "Mango",
          description: "A rich, velvety nectar filled with sunshine and tropical sweetness.",
          image: "/assets/juice_mangue.png",
          color: "from-yellow-400 to-orange-500",
        },
        {
          id: "bouye-fraise",
          name: "Baobab Strawberry",
          description: "A perfect balance of bright strawberry and the creamy sweetness of baobab fruit.",
          image: "/assets/juice_bouye_fraise.png",
          color: "from-pink-400 to-red-500",
        },
        {
          id: "hibiscus-bissap",
          name: "Hibiscus Bissap",
          description: "A ruby-red infusion with tangy floral notes, refreshing and revitalizing.",
          image: "/assets/juice_bissap.png",
          color: "from-red-600 to-purple-800",
        },
        {
          id: "gingembre-ananas",
          name: "Ginger Pineapple",
          description: "A sweet, spicy blend that wakes up the palate with exotic warmth.",
          image: "/assets/juice_gingembre_ananas.png",
          color: "from-yellow-300 to-yellow-600",
        },
        {
          id: "diabolo-menthe",
          name: "Mint Diabolo",
          description: "A bright, minty freshness made to soothe thirst with a crisp finish.",
          image: "/assets/juice_diabolo_menthe.png",
          color: "from-green-400 to-emerald-600",
        },
        {
          id: "bouye-passion",
          name: "Baobab Passion Fruit",
          description: "The smoothness of baobab lifted by the tangy perfume of passion fruit.",
          image: "/assets/juice_bouye_passion.png",
          color: "from-orange-300 to-orange-600",
        },
      ],
    },
    services: {
      eyebrow: "Our Expertise",
      heading: "Catering and Receptions",
      items: [
        {
          title: "Event Catering",
          description:
            "Tailored receptions that celebrate the richness of African flavors with refinement.",
          features: ["Weddings", "Corporate events", "Private receptions"],
          delay: 0.1,
        },
        {
          title: "Lunch Boxes",
          description:
            "Balanced, flavorful meals ready to enjoy throughout your busiest days.",
          features: ["Vegetarian options", "Fresh ingredients", "Fast delivery"],
          delay: 0.2,
        },
        {
          title: "Homemade Brunch",
          description:
            "L'Épicurienne is a new homemade brunch concept: gourmet pleasures prepared with passion.",
          features: ["Varied menu", "Warm hospitality", "Unique flavors"],
          delay: 0.3,
        },
      ],
    },
    contact: {
      heading: "Let's Stay in Touch",
      newsletterBody:
        "Join our newsletter to discover new flavors, seasonal menus, and exclusive offers.",
      newsletterPlaceholder: "your@email.com",
      messageHeading: "Send a Message",
      namePlaceholder: "Your name",
      emailPlaceholder: "Email",
      messagePlaceholder: "Your request",
      submitMessage: "Send",
    },
    footer: {
      description:
        "L'Épicurienne By Waycha offers an elevated African culinary experience, bringing tradition and elegance together.",
      navigationHeading: "Navigation",
      contactHeading: "Contact",
      socialHeading: "Social",
      location: "Québec, QC, Canada",
      phone: "By reservation",
      rights: "All rights reserved.",
      legal: "Legal Notice",
      privacy: "Privacy Policy",
    },
    toasts: {
      contact: "Your message has been sent successfully!",
      newsletter: "Thank you for joining the newsletter!",
    },
    alt: {
      logo: "L'Épicurienne By Waycha logo",
    },
  },
} as const;

const getInitialLanguage = (): Language => {
  const storedLanguage = window.localStorage.getItem("lepicurienne-language");

  if (storedLanguage === "fr" || storedLanguage === "en") {
    return storedLanguage;
  }

  return window.navigator.language.toLowerCase().startsWith("en") ? "en" : "fr";
};

const LanguageToggle = ({
  language,
  onLanguageChange,
  switcherLabel,
  compact = false,
}: {
  language: Language;
  onLanguageChange: (language: Language) => void;
  switcherLabel: string;
  compact?: boolean;
}) => (
  <div
    className={`inline-flex items-center rounded-full border border-white/10 bg-black/40 p-1 shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-2xl ${
      compact ? "gap-2" : "gap-3"
    }`}
    aria-label={switcherLabel}
  >
    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.04] text-primary">
      <Globe2 className="h-4 w-4" aria-hidden="true" />
    </span>
    <div className="flex rounded-full bg-white/[0.03] p-0.5" role="group" aria-label={switcherLabel}>
      {languageOptions.map((option) => {
        const isActive = language === option.code;

        return (
          <button
            key={option.code}
            type="button"
            onClick={() => onLanguageChange(option.code)}
            aria-pressed={isActive}
            className={`h-8 min-w-10 rounded-full px-3 text-[0.65rem] font-bold uppercase tracking-[0.18em] transition-all duration-300 ${
              isActive
                ? "bg-primary text-black shadow-[0_0_24px_rgba(212,175,55,0.35)]"
                : "text-white/50 hover:text-white"
            }`}
          >
            <span className="hidden sm:inline">{option.label}</span>
            <span className="sm:hidden">{option.shortLabel}</span>
          </button>
        );
      })}
    </div>
  </div>
);

const OrganicParticles = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden mix-blend-screen hidden md:block">
      {organicParticles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(212,175,55,0.6) 0%, rgba(199,111,64,0) 70%)",
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: particle.left,
            top: particle.top,
          }}
          animate={{
            y: [0, particle.y],
            x: [0, particle.x],
            opacity: [0, 0.8, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "linear",
            delay: particle.delay,
          }}
        />
      ))}
    </div>
  );
};

const Marquee = ({ items }: { items: Copy["marquee"] }) => (
  <div className="absolute bottom-0 left-0 w-full overflow-hidden bg-gradient-to-t from-black/80 to-transparent py-4 md:py-6 z-20">
    <motion.div
      className="flex whitespace-nowrap gap-8 md:gap-12"
      animate={{ x: ["0%", "-50%"] }}
      transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
    >
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex items-center gap-8 md:gap-12">
          {items.map((item, index) => (
            <span key={`${item}-${index}`} className="contents">
              <span
                className={`tracking-[0.3em] md:tracking-[0.4em] text-[10px] md:text-xs font-bold uppercase ${
                  index % 2 === 0 ? "text-primary/80" : "text-white/40"
                }`}
              >
                {item}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
            </span>
          ))}
        </div>
      ))}
    </motion.div>
  </div>
);

const BespokeIcon = ({ children }: { children: React.ReactNode }) => (
  <div className="relative flex items-center justify-center w-12 h-12 md:w-16 md:h-16 group-hover:scale-110 transition-transform duration-500 shrink-0 mx-auto md:mx-0">
    <div className="absolute inset-0 border border-primary/20 rotate-45 transition-transform duration-700 group-hover:rotate-90 group-hover:border-primary/60" />
    <div className="absolute inset-2 border border-primary/10 rounded-full group-hover:border-primary/40 transition-colors duration-500" />
    <div className="relative z-10 text-primary flex items-center justify-center w-full h-full">
      {children}
    </div>
  </div>
);

export default function Home() {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const yHero = useTransform(scrollY, [0, 1000], [0, 300]);
  const yStoryImage = useTransform(scrollY, [0, 2000], [0, -100]);
  const t = copy[language];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.lang = t.meta.htmlLang;
    document.title = t.meta.title;
    window.localStorage.setItem("lepicurienne-language", language);

    const description = document.querySelector('meta[name="description"]');
    description?.setAttribute("content", t.meta.description);
  }, [language, t.meta.description, t.meta.htmlLang, t.meta.title]);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(t.toasts.contact);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(t.toasts.newsletter);
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 60,
        damping: 20,
        delay: i * 0.1,
      },
    }),
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="bg-background text-foreground min-h-screen font-sans selection:bg-primary/30 overflow-x-hidden">
      <nav className={`fixed w-full z-50 transition-all duration-700 ${isScrolled ? "bg-black/95 backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,0,0,0.5)] py-3 md:py-4 border-b border-white/5" : "bg-gradient-to-b from-black/90 to-transparent py-4 md:py-8"}`}>
        <div className="container mx-auto px-6 lg:px-12 flex justify-between items-center gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center"
          >
            <img src="/assets/logo.png" alt={t.alt.logo} className="h-14 md:h-20 lg:h-24 w-auto object-contain drop-shadow-2xl transition-all duration-500" />
          </motion.div>

          <div className="hidden md:flex space-x-8 lg:space-x-10 items-center">
            {navItems.map((item, i) => (
              <motion.a
                key={item.key}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                href={item.href}
                className="text-[10px] lg:text-xs font-bold uppercase tracking-[0.2em] text-white/60 hover:text-primary transition-colors relative group"
              >
                {t.nav.items[item.key]}
                <span className="absolute -bottom-2 left-1/2 w-0 h-px bg-primary group-hover:w-1/2 group-hover:left-1/4 transition-all duration-300" />
              </motion.a>
            ))}
            <motion.a
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              href="#contact"
              className="btn-cinematic text-xs py-3 px-6"
            >
              {t.nav.order}
            </motion.a>
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <LanguageToggle
                language={language}
                onLanguageChange={setLanguage}
                switcherLabel={t.language.switcherLabel}
              />
            </motion.div>
          </div>

          <div className="md:hidden flex items-center gap-3">
            <LanguageToggle
              language={language}
              onLanguageChange={setLanguage}
              switcherLabel={t.language.switcherLabel}
              compact
            />
            <button className="text-white hover:text-primary transition-colors" onClick={() => setMobileMenuOpen(true)} aria-label={t.nav.openMenu}>
              <Menu className="w-8 h-8" />
            </button>
          </div>
        </div>
      </nav>

      {mobileMenuOpen ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-3xl flex flex-col justify-center items-center"
        >
          <button className="absolute top-6 right-6 text-white hover:text-primary transition-colors" onClick={() => setMobileMenuOpen(false)} aria-label={t.nav.closeMenu}>
            <X className="w-10 h-10" />
          </button>
          <div className="absolute top-6 left-6">
            <LanguageToggle
              language={language}
              onLanguageChange={setLanguage}
              switcherLabel={t.language.switcherLabel}
              compact
            />
          </div>
          <div className="flex flex-col gap-8 text-center">
            {navItems.map((item) => (
              <a
                key={item.key}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-4xl font-serif font-medium text-white hover:text-primary transition-colors"
              >
                {t.nav.items[item.key]}
              </a>
            ))}
          </div>
        </motion.div>
      ) : null}

      <section className="relative min-h-[100svh] flex items-center pt-28 pb-20 md:pt-32 md:pb-20 overflow-hidden">
        <motion.div style={{ y: yHero }} className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[#050505]/70 md:bg-gradient-to-r md:from-[#050505] md:via-[#050505]/80 md:to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-transparent z-10" />
          <img
            src="/assets/475979412_1014372657414364_2366764902198723342_n.jpg"
            alt={t.hero.imageAlt}
            className="w-full h-full object-cover object-center md:object-right opacity-60 md:opacity-70"
          />
        </motion.div>

        <OrganicParticles />
        <Marquee items={t.marquee} />

        <div className="container mx-auto px-6 lg:px-12 relative z-20 flex flex-col items-center text-center md:text-left md:items-start">
          <div className="max-w-4xl relative w-full flex flex-col items-center md:items-start">
            <div className="absolute -left-12 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-primary/10 to-transparent hidden lg:block" />

            <motion.h1
              custom={1} initial="hidden" animate="visible" variants={fadeUp}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-[7rem] font-serif font-medium leading-[1.1] md:leading-[1] mb-6 md:mb-8 text-white text-center md:text-left"
            >
              {t.hero.titleLineOne} <br className="hidden md:block" />
              <span className="text-primary italic text-glow relative inline-block mt-2">
                {t.hero.titleHighlight}
                <motion.svg className="absolute -bottom-2 md:-bottom-4 left-0 w-full" viewBox="0 0 200 20" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 1.5, delay: 1, ease: "easeInOut" }}>
                  <path d="M0 10 Q 50 20 100 10 T 200 10" fill="transparent" stroke="rgba(212,175,55,0.5)" strokeWidth="2" strokeLinecap="round" />
                </motion.svg>
              </span>
            </motion.h1>

            <motion.h2
              custom={2} initial="hidden" animate="visible" variants={fadeUp}
              className="text-lg sm:text-xl md:text-3xl font-serif text-white/90 italic mb-6 md:mb-8 md:border-l-2 md:border-primary md:pl-6 text-center md:text-left w-full"
            >
              {t.hero.subtitle}
            </motion.h2>

            <motion.p
              custom={3} initial="hidden" animate="visible" variants={fadeUp}
              className="text-base md:text-xl text-white/60 leading-relaxed mb-10 md:mb-12 max-w-2xl font-light text-center md:text-left px-4 md:px-0"
            >
              {t.hero.body}
            </motion.p>

            <motion.div custom={4} initial="hidden" animate="visible" variants={fadeUp} className="flex flex-col md:flex-row gap-6 items-center w-full md:w-auto">
              <a href="#saveurs" className="btn-cinematic w-full md:w-auto text-center justify-center">
                {t.hero.primaryCta}
              </a>
              <a href="#services" className="inline-flex items-center justify-center gap-4 text-[0.7rem] font-bold tracking-[0.2em] uppercase text-white/70 hover:text-primary transition-colors group">
                <span className="w-8 md:w-12 h-px bg-white/20 group-hover:bg-primary group-hover:w-16 transition-all duration-300" />
                {t.hero.secondaryCta}
                <span className="w-8 md:hidden h-px bg-white/20 group-hover:bg-primary transition-all duration-300" />
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="histoire" className="py-20 md:py-32 bg-background relative overflow-hidden">
        <div className="absolute right-0 top-0 w-1/3 h-full bg-white/[0.02] border-l border-white/5 pointer-events-none hidden md:block" />

        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-0">
            <motion.div
              style={{ y: yStoryImage }}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, type: "spring" as const, stiffness: 40 }}
              className="w-full lg:w-7/12 relative z-10"
            >
              <div className="relative aspect-square md:aspect-[4/3] lg:aspect-[4/5] rounded-tl-[60px] rounded-br-[60px] md:rounded-tl-[100px] md:rounded-br-[100px] overflow-hidden glass-card p-1 md:p-2 shadow-[0_10px_30px_rgba(0,0,0,0.5)] md:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                <img
                  src="/assets/481273517_1034726048712358_7904002083794129798_n.jpg"
                  alt={t.story.imageAlt}
                  className="w-full h-full object-cover rounded-tl-[56px] rounded-br-[56px] md:rounded-tl-[92px] md:rounded-br-[92px] hover:scale-105 transition-transform duration-1000 ease-out"
                />
                <div className="absolute inset-0 rounded-tl-[60px] rounded-br-[60px] md:rounded-tl-[100px] md:rounded-br-[100px] border-glow pointer-events-none" />
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
              className="w-full lg:w-6/12 lg:-ml-24 relative z-20 -mt-16 md:-mt-0"
            >
              <div className="glass-panel p-8 md:p-16 rounded-[2rem] shadow-[0_20px_40px_rgba(0,0,0,0.6)] md:shadow-[0_30px_60px_rgba(0,0,0,0.8)] border border-primary/20 bg-black/90 backdrop-blur-3xl text-center md:text-left">
                <motion.h2 variants={fadeUp} className="text-[0.6rem] md:text-[0.7rem] font-bold tracking-[0.2em] md:tracking-[0.3em] uppercase text-primary mb-6 flex items-center justify-center md:justify-start gap-4">
                  <span className="w-6 md:w-8 h-px bg-primary/50" />
                  {t.story.eyebrow}
                  <span className="w-6 h-px bg-primary/50 md:hidden" />
                </motion.h2>
                <motion.h3 variants={fadeUp} className="text-3xl md:text-5xl lg:text-6xl font-serif mb-6 md:mb-8 text-white leading-tight">
                  {t.story.headingPrefix} <br className="hidden md:block" />
                  <span className="italic text-primary">{t.story.headingHighlight}</span> {t.story.headingSuffix}
                </motion.h3>

                <div className="space-y-4 md:space-y-6 text-white/60 text-base md:text-lg leading-relaxed font-light mb-10 md:mb-12">
                  {t.story.paragraphs.map((paragraph) => (
                    <motion.p key={paragraph} variants={fadeUp}>
                      {paragraph}
                    </motion.p>
                  ))}
                </div>

                <motion.div variants={fadeUp} className="pt-6 md:pt-8 border-t border-white/10 flex flex-col md:flex-row items-center md:justify-between gap-4 md:gap-0 text-center md:text-left">
                  <div>
                    <p className="text-[0.6rem] md:text-[0.7rem] font-bold tracking-[0.2em] text-primary uppercase mb-1 md:mb-2">{t.story.founderLabel}</p>
                    <p className="font-serif italic text-xl md:text-2xl text-white">{t.story.founderName}</p>
                  </div>
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-primary/30 flex items-center justify-center bg-black/50">
                    <img src="/assets/logo.png" alt={t.alt.logo} className="w-8 md:w-10 h-auto" />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="saveurs" className="py-20 md:py-32 bg-[#050505] border-t border-white/5 relative">
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, type: "spring" as const }}
            className="text-center max-w-3xl mx-auto mb-16 md:mb-24"
          >
            <h2 className="text-[0.6rem] md:text-[0.7rem] font-bold tracking-[0.2em] md:tracking-[0.3em] uppercase text-primary mb-4 md:mb-6 flex items-center justify-center gap-3 md:gap-4">
              <span className="w-6 md:w-8 h-px bg-primary/50" />
              {t.flavors.eyebrow}
              <span className="w-6 md:w-8 h-px bg-primary/50" />
            </h2>
            <h3 className="text-4xl md:text-7xl font-serif text-white mb-6 md:mb-8">{t.flavors.heading}</h3>
            <p className="text-white/60 text-base md:text-lg font-light max-w-xl mx-auto">{t.flavors.body}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {t.flavors.juices.map((juice, i) => (
              <motion.div
                key={juice.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ type: "spring" as const, stiffness: 50, damping: 20, delay: i * 0.1 }}
                className="group relative rounded-[2rem] md:rounded-[2.5rem] overflow-hidden glass-card shadow-[0_10px_30px_rgba(0,0,0,0.8)] md:shadow-[0_20px_40px_rgba(0,0,0,0.8)]"
              >
                <div className="aspect-[4/5] overflow-hidden relative">
                  <img
                    src={juice.image}
                    alt={juice.name}
                    className="w-full h-full object-cover group-hover:scale-105 md:group-hover:scale-110 transition-transform duration-1000 ease-out"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${juice.color} mix-blend-multiply opacity-50`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                  <div className="absolute inset-3 md:inset-4 border border-white/10 rounded-[1.5rem] md:rounded-[2rem] z-10 pointer-events-none group-hover:border-primary/30 transition-colors duration-700 hidden md:block" />
                </div>

                <div className="absolute bottom-0 left-0 w-full p-8 md:p-10 md:translate-y-6 md:group-hover:translate-y-0 transition-transform duration-500 z-20 text-center md:text-left">
                  <h4 className="text-3xl md:text-4xl font-serif text-white mb-2 md:mb-4">{juice.name}</h4>
                  <p className="text-white/60 text-sm leading-relaxed mb-6 md:mb-8 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 delay-100">{juice.description}</p>
                  <a href="#contact" className="inline-flex items-center text-[0.6rem] md:text-[0.7rem] font-bold uppercase tracking-[0.2em] text-primary hover:text-white transition-colors group/link">
                    {t.flavors.orderCta} <ArrowRight className="w-4 h-4 ml-2 md:ml-3 transform group-hover/link:translate-x-2 transition-transform" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="py-20 md:py-32 bg-[#020202] border-t border-white/5 relative overflow-hidden">
        <div className="absolute left-0 top-0 w-1/3 h-full bg-white/[0.01] border-r border-white/5 pointer-events-none hidden md:block" />

        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, type: "spring" as const }}
            className="text-center mb-16 md:mb-24"
          >
            <h2 className="text-[0.6rem] md:text-[0.7rem] font-bold tracking-[0.2em] md:tracking-[0.3em] uppercase text-primary mb-4 md:mb-6 flex items-center justify-center gap-3 md:gap-4">
              <span className="w-6 md:w-8 h-px bg-primary/50" />
              {t.services.eyebrow}
              <span className="w-6 md:w-8 h-px bg-primary/50" />
            </h2>
            <h3 className="text-4xl md:text-7xl font-serif text-white">{t.services.heading}</h3>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {t.services.items.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ type: "spring" as const, stiffness: 50, damping: 20, delay: service.delay }}
                className="p-8 md:p-12 rounded-[2rem] md:rounded-[2.5rem] bg-[#050505] border border-white/5 hover:border-primary/20 transition-all duration-700 group relative overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col items-center text-center md:items-start md:text-left"
              >
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none hidden md:block">
                  <img src="/assets/logo.png" alt="" className="w-32 h-32 grayscale" />
                </div>

                <div className="mb-8 md:mb-10 w-fit">
                  <BespokeIcon>
                    <span className="font-serif text-xl md:text-2xl italic">0{index + 1}</span>
                  </BespokeIcon>
                </div>

                <h4 className="text-2xl md:text-3xl font-serif text-white mb-4 md:mb-6 relative z-10">{service.title}</h4>
                <p className="text-white/50 font-light mb-8 md:mb-10 leading-relaxed relative z-10 text-sm md:text-base">{service.description}</p>
                <ul className="space-y-4 relative z-10 w-full text-left inline-block md:w-auto">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center justify-center md:justify-start text-xs md:text-sm text-white/70">
                      <div className="w-4 md:w-6 h-px bg-primary/50 mr-3 md:mr-4 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer id="contact" className="bg-[#050505] pt-20 md:pt-32 pb-10 border-t border-white/10 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1200px] opacity-[0.02] pointer-events-none mix-blend-screen justify-center hidden md:flex">
          <img src="/assets/logo.png" alt="" className="w-full h-auto grayscale" />
        </div>

        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 mb-16 md:mb-24 pb-16 md:pb-24 border-b border-white/10">
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
              className="text-center md:text-left flex flex-col items-center md:items-start"
            >
              <motion.h2 variants={fadeUp} className="text-4xl md:text-6xl lg:text-7xl font-serif text-white mb-6 md:mb-8">{t.contact.heading}</motion.h2>
              <motion.p variants={fadeUp} className="text-white/50 text-base md:text-xl font-light max-w-md mb-8 md:mb-10 leading-relaxed">
                {t.contact.newsletterBody}
              </motion.p>
              <motion.form variants={fadeUp} onSubmit={handleNewsletterSubmit} className="relative w-full max-w-md mx-auto md:mx-0">
                <input
                  type="email"
                  required
                  placeholder={t.contact.newsletterPlaceholder}
                  className="w-full bg-white/[0.02] border border-white/10 rounded-full py-4 md:py-5 pl-6 md:pl-8 pr-16 text-white focus:outline-none focus:border-primary transition-colors placeholder:text-white/20 text-sm md:text-base"
                />
                <button type="submit" className="absolute right-2 top-2 bottom-2 w-10 md:w-12 bg-primary rounded-full flex items-center justify-center text-white hover:bg-white hover:text-primary transition-colors" aria-label={t.contact.submitMessage}>
                  <Send className="w-4 md:w-5 h-4 md:h-5 ml-[-2px]" />
                </button>
              </motion.form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ type: "spring" as const, stiffness: 40 }}
              className="glass-card p-8 md:p-12 rounded-[2rem] md:rounded-[2.5rem] border border-white/5 w-full max-w-lg mx-auto"
            >
              <h3 className="text-2xl md:text-3xl font-serif text-white mb-6 md:mb-8 text-center md:text-left">{t.contact.messageHeading}</h3>
              <form onSubmit={handleContactSubmit} className="space-y-4 md:space-y-5">
                <input type="text" required className="w-full px-5 md:px-6 py-4 md:py-5 bg-black/50 border border-white/10 rounded-xl md:rounded-2xl focus:outline-none focus:border-primary text-white placeholder:text-white/30 transition-colors text-sm md:text-base" placeholder={t.contact.namePlaceholder} />
                <input type="email" required className="w-full px-5 md:px-6 py-4 md:py-5 bg-black/50 border border-white/10 rounded-xl md:rounded-2xl focus:outline-none focus:border-primary text-white placeholder:text-white/30 transition-colors text-sm md:text-base" placeholder={t.contact.emailPlaceholder} />
                <textarea required rows={4} className="w-full px-5 md:px-6 py-4 md:py-5 bg-black/50 border border-white/10 rounded-xl md:rounded-2xl focus:outline-none focus:border-primary text-white placeholder:text-white/30 transition-colors resize-none text-sm md:text-base" placeholder={t.contact.messagePlaceholder} />
                <button type="submit" className="w-full btn-cinematic mt-2 text-sm md:text-base py-4">
                  {t.contact.submitMessage}
                </button>
              </form>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 mb-12 md:mb-16 text-center md:text-left">
            <div className="flex flex-col items-center md:items-start col-span-1 sm:col-span-2 md:col-span-1">
              <img src="/assets/logo.png" alt={t.alt.logo} className="h-16 md:h-24 mb-6 md:mb-8" />
              <p className="text-white/40 text-xs md:text-sm leading-relaxed md:pr-4 max-w-xs">
                {t.footer.description}
              </p>
            </div>

            <div className="flex flex-col items-center md:items-start">
              <h4 className="text-[0.6rem] md:text-[0.7rem] font-bold tracking-[0.2em] uppercase text-white mb-6 md:mb-8">{t.footer.navigationHeading}</h4>
              <ul className="space-y-4 md:space-y-5">
                {navItems.slice(0, 3).map((item) => (
                  <li key={item.key}>
                    <a href={item.href} className="text-white/50 hover:text-primary transition-colors text-xs md:text-sm flex items-center gap-3 group justify-center md:justify-start">
                      <span className="w-0 h-px bg-primary group-hover:w-4 transition-all duration-300 hidden md:block" />
                      {t.nav.items[item.key]}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col items-center md:items-start">
              <h4 className="text-[0.6rem] md:text-[0.7rem] font-bold tracking-[0.2em] uppercase text-white mb-6 md:mb-8">{t.footer.contactHeading}</h4>
              <ul className="space-y-4 md:space-y-6 flex flex-col items-center md:items-start">
                <li className="flex flex-col md:flex-row items-center md:items-start text-white/50 text-xs md:text-sm group text-center md:text-left">
                  <div className="mb-2 md:mb-0 md:mt-1">
                    <BespokeIcon>
                      <MapPin className="w-4 h-4" />
                    </BespokeIcon>
                  </div>
                  <span className="md:ml-6 md:mt-5 flex-1">{t.footer.location}</span>
                </li>
                <li className="flex flex-col md:flex-row items-center md:items-start text-white/50 text-xs md:text-sm group mt-2 md:mt-4 text-center md:text-left">
                  <div className="mb-2 md:mb-0">
                    <BespokeIcon>
                      <Mail className="w-4 h-4" />
                    </BespokeIcon>
                  </div>
                  <span className="md:ml-6 md:mt-4 flex-1">lepicuriennebywaycha<br className="hidden md:block" />@gmail.com</span>
                </li>
                <li className="flex flex-col md:flex-row items-center md:items-start text-white/50 text-xs md:text-sm group mt-2 md:mt-4 text-center md:text-left">
                  <div className="mb-2 md:mb-0">
                    <BespokeIcon>
                      <Phone className="w-4 h-4" />
                    </BespokeIcon>
                  </div>
                  <span className="md:ml-6 md:mt-4 flex-1">{t.footer.phone}</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col items-center md:items-start">
              <h4 className="text-[0.6rem] md:text-[0.7rem] font-bold tracking-[0.2em] uppercase text-white mb-6 md:mb-8">{t.footer.socialHeading}</h4>
              <div className="flex gap-4">
                <a href="https://www.facebook.com/profile.php?id=100067137965610" target="_blank" rel="noreferrer" className="group" aria-label="Facebook">
                  <BespokeIcon>
                    <Facebook className="w-4 h-4" />
                  </BespokeIcon>
                </a>
                <a href="#" className="group" aria-label="Instagram">
                  <BespokeIcon>
                    <Instagram className="w-4 h-4" />
                  </BespokeIcon>
                </a>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-center md:justify-between items-center gap-4 text-center">
            <p className="text-white/30 text-[10px] md:text-xs">
              © {new Date().getFullYear()} L'Épicurienne By Waycha. {t.footer.rights}
            </p>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-white/30 text-[10px] md:text-xs">
              <a href="#" className="hover:text-white transition-colors">{t.footer.legal}</a>
              <a href="#" className="hover:text-white transition-colors">{t.footer.privacy}</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
