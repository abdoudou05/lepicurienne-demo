import React from "react";
import { JuiceItem } from "@/types/product";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerClose } from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle2, HeartPulse, Sparkles, X, Droplets, Leaf } from "lucide-react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface JuiceDetailModalProps {
  juice: JuiceItem | null;
  onClose: () => void;
  orderCtaText: string;
}

export function JuiceDetailModal({ juice, onClose, orderCtaText }: JuiceDetailModalProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (!juice) return null;

  const handleOrderClick = () => {
    onClose();
    setTimeout(() => {
      const contactSection = document.getElementById("contact");
      contactSection?.scrollIntoView({ behavior: "smooth" });
    }, 150);
  };

  if (isDesktop) {
    return (
      <Dialog open={!!juice} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-5xl h-[88vh] max-h-[720px] bg-[#060606] border border-primary/30 text-white rounded-3xl p-0 overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.95)] backdrop-blur-3xl flex flex-col [&>button]:hidden">
          <div className="grid grid-cols-12 h-full w-full overflow-hidden">
            {/* Left Column: Large Readable Flyer View */}
            <div className="col-span-5 relative h-full bg-gradient-to-b from-black via-[#0a0a0a] to-black p-4 flex items-center justify-center border-r border-white/10 overflow-hidden">
              {/* Floating Badges */}
              <div className="absolute top-4 left-4 z-20">
                <Badge className="bg-black/80 text-white border border-white/20 backdrop-blur-md px-3 py-1 font-semibold text-xs shadow-md">
                  {juice.volume}
                </Badge>
              </div>
              <div className="absolute top-4 right-4 z-20">
                <Badge className="bg-primary text-black font-bold text-sm px-3.5 py-1 shadow-lg shadow-primary/30 border-none">
                  {juice.formattedPrice}
                </Badge>
              </div>

              {/* Full Flyer Display */}
              <div className="w-full h-full flex items-center justify-center p-2">
                <img
                  src={juice.image}
                  alt={juice.name}
                  className="h-full w-auto max-w-full object-contain rounded-xl shadow-2xl hover:scale-[1.01] transition-transform duration-500"
                />
              </div>
            </div>

            {/* Right Column: Structured Details & Sticky CTA */}
            <div className="col-span-7 h-full flex flex-col justify-between bg-[#0a0a0a] p-6 lg:p-8 overflow-hidden relative">
              {/* Custom Top Header & Close Button */}
              <div className="flex items-start justify-between gap-4 pb-3 border-b border-white/10 shrink-0">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-primary flex items-center gap-1.5 mb-1">
                    <Leaf className="w-3.5 h-3.5" />
                    {juice.tagline}
                  </span>
                  <DialogTitle className="text-3xl font-serif text-white font-normal leading-tight">
                    {juice.name}
                  </DialogTitle>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full p-2.5 text-white/70 hover:text-white bg-white/5 hover:bg-white/15 border border-white/10 transition-colors cursor-pointer shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label="Fermer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Content Body */}
              <div className="flex-1 overflow-y-auto py-4 pr-2 space-y-5 custom-scrollbar">
                <DialogDescription className="text-white/80 text-sm leading-relaxed font-light">
                  {juice.longDescription}
                </DialogDescription>

                {/* Taste Profile Box */}
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start gap-3">
                  <Droplets className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-primary block mb-0.5 uppercase tracking-wider">Profil Dégustation</span>
                    <p className="text-xs text-white/80 italic leading-relaxed">{juice.tasteProfile}</p>
                  </div>
                </div>

                {/* Health Benefits */}
                <div>
                  <div className="flex items-center gap-2 mb-2.5">
                    <HeartPulse className="w-4 h-4 text-primary shrink-0" />
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Bienfaits Santé Exceptionnels</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {juice.healthBenefits.map((benefit) => (
                      <div key={benefit} className="bg-primary/10 border border-primary/25 text-primary text-xs py-2 px-3 rounded-xl flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span className="font-medium leading-tight">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ingredients */}
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Ingrédients 100% Naturels</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {juice.ingredients.map((ing) => (
                      <span key={ing} className="text-xs bg-white/[0.05] border border-white/10 px-2.5 py-1 rounded-lg text-white/80 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* ALWAYS VISIBLE STICKY FOOTER CTA */}
              <div className="pt-4 border-t border-white/10 bg-[#0a0a0a] z-20 shrink-0">
                <button
                  type="button"
                  onClick={handleOrderClick}
                  aria-label={`Commander ${juice.name} (${juice.formattedPrice})`}
                  className="w-full btn-cinematic justify-center text-sm py-4 flex items-center gap-2 cursor-pointer min-h-[48px] shadow-lg shadow-primary/20"
                >
                  {orderCtaText} ({juice.formattedPrice}) <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={!!juice} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="bg-[#080808] border-t border-primary/30 text-white rounded-t-[2.5rem] h-[92vh] max-h-[92vh] flex flex-col focus:outline-none overflow-hidden">
        {/* Mobile Header with Close Button */}
        <div className="px-6 pt-5 pb-3 border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="min-w-0 pr-2">
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-primary flex items-center gap-1.5 truncate">
              <Leaf className="w-3 h-3 shrink-0" />
              {juice.tagline}
            </span>
            <DrawerTitle className="text-xl font-serif text-white font-normal truncate">
              {juice.name}
            </DrawerTitle>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Badge className="bg-primary text-black font-bold text-xs px-2.5 py-1 border-none">
              {juice.formattedPrice}
            </Badge>
            <DrawerClose asChild>
              <button
                type="button"
                className="rounded-full p-2 text-white/70 hover:text-white bg-white/10 border border-white/10 transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </DrawerClose>
          </div>
        </div>

        {/* Mobile Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* High Res Flyer Container */}
          <div className="w-full rounded-2xl overflow-hidden bg-black border border-white/10 flex items-center justify-center p-2 min-h-[260px] max-h-[360px]">
            <img
              src={juice.image}
              alt={juice.name}
              className="max-h-[340px] w-auto max-w-full object-contain rounded-xl shadow-xl"
            />
          </div>

          {/* Description */}
          <DrawerDescription className="text-white/80 text-sm leading-relaxed font-light">
            {juice.longDescription}
          </DrawerDescription>

          {/* Taste Profile */}
          <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 flex items-start gap-2.5">
            <Droplets className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold text-primary block mb-0.5 uppercase tracking-wider">Profil Dégustation</span>
              <p className="text-xs text-white/80 italic leading-relaxed">{juice.tasteProfile}</p>
            </div>
          </div>

          {/* Health Benefits */}
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <HeartPulse className="w-4 h-4 text-primary shrink-0" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Bienfaits Santé</h4>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {juice.healthBenefits.map((b) => (
                <div key={b} className="bg-primary/10 border border-primary/30 text-primary text-xs py-2 px-3 rounded-xl flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span className="font-medium">{b}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Ingredients */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Ingrédients 100% Naturels</h4>
            <div className="flex flex-wrap gap-1.5">
              {juice.ingredients.map((ing) => (
                <span key={ing} className="text-xs bg-white/[0.06] border border-white/10 px-2.5 py-1.5 rounded-lg text-white/80 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                  {ing}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile ALWAYS VISIBLE STICKY FOOTER CTA */}
        <div className="p-4 border-t border-white/10 bg-[#080808] shrink-0 z-20">
          <button
            type="button"
            onClick={handleOrderClick}
            aria-label={`Commander ${juice.name} (${juice.formattedPrice})`}
            className="w-full btn-cinematic justify-center text-sm py-4 flex items-center gap-2 cursor-pointer min-h-[48px] shadow-lg shadow-primary/20"
          >
            {orderCtaText} ({juice.formattedPrice}) <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
