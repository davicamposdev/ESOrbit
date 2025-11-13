import { type BundleItem } from "../services";

export interface BundlePricing {
  basePrice: number;
  currentPrice: number;
  hasDiscount: boolean;
  discount: number;
  discountPercentage: number;
}

/**
 * Calcula os preços de um bundle baseado na soma dos preços de seus itens
 * @param items - Array de itens do bundle
 * @returns Objeto com informações de precificação do bundle
 */
export function calculateBundlePricing(items: BundleItem[]): BundlePricing {
  let basePrice = 0;
  let currentPrice = 0;

  items.forEach((item) => {
    // Soma o basePrice de cada item (preço sem desconto)
    if (item.basePrice !== null) {
      basePrice += item.basePrice;
    }

    // Soma o currentPrice de cada item (preço atual, com desconto se houver)
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

/**
 * Formata o preço para exibição
 * @param price - Preço a ser formatado
 * @returns String formatada com o preço
 */
export function formatPrice(price: number): string {
  return `${price.toLocaleString("pt-BR")} V-Bucks`;
}
