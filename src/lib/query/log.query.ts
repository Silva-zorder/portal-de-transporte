import { queryOptions } from "@tanstack/react-query";
import {
  type LogFetchAllRequest,
  type LogFindByIdRequest,
  LogService,
} from "@/services/portal/v1/log.service";

type LogFetchAllQueryDeps = LogFetchAllRequest;
type LogFindByIdQueryDeps = LogFindByIdRequest;

const LogQueryKeys = {
  all: () => ["log"] as const,
  fetchAll: ({ filters }: LogFetchAllQueryDeps = {}) =>
    ["log", "fetch-all", filters ?? {}] as const,
  findById: ({ id }: LogFindByIdQueryDeps) =>
    ["log", "find-by-id", id] as const,
} as const;

const LogQueryOptions = {
  fetchAll: ({ filters }: LogFetchAllQueryDeps = {}) =>
    queryOptions({
      queryKey: LogQueryKeys.fetchAll({ filters }),
      queryFn: () => LogService.fetchAll({ filters }),
    }),
  findById: ({ id }: LogFindByIdQueryDeps) =>
    queryOptions({
      queryKey: LogQueryKeys.findById({ id }),
      queryFn: () => LogService.findById({ id }),
    }),
} as const;

export {
  type LogFetchAllQueryDeps,
  type LogFindByIdQueryDeps,
  LogQueryKeys,
  LogQueryOptions,
};
