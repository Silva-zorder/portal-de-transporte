import { api } from "./api";

type MongoSync = {
  id: number;
  status: string;
  requestedAt: string;
  duration: string;
  tables: string;
  filters: string;
};

type MongoSyncFetchAllRequest = { filters?: Partial<MongoSync> };
type MongoSyncFetchAllResponse = MongoSync[];
type MongoSyncFindByIdRequest = Pick<MongoSync, "id">;
type MongoSyncFindByIdResponse = MongoSync;
type MongoSyncCreateRequest = Omit<MongoSync, "id">;
type MongoSyncCreateResponse = MongoSync;
type MongoSyncUpdateRequest = Pick<MongoSync, "id"> & Partial<MongoSync>;
type MongoSyncUpdateResponse = MongoSync;
type MongoSyncRemoveRequest = Pick<MongoSync, "id">;

const MongoSyncService = {
  fetchAll: async ({ filters }: MongoSyncFetchAllRequest = {}) => {
    const res = await api.get<MongoSyncFetchAllResponse>("/mongo-syncs", {
      params: filters,
    });
    return res.data;
  },
  findById: async ({ id }: MongoSyncFindByIdRequest) => {
    const res = await api.get<MongoSyncFindByIdResponse>(
      "/mongo-syncs/:id".replace(":id", String(id)),
    );
    return res.data;
  },
  create: async (request: MongoSyncCreateRequest) => {
    const res = await api.post<MongoSyncCreateResponse>("/mongo-syncs", request);
    return res.data;
  },
  update: async ({ id, ...changes }: MongoSyncUpdateRequest) => {
    const res = await api.put<MongoSyncUpdateResponse>(
      "/mongo-syncs/:id".replace(":id", String(id)),
      changes,
    );
    return res.data;
  },
  remove: async ({ id }: MongoSyncRemoveRequest) => {
    await api.delete("/mongo-syncs/:id".replace(":id", String(id)));
  },
} as const;

export {
  type MongoSync,
  type MongoSyncCreateRequest,
  type MongoSyncCreateResponse,
  type MongoSyncFetchAllRequest,
  type MongoSyncFetchAllResponse,
  type MongoSyncFindByIdRequest,
  type MongoSyncFindByIdResponse,
  type MongoSyncRemoveRequest,
  MongoSyncService,
  type MongoSyncUpdateRequest,
  type MongoSyncUpdateResponse,
};
