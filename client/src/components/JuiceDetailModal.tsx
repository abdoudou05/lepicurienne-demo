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
        <DialogContent className="max-w-4xl bg-[#080808]/98 border border-primary/30 text-white rounded-3xl p-0 overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.95)] backdrop-blur-3xl">
          <div className="grid grid-cols-12 min-h-[540px]">
            {/* Left Column: Full High-Res Flyer View */}
            <div className="col-span-5 relative flex items-center justify-center p-4 bg-gradient-to-b from-black/90 via-[#0a0a0a] to-black overflow-hidden border-r border-white/10">
              <div className="absolute top-4 left-4 z-20 flex gap-2">
                <Badge className="bg-black/80 text-white border border-white/20 backdrop-blur-md px-3 py-1 font-semibold text-xs">
                  {juice.volume}
                </Badge>
                {juice.badge && (
                  <Badge variant="outline" className="border-primary/50 bg-primary/10 text-primary text-xs px-2.5 py-0.5">
                    {juice.badge}
                  </Badge>
                )}
              </div>
              <div className="absolute top-4 right-4 z-20">
                <Badge className="bg-primary text-black font-bold text-base px-3.5 py-1 shadow-lg shadow-primary/30 border-none">
                  {juice.formattedPrice}
                </Badge>
              </div>

              {/* Clean Image View */}
              <div className="relative w-full h-full flex items-center justify-center p-2">
                <img
                  src={juice.image}
                  alt={juice.name}
                  className="max-h-[460px] w-auto max-w-full object-contain rounded-xl shadow-2xl hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
            </div>

            {/* Right Column: Detailed Structured Info */}
            <div className="col-span-7 p-8 flex flex-col justify-between overflow-y-auto max-h-[85vh]">
              <div>
                <DialogHeader className="p-0 space-y-1 mb-5 text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <Leaf className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span className="text-xs uppercase font-bold tracking-[0.25em] text-primary">
                      {juice.tagline}
                    </span>
                  </div>
                  <DialogTitle className="text-3xl lg:text-4xl font-serif text-white font-normal">
                    {juice.name}
                  </DialogTitle>
                </DialogHeader>

                <DialogDescription className="text-white/80 text-sm leading-relaxed mb-6 font-light">
                  {juice.longDescription}
                </DialogDescription>

                {/* Taste Profile Box */}
                <div className="mb-5 p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start gap-3">
                  <Droplets className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-primary block mb-0.5 uppercase tracking-wider">Profil Dégustation</span>
                    <p className="text-xs text-white/80 italic leading-relaxed">{juice.tasteProfile}</p>
                  </div>
                </div>

                {/* Health Benefits */}
                <div className="mb-5">
                  <div className="flex items-center gap-2 mb-3">
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

                {/* Ingredients List */}
                <div className="mb-6">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2.5">Ingrédients 100% Naturels</h4>
                  <div className="flex flex-wrap gap-2">
                    {juice.ingredients.map((ing) => (
                      <span key={ing} className="text-xs bg-white/[0.05] border border-white/10 px-3 py-1.5 rounded-lg text-white/80 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Primary CTA Button */}
              <button
                type="button"
                onClick={handleOrderClick}
                aria-label={`Commander ${juice.name} (${juice.formattedPrice})`}
                className="w-full btn-cinematic justify-center text-sm py-4 flex items-center gap-2 cursor-pointer min-h-[48px] mt-2"
              >
                {orderCtaText} ({juice.formattedPrice}) <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={!!juice} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="bg-[#080808] border-t border-primary/30 text-white rounded-t-[2.5rem] max-h-[92vh] focus:outline-none">
        <DrawerClose asChild>
          <button
            type="button"
            className="absolute top-4 right-4 z-30 rounded-full min-h-[44px] min-w-[44px] inline-flex items-center justify-center p-2 text-white/70 hover:text-white bg-black/60 border border-white/10 backdrop-blur-md transition-colors cursor-pointer"
            aria-label="Fermer la fiche détaillée"
          >
            <X className="w-5 h-5" />
          </button>
        </DrawerClose>

        <div className="p-6 overflow-y-auto space-y-6">
          {/* Header */}
          <DrawerHeader className="p-0 text-left pr-10">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-primary flex items-center gap-1.5">
                <Leaf className="w-3 h-3" />
                {juice.tagline}
              </span>
              <div className="flex items-center justify-between gap-3">
                <DrawerTitle className="text-2xl font-serif text-white font-normal">
                  {juice.name}
                </DrawerTitle>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge className="bg-primary text-black font-bold text-sm px-3 py-1 border-none">
                    {juice.formattedPrice}
                  </Badge>
                  <Badge variant="outline" className="border-white/20 text-white/70 text-[10px]">
                    {juice.volume}
                  </Badge>
                </div>
              </div>
            </div>
          </DrawerHeader>

          {/* High Res Image Container */}
          <div className="relative w-full rounded-2xl overflow-hidden bg-black/80 border border-white/10 flex items-center justify-center p-3">
            <img
              src={juice.image}
              alt={juice.name}
              className="max-h-[320px] w-auto max-w-full object-contain rounded-xl shadow-xl"
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
            <div className="flex items-center gap-2 mb-3">
              <HeartPulse className="w-4 h-4 text-primary shrink-0" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Bienfaits Santé</h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2.5">Ingrédients 100% Naturels</h4>
            <div className="flex flex-wrap gap-1.5">
              {juice.ingredients.map((ing) => (
                <span key={ing} className="text-xs bg-white/[0.06] border border-white/10 px-2.5 py-1.5 rounded-lg text-white/80 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                  {ing}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <button
            type="button"
            onClick={handleOrderClick}
            aria-label={`Commander ${juice.name} (${juice.formattedPrice})`}
            className="w-full btn-cinematic justify-center text-sm py-4 flex items-center gap-2 mt-4 cursor-pointer min-h-[48px]"
          >
            {orderCtaText} ({juice.formattedPrice}) <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
