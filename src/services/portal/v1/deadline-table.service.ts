import { api } from "./api";

type DeadlineTable = {
  id: number;
  platform: string;
  carrierService: string;
  name: string;
  sharedPlatforms: string;
  active: boolean;
};

type DeadlineTableFetchAllRequest = { filters?: Partial<DeadlineTable> };
type DeadlineTableFetchAllResponse = DeadlineTable[];
type DeadlineTableFindByIdRequest = Pick<DeadlineTable, "id">;
type DeadlineTableFindByIdResponse = DeadlineTable;
type DeadlineTableCreateRequest = Omit<DeadlineTable, "id">;
type DeadlineTableCreateResponse = DeadlineTable;
type DeadlineTableUpdateRequest = Pick<DeadlineTable, "id"> & Partial<DeadlineTable>;
type DeadlineTableUpdateResponse = DeadlineTable;
type DeadlineTableRemoveRequest = Pick<DeadlineTable, "id">;

const DeadlineTableService = {
  fetchAll: async ({ filters }: DeadlineTableFetchAllRequest = {}) => {
    const res = await api.get<DeadlineTableFetchAllResponse>("/deadline-tables", {
      params: filters,
    });
    return res.data;
  },
  findById: async ({ id }: DeadlineTableFindByIdRequest) => {
    const res = await api.get<DeadlineTableFindByIdResponse>(
      "/deadline-tables/:id".replace(":id", String(id)),
    );
    return res.data;
  },
  create: async (request: DeadlineTableCreateRequest) => {
    const res = await api.post<DeadlineTableCreateResponse>("/deadline-tables", request);
    return res.data;
  },
  update: async ({ id, ...changes }: DeadlineTableUpdateRequest) => {
    const res = await api.put<DeadlineTableUpdateResponse>(
      "/deadline-tables/:id".replace(":id", String(id)),
      changes,
    );
    return res.data;
  },
  remove: async ({ id }: DeadlineTableRemoveRequest) => {
    await api.delete("/deadline-tables/:id".replace(":id", String(id)));
  },
} as const;

export {
  type DeadlineTable,
  type DeadlineTableCreateRequest,
  type DeadlineTableCreateResponse,
  type DeadlineTableFetchAllRequest,
  type DeadlineTableFetchAllResponse,
  type DeadlineTableFindByIdRequest,
  type DeadlineTableFindByIdResponse,
  type DeadlineTableRemoveRequest,
  DeadlineTableService,
  type DeadlineTableUpdateRequest,
  type DeadlineTableUpdateResponse,
};
