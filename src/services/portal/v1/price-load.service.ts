import { api } from "./api";

type PriceLoad = {
  id: number;
  priceTableId: number;
  tariffAcronym: string;
  weightLimit: number;
  value: number;
};

type PriceLoadFetchAllRequest = { filters?: Partial<PriceLoad> };
type PriceLoadFetchAllResponse = PriceLoad[];
type PriceLoadFindByIdRequest = Pick<PriceLoad, "id">;
type PriceLoadFindByIdResponse = PriceLoad;
type PriceLoadCreateRequest = Omit<PriceLoad, "id">;
type PriceLoadCreateResponse = PriceLoad;
type PriceLoadUpdateRequest = Pick<PriceLoad, "id"> & Partial<PriceLoad>;
type PriceLoadUpdateResponse = PriceLoad;
type PriceLoadRemoveRequest = Pick<PriceLoad, "id">;

const PriceLoadService = {
  fetchAll: async ({ filters }: PriceLoadFetchAllRequest = {}) => {
    const res = await api.get<PriceLoadFetchAllResponse>("/price-loads", {
      params: filters,
    });
    return res.data;
  },
  findById: async ({ id }: PriceLoadFindByIdRequest) => {
    const res = await api.get<PriceLoadFindByIdResponse>(
      "/price-loads/:id".replace(":id", String(id)),
    );
    return res.data;
  },
  create: async (request: PriceLoadCreateRequest) => {
    const res = await api.post<PriceLoadCreateResponse>("/price-loads", request);
    return res.data;
  },
  update: async ({ id, ...changes }: PriceLoadUpdateRequest) => {
    const res = await api.put<PriceLoadUpdateResponse>(
      "/price-loads/:id".replace(":id", String(id)),
      changes,
    );
    return res.data;
  },
  remove: async ({ id }: PriceLoadRemoveRequest) => {
    await api.delete("/price-loads/:id".replace(":id", String(id)));
  },
} as const;

export {
  type PriceLoad,
  type PriceLoadCreateRequest,
  type PriceLoadCreateResponse,
  type PriceLoadFetchAllRequest,
  type PriceLoadFetchAllResponse,
  type PriceLoadFindByIdRequest,
  type PriceLoadFindByIdResponse,
  type PriceLoadRemoveRequest,
  PriceLoadService,
  type PriceLoadUpdateRequest,
  type PriceLoadUpdateResponse,
};
