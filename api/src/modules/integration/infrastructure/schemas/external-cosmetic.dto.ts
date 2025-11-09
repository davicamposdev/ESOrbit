export interface ExternalCosmeticDTO {
  id: string;
  name: string;
  description: string;
  type: {
    value: string;
  };
  rarity: {
    value: string;
  };
  images: {
    smallIcon?: string;
    icon?: string;
    featured?: string;
    small: string;
    large: string;
    other?: Record<string, string>;
  };
  added: string;
  set?: {
    value: string;
    text: string;
    backendValue: string;
  };
}

export interface ExternalCosmeticsResponse {
  status: number;
  data: Record<string, ExternalCosmeticDTO[]>;
}

export interface ExternalNewCosmeticsResponse {
  status: number;
  data: {
    date: string;
    build: string;
    previousBuild: string;
    hashes: Record<string, string>;
    lastAdditions: Record<string, string>;
    items: Record<string, ExternalCosmeticDTO[]>;
  };
}

export interface ExternalShopEntry {
  regularPrice: number;
  finalPrice: number;
  brItems?: ExternalCosmeticDTO[];
}

export interface ExternalShopResponse {
  status: number;
  data: {
    hash: string;
    date: string;
    vbuckIcon: string;
    entries: ExternalShopEntry[];
  };
}
