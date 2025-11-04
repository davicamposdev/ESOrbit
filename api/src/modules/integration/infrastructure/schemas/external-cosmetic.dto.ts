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
    other?: Record<string, string>;
  };
  added: string;
  set?: {
    items?: string[];
  };
}

export interface ExternalCosmeticsResponse {
  status: number;
  data: Record<string, ExternalCosmeticDTO[]>;
}

export interface ExternalNewCosmeticsResponse {
  status: number;
  data: {
    items: ExternalCosmeticDTO[];
  };
}
