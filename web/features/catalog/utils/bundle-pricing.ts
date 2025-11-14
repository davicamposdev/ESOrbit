import { type BundleItem } from "../services";

export interface BundlePricing {
  basePrice: number;
  currentPrice: number;
  hasDiscount: boolean;
  discount: number;
  discountPercentage: number;
}

export function calculateBundlePricing(items: BundleItem[]): BundlePricing {
  let basePrice = 0;
  let currentPrice = 0;

  items.forEach((item) => {
    if (item.basePrice !== null) {
      basePrice += item.basePrice;
    }

    if (item.currentPrice !== null) {
      currentPrice += item.currentPrice;
    }
  });

  const hasDiscount = basePrice > currentPrice;
  const discount = hasDiscount ? basePrice - currentPrice : 0;
  const discountPercentage =
    hasDiscount && basePrice > 0 ? Math.round((discount / basePrice) * 100) : 0;

  return {
    basePrice,
    currentPrice,
    hasDiscount,
    discount,
    discountPercentage,
  };
}

export function formatPrice(price: number): string {
  return `${price.toLocaleString("pt-BR")} V-Bucks`;
}
