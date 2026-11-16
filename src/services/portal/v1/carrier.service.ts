import { api } from "./api";

type Carrier = {
  id: number;
  name: string;
  partner: boolean;
  active: boolean;
};

type CarrierFetchAllRequest = { filters?: Partial<Carrier> };
type CarrierFetchAllResponse = Carrier[];
type CarrierFindByIdRequest = Pick<Carrier, "id">;
type CarrierFindByIdResponse = Carrier;
type CarrierCreateRequest = Omit<Carrier, "id">;
type CarrierCreateResponse = Carrier;
type CarrierUpdateRequest = Pick<Carrier, "id"> & Partial<Carrier>;
type CarrierUpdateResponse = Carrier;
type CarrierRemoveRequest = Pick<Carrier, "id">;

const CarrierService = {
  fetchAll: async ({ filters }: CarrierFetchAllRequest = {}) => {
    const res = await api.get<CarrierFetchAllResponse>("/carriers", {
      params: filters,
    });
    return res.data;
  },
  findById: async ({ id }: CarrierFindByIdRequest) => {
    const res = await api.get<CarrierFindByIdResponse>(
      "/carriers/:id".replace(":id", String(id)),
    );
    return res.data;
  },
  create: async (request: CarrierCreateRequest) => {
    const res = await api.post<CarrierCreateResponse>("/carriers", request);
    return res.data;
  },
  update: async ({ id, ...changes }: CarrierUpdateRequest) => {
    const res = await api.put<CarrierUpdateResponse>(
      "/carriers/:id".replace(":id", String(id)),
      changes,
    );
    return res.data;
  },
  remove: async ({ id }: CarrierRemoveRequest) => {
    await api.delete("/carriers/:id".replace(":id", String(id)));
  },
} as const;

export {
  type Carrier,
  type CarrierCreateRequest,
  type CarrierCreateResponse,
  type CarrierFetchAllRequest,
  type CarrierFetchAllResponse,
  type CarrierFindByIdRequest,
  type CarrierFindByIdResponse,
  type CarrierRemoveRequest,
  CarrierService,
  type CarrierUpdateRequest,
  type CarrierUpdateResponse,
};
