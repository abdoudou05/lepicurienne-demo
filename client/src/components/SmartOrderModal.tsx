import React, { useState, useEffect } from "react";
import { JuiceItem } from "@/types/product";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, ShoppingBag, Phone, MessageSquare, Mail, MapPin, X, Truck, ShieldCheck, AlertCircle } from "lucide-react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { toast } from "sonner";

interface CartItem {
  juice: JuiceItem;
  quantity: number;
}

interface SmartOrderModalProps {
  open: boolean;
  onClose: () => void;
  initialJuice: JuiceItem | null;
  allJuices: JuiceItem[];
  language: "fr" | "en";
}

interface FormErrors {
  name?: string;
  phone?: string;
  address?: string;
  cart?: string;
}

export function SmartOrderModal({ open, onClose, initialJuice, allJuices, language }: SmartOrderModalProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [fulfillment, setFulfillment] = useState<"pickup" | "delivery">("pickup");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialJuice && open) {
      setCart([{ juice: initialJuice, quantity: 1 }]);
      setErrors({});
    }
  }, [initialJuice, open]);

  const updateQuantity = (juiceId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.juice.id === juiceId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
    if (errors.cart) {
      setErrors((prev) => ({ ...prev, cart: undefined }));
    }
  };

  const addJuiceToCart = (juice: JuiceItem) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.juice.id === juice.id);
      if (exists) {
        return prev.map((item) =>
          item.juice.id === juice.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { juice, quantity: 1 }];
    });
    if (errors.cart) {
      setErrors((prev) => ({ ...prev, cart: undefined }));
    }
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.juice.price * item.quantity, 0);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (cart.length === 0) {
      newErrors.cart = language === "fr" ? "Votre panier est vide. Veuillez sélectionner au moins une bouteille." : "Your basket is empty. Please select at least one bottle.";
    }

    if (!customerName.trim() || customerName.trim().length < 2) {
      newErrors.name = language === "fr" ? "Veuillez indiquer votre nom complet (au moins 2 caractères)." : "Please enter your full name (at least 2 characters).";
    }

    // Phone validation (digits check)
    const phoneDigits = customerPhone.replace(/\D/g, "");
    if (!customerPhone.trim() || phoneDigits.length < 10) {
      newErrors.phone = language === "fr" ? "Veuillez entrer un numéro de téléphone valide à 10 chiffres (ex: 819-448-3630)." : "Please enter a valid 10-digit phone number.";
    }

    if (fulfillment === "delivery" && (!customerAddress.trim() || customerAddress.trim().length < 5)) {
      newErrors.address = language === "fr" ? "Veuillez saisir une adresse de livraison valide à Québec." : "Please enter a valid delivery address in Quebec.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const firstMsg = Object.values(newErrors)[0];
      toast.error(firstMsg);
      return false;
    }

    return true;
  };

  const executeOrderSubmission = (channel: "sms" | "whatsapp" | "email") => {
    if (isSubmitting) return;

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const itemsList = cart.map((i) => `• ${i.quantity}x ${i.juice.name} (1L) - $${i.juice.price * i.quantity}`).join("\n");
    const optionText = fulfillment === "pickup" ? "Cueillette gratuite sur place (3037 Rue de la Forêt App 26, Québec)" : `Livraison à domicile : ${customerAddress}`;
    const orderSummary = `Bonjour L'Épicurienne By Waycha,\n\nJe souhaite valider ma commande de jus :\n${itemsList}\n\nTotal: $${totalPrice} CAD\nOption: ${optionText}\nClient: ${customerName}\nTéléphone: ${customerPhone}\n${notes ? `Note: ${notes}` : ""}`;

    toast.success(language === "fr" ? "Commande validée ! Redirection en cours..." : "Order verified! Redirecting...");

    if (channel === "sms") {
      const text = encodeURIComponent(orderSummary);
      window.location.href = `sms:8194483630?body=${text}`;
    } else if (channel === "whatsapp") {
      const text = encodeURIComponent(orderSummary);
      window.open(`https://wa.me/18194483630?text=${text}`, "_blank");
    } else if (channel === "email") {
      const subject = encodeURIComponent(`Nouvelle Commande Jus - ${customerName}`);
      const body = encodeURIComponent(orderSummary);
      window.location.href = `mailto:lepicuriennebywaycha@gmail.com?subject=${subject}&body=${body}`;
    }

    setTimeout(() => {
      setIsSubmitting(false);
    }, 3000);
  };

  const contentUI = (
    <div className="flex flex-col h-full overflow-hidden bg-[#080808] text-white">
      {/* Header */}
      <div className="p-5 border-b border-white/10 flex items-center justify-between shrink-0 bg-[#0a0a0a]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-primary/10 border border-primary/30 text-primary">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-primary block">
              {language === "fr" ? "Commande Sécurisée & Envoi Direct" : "Secure Order & Direct Submission"}
            </span>
            <h3 className="text-xl font-serif text-white font-medium">
              {language === "fr" ? "Votre Commande de Nectars" : "Your Juice Basket"}
            </h3>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-full p-2 text-white/70 hover:text-white bg-white/5 hover:bg-white/15 border border-white/10 transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Body Section */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
        {/* Cart Items List */}
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center justify-between">
            <span>{language === "fr" ? "1. Vos Boissons Sélectionnées" : "1. Selected Drinks"}</span>
            <span className="text-primary font-serif text-sm font-bold">${totalPrice} CAD</span>
          </h4>

          {errors.cart && (
            <div className="mb-3 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errors.cart}</span>
            </div>
          )}

          {cart.length === 0 ? (
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 text-center text-white/60 text-sm">
              {language === "fr" ? "Votre panier est vide. Veuillez sélectionner un jus ci-dessous." : "Your basket is empty. Please select a juice below."}
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map(({ juice, quantity }) => (
                <div key={juice.id} className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={juice.image} alt={juice.name} className="w-12 h-14 object-cover rounded-xl border border-white/10 shrink-0" />
                    <div className="min-w-0">
                      <h5 className="text-sm font-serif font-medium text-white truncate">{juice.name}</h5>
                      <span className="text-xs text-primary font-semibold">${juice.price} CAD / 1L</span>
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => updateQuantity(juice.id, -1)}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
                      aria-label="Réduire quantité"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-sm font-bold w-6 text-center">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(juice.id, 1)}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
                      aria-label="Augmenter quantité"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add More Juices Quick Selector */}
        <div>
          <span className="text-xs font-bold text-white/80 uppercase tracking-wider block mb-2">
            {language === "fr" ? "+ Ajouter une autre bouteille" : "+ Add another bottle"}
          </span>
          <div className="flex flex-wrap gap-2">
            {allJuices
              .filter((j) => !cart.some((c) => c.juice.id === j.id))
              .map((j) => (
                <button
                  key={j.id}
                  type="button"
                  onClick={() => addJuiceToCart(j)}
                  className="text-xs bg-white/[0.05] hover:bg-primary/20 hover:border-primary/40 border border-white/10 px-3 py-1.5 rounded-xl text-white/80 transition-colors flex items-center gap-1.5 cursor-pointer min-h-[36px]"
                >
                  <Plus className="w-3 h-3 text-primary" />
                  {j.name} (${j.price})
                </button>
              ))}
          </div>
        </div>

        {/* Fulfillment Choice (Pickup vs Delivery) */}
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2.5">
            {language === "fr" ? "2. Mode de Récupération" : "2. Delivery / Pickup"}
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                setFulfillment("pickup");
                setErrors((prev) => ({ ...prev, address: undefined }));
              }}
              className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                fulfillment === "pickup"
                  ? "bg-primary/15 border-primary text-white"
                  : "bg-white/[0.03] border-white/10 text-white/70 hover:border-white/20"
              }`}
            >
              <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold block text-white">Cueillette Gratuite</span>
                <span className="text-[11px] text-white/60 leading-tight block">3037 Rue de la Forêt App 26, Québec</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setFulfillment("delivery")}
              className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                fulfillment === "delivery"
                  ? "bg-primary/15 border-primary text-white"
                  : "bg-white/[0.03] border-white/10 text-white/70 hover:border-white/20"
              }`}
            >
              <Truck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold block text-white">Livraison Locale</span>
                <span className="text-[11px] text-white/60 leading-tight block">Québec & environs</span>
              </div>
            </button>
          </div>
        </div>

        {/* Customer Information Inputs with STRICT Validation */}
        <div className="space-y-4 pt-2">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            {language === "fr" ? "3. Vos Coordonnées (Obligatoires)" : "3. Customer Information (Required)"}
          </h4>

          {/* Name Field */}
          <div>
            <label className="text-xs font-bold text-white/80 block mb-1 uppercase tracking-wider flex items-center justify-between">
              <span>{language === "fr" ? "Votre Nom Complet *" : "Your Full Name *"}</span>
              {errors.name && <span className="text-red-400 text-[11px] font-normal">{errors.name}</span>}
            </label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => {
                setCustomerName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              placeholder="ex. Ndeye Diop"
              className={`w-full bg-white/[0.05] border rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none transition-colors ${
                errors.name ? "border-red-500 bg-red-500/10 focus:border-red-400" : "border-white/15 focus:border-primary"
              }`}
            />
          </div>

          {/* Phone Field */}
          <div>
            <label className="text-xs font-bold text-white/80 block mb-1 uppercase tracking-wider flex items-center justify-between">
              <span>{language === "fr" ? "Téléphone (10 chiffres) *" : "Phone Number *"}</span>
              {errors.phone && <span className="text-red-400 text-[11px] font-normal">{errors.phone}</span>}
            </label>
            <input
              type="tel"
              required
              value={customerPhone}
              onChange={(e) => {
                setCustomerPhone(e.target.value);
                if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
              }}
              placeholder="ex. 819-448-3630"
              className={`w-full bg-white/[0.05] border rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none transition-colors ${
                errors.phone ? "border-red-500 bg-red-500/10 focus:border-red-400" : "border-white/15 focus:border-primary"
              }`}
            />
          </div>

          {/* Address Field if Delivery */}
          {fulfillment === "delivery" && (
            <div>
              <label className="text-xs font-bold text-white/80 block mb-1 uppercase tracking-wider flex items-center justify-between">
                <span>{language === "fr" ? "Adresse de Livraison à Québec *" : "Delivery Address *"}</span>
                {errors.address && <span className="text-red-400 text-[11px] font-normal">{errors.address}</span>}
              </label>
              <input
                type="text"
                required
                value={customerAddress}
                onChange={(e) => {
                  setCustomerAddress(e.target.value);
                  if (errors.address) setErrors((prev) => ({ ...prev, address: undefined }));
                }}
                placeholder="ex. 3037 Rue de la Forêt, Québec"
                className={`w-full bg-white/[0.05] border rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none transition-colors ${
                  errors.address ? "border-red-500 bg-red-500/10 focus:border-red-400" : "border-white/15 focus:border-primary"
                }`}
              />
            </div>
          )}

          {/* Security & Data Protection Guarantee Badge */}
          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 flex items-start gap-3 text-xs text-white/60">
            <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              {language === "fr"
                ? "🔒 Vos données sont protégées (Loi 25 Québec). Elles sont utilisées uniquement par L'Épicurienne pour valider votre commande."
                : "🔒 Your data is protected (Quebec Law 25). Used exclusively by L'Épicurienne to process your order."}
            </p>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Order Actions */}
      <div className="p-4 md:p-5 border-t border-white/10 bg-[#0a0a0a] shrink-0 space-y-2.5">
        <div className="flex items-center justify-between text-sm mb-1 px-1">
          <span className="text-white/70 font-light">Total de la commande :</span>
          <span className="text-xl font-serif font-bold text-primary">${totalPrice} CAD</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {/* SMS Direct Button */}
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => executeOrderSubmission("sms")}
            className="w-full btn-cinematic justify-center text-xs py-3.5 flex items-center gap-2 cursor-pointer disabled:opacity-50 min-h-[44px]"
          >
            <MessageSquare className="w-4 h-4" />
            Commander par SMS (819-448-3630)
          </button>

          {/* WhatsApp Direct Button */}
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => executeOrderSubmission("whatsapp")}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors disabled:opacity-50 min-h-[44px]"
          >
            <Phone className="w-4 h-4" />
            Commander via WhatsApp
          </button>
        </div>

        {/* Secondary Email Option */}
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => executeOrderSubmission("email")}
          className="w-full text-white/60 hover:text-white text-xs py-2 flex items-center justify-center gap-1.5 transition-colors cursor-pointer min-h-[36px]"
        >
          <Mail className="w-3.5 h-3.5" />
          Envoyer par Courriel (lepicuriennebywaycha@gmail.com)
        </button>
      </div>
    </div>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
        <DialogContent className="max-w-2xl h-[88vh] max-h-[780px] bg-[#080808] border border-primary/30 text-white rounded-3xl p-0 overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.95)] backdrop-blur-3xl [&>button]:hidden">
          {contentUI}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={(o) => !o && onClose()}>
      <DrawerContent className="bg-[#080808] border-t border-primary/30 text-white rounded-t-[2.5rem] h-[92vh] max-h-[92vh] flex flex-col focus:outline-none overflow-hidden">
        {contentUI}
      </DrawerContent>
    </Drawer>
  );
}
