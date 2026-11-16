import { api } from "./api";

type CarrierService = {
  id: number;
  acronym: string;
  name: string;
  carrierName: string;
  cnpj: string;
  tarAcronym: string;
  freightTimeout: number;
  active: boolean;
};

type CarrierServiceFetchAllRequest = { filters?: Partial<CarrierService> };
type CarrierServiceFetchAllResponse = CarrierService[];
type CarrierServiceFindByIdRequest = Pick<CarrierService, "id">;
type CarrierServiceFindByIdResponse = CarrierService;
type CarrierServiceCreateRequest = Omit<CarrierService, "id">;
type CarrierServiceCreateResponse = CarrierService;
type CarrierServiceUpdateRequest = Pick<CarrierService, "id"> & Partial<CarrierService>;
type CarrierServiceUpdateResponse = CarrierService;
type CarrierServiceRemoveRequest = Pick<CarrierService, "id">;

const CarrierServiceService = {
  fetchAll: async ({ filters }: CarrierServiceFetchAllRequest = {}) => {
    const res = await api.get<CarrierServiceFetchAllResponse>("/carrier-services", {
      params: filters,
    });
    return res.data;
  },
  findById: async ({ id }: CarrierServiceFindByIdRequest) => {
    const res = await api.get<CarrierServiceFindByIdResponse>(
      "/carrier-services/:id".replace(":id", String(id)),
    );
    return res.data;
  },
  create: async (request: CarrierServiceCreateRequest) => {
    const res = await api.post<CarrierServiceCreateResponse>("/carrier-services", request);
    return res.data;
  },
  update: async ({ id, ...changes }: CarrierServiceUpdateRequest) => {
    const res = await api.put<CarrierServiceUpdateResponse>(
      "/carrier-services/:id".replace(":id", String(id)),
      changes,
    );
    return res.data;
  },
  remove: async ({ id }: CarrierServiceRemoveRequest) => {
    await api.delete("/carrier-services/:id".replace(":id", String(id)));
  },
} as const;

export {
  type CarrierService,
  type CarrierServiceCreateRequest,
  type CarrierServiceCreateResponse,
  type CarrierServiceFetchAllRequest,
  type CarrierServiceFetchAllResponse,
  type CarrierServiceFindByIdRequest,
  type CarrierServiceFindByIdResponse,
  type CarrierServiceRemoveRequest,
  CarrierServiceService,
  type CarrierServiceUpdateRequest,
  type CarrierServiceUpdateResponse,
};
