import { api } from "./api";

type MarketplaceCarrier = {
  id: number;
  customerMarketplaceId: number;
  carrierService: string;
  marketplaceCode: string;
  active: boolean;
};

type MarketplaceCarrierFetchAllRequest = { filters?: Partial<MarketplaceCarrier> };
type MarketplaceCarrierFetchAllResponse = MarketplaceCarrier[];
type MarketplaceCarrierFindByIdRequest = Pick<MarketplaceCarrier, "id">;
type MarketplaceCarrierFindByIdResponse = MarketplaceCarrier;
type MarketplaceCarrierCreateRequest = Omit<MarketplaceCarrier, "id">;
type MarketplaceCarrierCreateResponse = MarketplaceCarrier;
type MarketplaceCarrierUpdateRequest = Pick<MarketplaceCarrier, "id"> & Partial<MarketplaceCarrier>;
type MarketplaceCarrierUpdateResponse = MarketplaceCarrier;
type MarketplaceCarrierRemoveRequest = Pick<MarketplaceCarrier, "id">;

const MarketplaceCarrierService = {
  fetchAll: async ({ filters }: MarketplaceCarrierFetchAllRequest = {}) => {
    const res = await api.get<MarketplaceCarrierFetchAllResponse>("/marketplace-carriers", {
      params: filters,
    });
    return res.data;
  },
  findById: async ({ id }: MarketplaceCarrierFindByIdRequest) => {
    const res = await api.get<MarketplaceCarrierFindByIdResponse>(
      "/marketplace-carriers/:id".replace(":id", String(id)),
    );
    return res.data;
  },
  create: async (request: MarketplaceCarrierCreateRequest) => {
    const res = await api.post<MarketplaceCarrierCreateResponse>("/marketplace-carriers", request);
    return res.data;
  },
  update: async ({ id, ...changes }: MarketplaceCarrierUpdateRequest) => {
    const res = await api.put<MarketplaceCarrierUpdateResponse>(
      "/marketplace-carriers/:id".replace(":id", String(id)),
      changes,
    );
    return res.data;
  },
  remove: async ({ id }: MarketplaceCarrierRemoveRequest) => {
    await api.delete("/marketplace-carriers/:id".replace(":id", String(id)));
  },
} as const;

export {
  type MarketplaceCarrier,
  type MarketplaceCarrierCreateRequest,
  type MarketplaceCarrierCreateResponse,
  type MarketplaceCarrierFetchAllRequest,
  type MarketplaceCarrierFetchAllResponse,
  type MarketplaceCarrierFindByIdRequest,
  type MarketplaceCarrierFindByIdResponse,
  type MarketplaceCarrierRemoveRequest,
  MarketplaceCarrierService,
  type MarketplaceCarrierUpdateRequest,
  type MarketplaceCarrierUpdateResponse,
};
