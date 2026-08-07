import React from "react";
import { JuiceItem } from "@/types/product";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerClose } from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle2, Sparkles, X } from "lucide-react";
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
        <DialogContent className="max-w-4xl bg-black/95 border-primary/30 text-white rounded-3xl p-0 overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.9)] backdrop-blur-2xl">
          <div className="grid grid-cols-12 min-h-[520px]">
            {/* Left Column: Image & Radial Glow */}
            <div className="col-span-5 relative flex items-center justify-center p-8 overflow-hidden bg-gradient-to-br from-black/90 to-black">
              <div className={`absolute inset-0 bg-gradient-to-t ${juice.color} mix-blend-multiply opacity-40`} />
              <div className="absolute top-4 left-4 z-10">
                <Badge className="bg-black/80 text-white border border-white/20 backdrop-blur-md px-3 py-1 font-semibold text-xs">
                  {juice.volume}
                </Badge>
              </div>
              <div className="absolute top-4 right-4 z-10">
                <Badge className="bg-primary text-black font-bold text-base px-3.5 py-1 shadow-lg shadow-primary/30 border-none">
                  {juice.formattedPrice}
                </Badge>
              </div>
              <img
                src={juice.image}
                alt={juice.name}
                className="relative z-10 max-h-[380px] w-auto object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.9)] hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Right Column: Detailed Product Card Content */}
            <div className="col-span-7 p-8 flex flex-col justify-between border-l border-white/10">
              <div>
                <DialogHeader className="p-0 space-y-1 mb-4 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-primary">
                      {juice.tagline}
                    </span>
                    {juice.badge && (
                      <Badge variant="outline" className="border-primary/40 text-primary text-[10px] px-2.5 py-0.5">
                        {juice.badge}
                      </Badge>
                    )}
                  </div>
                  <DialogTitle className="text-3xl lg:text-4xl font-serif text-white font-normal mt-1">
                    {juice.name}
                  </DialogTitle>
                </DialogHeader>

                <DialogDescription className="text-white/70 text-sm leading-relaxed mb-6 font-light">
                  {juice.longDescription}
                </DialogDescription>

                {/* Taste Profile Box */}
                <div className="mb-5 p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
                  <span className="text-xs font-bold text-primary block mb-1 uppercase tracking-wider">Profil Dégustation</span>
                  <p className="text-xs text-white/80 italic">{juice.tasteProfile}</p>
                </div>

                {/* Authentic Ingredients List */}
                <div className="mb-5">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2.5">Ingrédients Authentiques</h4>
                  <div className="flex flex-wrap gap-2">
                    {juice.ingredients.map((ing) => (
                      <span key={ing} className="text-xs bg-white/[0.05] border border-white/10 px-2.5 py-1 rounded-md text-white/80 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Health Benefits Badges */}
                <div className="mb-6">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2.5">Bienfaits pour la Santé</h4>
                  <div className="flex flex-wrap gap-2">
                    {juice.healthBenefits.map((benefit) => (
                      <Badge key={benefit} className="bg-primary/15 text-primary border border-primary/30 text-xs py-1 px-3">
                        <Sparkles className="w-3 h-3 mr-1 text-primary shrink-0" />
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Primary CTA Button */}
              <button
                type="button"
                onClick={handleOrderClick}
                aria-label={`Commander ${juice.name} (${juice.formattedPrice})`}
                className="w-full btn-cinematic justify-center text-sm py-3.5 flex items-center gap-2 cursor-pointer min-h-[44px]"
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
      <DrawerContent className="bg-[#0a0a0a] border-t border-primary/30 text-white rounded-t-[2.5rem] max-h-[88vh] focus:outline-none">
        <DrawerClose asChild>
          <button
            type="button"
            className="absolute top-4 right-4 z-20 rounded-full min-h-[44px] min-w-[44px] inline-flex items-center justify-center p-2 text-white/70 hover:text-white hover:bg-white/10 focus:outline-none transition-colors cursor-pointer"
            aria-label="Fermer la fiche détaillée"
          >
            <X className="w-5 h-5" />
          </button>
        </DrawerClose>
        <div className="p-6 overflow-y-auto space-y-5">
          <DrawerHeader className="p-0 text-left pr-8">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-primary block mb-0.5">
                  {juice.tagline}
                </span>
                <DrawerTitle className="text-2xl font-serif text-white font-normal">
                  {juice.name}
                </DrawerTitle>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Badge className="bg-primary text-black font-bold text-sm px-3 py-1 border-none">
                  {juice.formattedPrice}
                </Badge>
                <Badge variant="outline" className="border-white/20 text-white/70 text-[10px]">
                  {juice.volume}
                </Badge>
              </div>
            </div>
          </DrawerHeader>

          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-black/60 border border-white/10 flex items-center justify-center">
            <div className={`absolute inset-0 bg-gradient-to-t ${juice.color} opacity-30`} />
            <img src={juice.image} alt={juice.name} className="h-full w-auto object-contain py-4 relative z-10 drop-shadow-xl" />
          </div>

          <DrawerDescription className="text-white/80 text-sm leading-relaxed font-light">
            {juice.longDescription}
          </DrawerDescription>

          <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
            <span className="text-xs font-bold text-primary block mb-1 uppercase tracking-wider">Profil Dégustation</span>
            <p className="text-xs text-white/80 italic">{juice.tasteProfile}</p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Ingrédients Authentiques</h4>
            <div className="flex flex-wrap gap-1.5">
              {juice.ingredients.map((ing) => (
                <span key={ing} className="text-xs bg-white/[0.06] border border-white/10 px-2.5 py-1 rounded-md text-white/80 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-primary shrink-0" />
                  {ing}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Bienfaits pour la Santé</h4>
            <div className="flex flex-wrap gap-1.5">
              {juice.healthBenefits.map((b) => (
                <Badge key={b} className="bg-primary/20 text-primary border border-primary/30 text-xs py-1 px-2.5">
                  <Sparkles className="w-3 h-3 mr-1 text-primary shrink-0" />
                  {b}
                </Badge>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleOrderClick}
            aria-label={`Commander ${juice.name} (${juice.formattedPrice})`}
            className="w-full btn-cinematic justify-center text-sm py-4 flex items-center gap-2 mt-4 cursor-pointer min-h-[44px]"
          >
            {orderCtaText} ({juice.formattedPrice}) <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

