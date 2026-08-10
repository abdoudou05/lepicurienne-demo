import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTitle, DrawerDescription, DrawerClose } from "@/components/ui/drawer";
import { ShieldCheck, FileText, Lock, Building, Phone, Mail, MapPin, X } from "lucide-react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface LegalModalProps {
  open: boolean;
  onClose: () => void;
  initialTab?: "legal" | "privacy";
  language: "fr" | "en";
}

export function LegalModal({ open, onClose, initialTab = "legal", language }: LegalModalProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [activeTab, setActiveTab] = useState<"legal" | "privacy">(initialTab);

  if (!open) return null;

  const contentUI = (
    <div className="flex flex-col h-full overflow-hidden bg-[#080808] text-white">
      {/* Modal Header */}
      <div className="p-5 border-b border-white/10 flex items-center justify-between shrink-0 bg-[#0a0a0a]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-primary/10 border border-primary/30 text-primary">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-primary block">
              {language === "fr" ? "Transparence & Protection" : "Transparency & Protection"}
            </span>
            <h3 className="text-xl font-serif text-white font-medium">
              {activeTab === "legal"
                ? language === "fr"
                  ? "Mentions Légales"
                  : "Legal Notice"
                : language === "fr"
                ? "Politique de Confidentialité"
                : "Privacy Policy"}
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

      {/* Tab Switcher */}
      <div className="flex border-b border-white/10 bg-[#060606] px-5 py-2 shrink-0 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("legal")}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === "legal"
              ? "bg-primary text-black shadow-md shadow-primary/20"
              : "bg-white/[0.04] text-white/70 hover:text-white hover:bg-white/10"
          }`}
        >
          <FileText className="w-4 h-4" />
          {language === "fr" ? "Mentions Légales" : "Legal Notice"}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("privacy")}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === "privacy"
              ? "bg-primary text-black shadow-md shadow-primary/20"
              : "bg-white/[0.04] text-white/70 hover:text-white hover:bg-white/10"
          }`}
        >
          <Lock className="w-4 h-4" />
          {language === "fr" ? "Confidentialité & Données" : "Privacy & Data"}
        </button>
      </div>

      {/* Scrollable Document Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-white/80 font-light leading-relaxed custom-scrollbar">
        {activeTab === "legal" ? (
          /* MENTIONS LÉGALES */
          <div className="space-y-6">
            <section className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
              <h4 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-2">
                <Building className="w-4 h-4" />
                {language === "fr" ? "1. Éditeur de l'Entreprise" : "1. Business Publisher"}
              </h4>
              <p className="text-white/90">
                Le présent site est édité par l'entreprise artisanale <strong>L'Épicurienne By Waycha</strong>, sous la direction de la fondatrice <strong>Ndeye Astou Dieng (Aïcha)</strong>.
              </p>
              <div className="pt-2 text-xs space-y-1 text-white/70 border-t border-white/5 mt-2">
                <p className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                  <strong>Point de retrait & Adresse :</strong> 3037 Rue de la Forêt App 26, Québec, QC, Canada
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-primary shrink-0" />
                  <strong>Téléphone :</strong> 819-448-3630
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-primary shrink-0" />
                  <strong>Courriel :</strong> lepicuriennebywaycha@gmail.com
                </p>
              </div>
            </section>

            <section className="space-y-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                {language === "fr" ? "2. Conception & Réalisation Technique" : "2. Design & Technical Execution"}
              </h4>
              <p>
                Le site internet a été conçu et développé avec passion par <strong><a href="https://webryk.ca" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Webryk Studio</a></strong> (Québec, Canada).
              </p>
            </section>

            <section className="space-y-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                {language === "fr" ? "3. Propriété Intellectuelle" : "3. Intellectual Property"}
              </h4>
              <p>
                L'ensemble des visuels, recettes, photographies des boissons, affiches d'information et contenus textuels présents sur ce site constituent des œuvres originales protégées par les lois sur la propriété intellectuelle au Canada. Toute reproduction partielle ou totale sans autorisation écrite préalable est strictement interdite.
              </p>
            </section>

            <section className="space-y-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                {language === "fr" ? "4. Produits & Tarification" : "4. Products & Pricing"}
              </h4>
              <p>
                Les prix indiqués ($ CAD) correspondent aux tarifs réels en vigueur pour les bouteilles de 1 Litre de nectars naturels artisanaux. L'Épicurienne By Waycha se réserve le droit d'adapter ses tarifs en fonction de la disponibilité saisonnière des fruits sauvages importés.
              </p>
            </section>
          </div>
        ) : (
          /* POLITIQUE DE CONFIDENTIALITÉ */
          <div className="space-y-6">
            <section className="p-4 rounded-2xl bg-primary/10 border border-primary/25 text-primary text-xs space-y-1.5">
              <div className="flex items-center gap-2 font-bold uppercase tracking-wider">
                <Lock className="w-4 h-4 shrink-0" />
                {language === "fr" ? "Engagement Strict de Confidentialité" : "Strict Privacy Commitment"}
              </div>
              <p className="text-white/90 font-light leading-relaxed">
                {language === "fr"
                  ? "Conformément à la Loi 25 du Québec sur la protection des renseignements personnels, nous traitons vos données personnelles avec la plus stricte confidentialité. Aucune donnée n'est revendue ni partagée à des tiers."
                  : "In accordance with Quebec Law 25 on personal information protection, we process your personal data with strict confidentiality. No data is ever sold or shared with third parties."}
              </p>
            </section>

            <section className="space-y-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                {language === "fr" ? "1. Données Collectées & Usage" : "1. Collected Data & Purpose"}
              </h4>
              <p>
                Lorsque vous effectuez une demande de commande via notre module sécurisé, nous traitons uniquement les informations indispensables à l'exécution de votre commande :
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs text-white/70">
                <li>Votre nom complet (pour identifier votre commande).</li>
                <li>Votre numéro de téléphone (pour valider le retrait ou la livraison par SMS/Appel).</li>
                <li>Votre adresse de livraison (uniquement en cas de livraison à domicile).</li>
                <li>Le détail des jus sélectionnés et vos instructions particulières.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                {language === "fr" ? "2. Absence de Traçage Publicitaire" : "2. No Advertising Tracking"}
              </h4>
              <p>
                Ce site n'utilise aucun cookie tiers à visée publicitaire ni aucun traqueur commercial. Seule la préférence linguistique (Français/Anglais) est enregistrée localement dans la mémoire de votre navigateur (`localStorage`) pour vous offrir un confort de visite optimal.
              </p>
            </section>

            <section className="space-y-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                {language === "fr" ? "3. Vos Droits & Modification" : "3. Your Rights & Modifications"}
              </h4>
              <p>
                Vous bénéficiez à tout moment d'un droit d'accès, de rectification et de suppression de vos renseignements personnels. Pour toute demande liée à vos données, contactez-nous directement à : <strong>lepicuriennebywaycha@gmail.com</strong> ou au <strong>819-448-3630</strong>.
              </p>
            </section>
          </div>
        )}
      </div>
    </div>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
        <DialogContent className="max-w-3xl h-[82vh] max-h-[700px] bg-[#080808] border border-primary/30 text-white rounded-3xl p-0 overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.95)] backdrop-blur-3xl [&>button]:hidden">
          {contentUI}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={(o) => !o && onClose()}>
      <DrawerContent className="bg-[#080808] border-t border-primary/30 text-white rounded-t-[2.5rem] h-[90vh] max-h-[90vh] flex flex-col focus:outline-none overflow-hidden">
        {contentUI}
      </DrawerContent>
    </Drawer>
  );
}
