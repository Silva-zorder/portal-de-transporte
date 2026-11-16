import { api } from "./api";

type Log = {
  id: number;
  action: string;
  table: string;
  user: string;
  dbUser: string;
  date: string;
  data: string;
  changes: string;
};

type LogFetchAllRequest = { filters?: Partial<Log> };
type LogFetchAllResponse = Log[];
type LogFindByIdRequest = Pick<Log, "id">;
type LogFindByIdResponse = Log;
type LogCreateRequest = Omit<Log, "id">;
type LogCreateResponse = Log;
type LogUpdateRequest = Pick<Log, "id"> & Partial<Log>;
type LogUpdateResponse = Log;
type LogRemoveRequest = Pick<Log, "id">;

const LogService = {
  fetchAll: async ({ filters }: LogFetchAllRequest = {}) => {
    const res = await api.get<LogFetchAllResponse>("/logs", {
      params: filters,
    });
    return res.data;
  },
  findById: async ({ id }: LogFindByIdRequest) => {
    const res = await api.get<LogFindByIdResponse>(
      "/logs/:id".replace(":id", String(id)),
    );
    return res.data;
  },
  create: async (request: LogCreateRequest) => {
    const res = await api.post<LogCreateResponse>("/logs", request);
    return res.data;
  },
  update: async ({ id, ...changes }: LogUpdateRequest) => {
    const res = await api.put<LogUpdateResponse>(
      "/logs/:id".replace(":id", String(id)),
      changes,
    );
    return res.data;
  },
  remove: async ({ id }: LogRemoveRequest) => {
    await api.delete("/logs/:id".replace(":id", String(id)));
  },
} as const;

export {
  type Log,
  type LogCreateRequest,
  type LogCreateResponse,
  type LogFetchAllRequest,
  type LogFetchAllResponse,
  type LogFindByIdRequest,
  type LogFindByIdResponse,
  type LogRemoveRequest,
  LogService,
  type LogUpdateRequest,
  type LogUpdateResponse,
};
