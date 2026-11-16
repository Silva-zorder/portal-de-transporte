import { api } from "./api";

type PriceTable = {
  id: number;
  name: string;
  carrierService: string;
  type: string;
  platform: string;
  sharedPlatforms: string;
  valueLimit: number;
  minWeight: number;
  weightLimit: number;
  heightLimit: number;
  widthLimit: number;
  lengthLimit: number;
  active: boolean;
};

type PriceTableFetchAllRequest = { filters?: Partial<PriceTable> };
type PriceTableFetchAllResponse = PriceTable[];
type PriceTableFindByIdRequest = Pick<PriceTable, "id">;
type PriceTableFindByIdResponse = PriceTable;
type PriceTableCreateRequest = Omit<PriceTable, "id">;
type PriceTableCreateResponse = PriceTable;
type PriceTableUpdateRequest = Pick<PriceTable, "id"> & Partial<PriceTable>;
type PriceTableUpdateResponse = PriceTable;
type PriceTableRemoveRequest = Pick<PriceTable, "id">;

const PriceTableService = {
  fetchAll: async ({ filters }: PriceTableFetchAllRequest = {}) => {
    const res = await api.get<PriceTableFetchAllResponse>("/price-tables", {
      params: filters,
    });
    return res.data;
  },
  findById: async ({ id }: PriceTableFindByIdRequest) => {
    const res = await api.get<PriceTableFindByIdResponse>(
      "/price-tables/:id".replace(":id", String(id)),
    );
    return res.data;
  },
  create: async (request: PriceTableCreateRequest) => {
    const res = await api.post<PriceTableCreateResponse>("/price-tables", request);
    return res.data;
  },
  update: async ({ id, ...changes }: PriceTableUpdateRequest) => {
    const res = await api.put<PriceTableUpdateResponse>(
      "/price-tables/:id".replace(":id", String(id)),
      changes,
    );
    return res.data;
  },
  remove: async ({ id }: PriceTableRemoveRequest) => {
    await api.delete("/price-tables/:id".replace(":id", String(id)));
  },
} as const;

export {
  type PriceTable,
  type PriceTableCreateRequest,
  type PriceTableCreateResponse,
  type PriceTableFetchAllRequest,
  type PriceTableFetchAllResponse,
  type PriceTableFindByIdRequest,
  type PriceTableFindByIdResponse,
  type PriceTableRemoveRequest,
  PriceTableService,
  type PriceTableUpdateRequest,
  type PriceTableUpdateResponse,
};
