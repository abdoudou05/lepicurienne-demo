export interface JuiceItem {
  id: string;
  name: string;
  tagline: string;
  price: number;
  formattedPrice: string;
  volume: string;
  description: string;
  longDescription: string;
  tasteProfile: string;
  ingredients: string[];
  healthBenefits: string[];
  image: string;
  color: string;
  badge?: string;
}
