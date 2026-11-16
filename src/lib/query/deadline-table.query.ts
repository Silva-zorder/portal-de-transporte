import { queryOptions } from "@tanstack/react-query";
import {
  type DeadlineTableFetchAllRequest,
  type DeadlineTableFindByIdRequest,
  DeadlineTableService,
} from "@/services/portal/v1/deadline-table.service";

type DeadlineTableFetchAllQueryDeps = DeadlineTableFetchAllRequest;
type DeadlineTableFindByIdQueryDeps = DeadlineTableFindByIdRequest;

const DeadlineTableQueryKeys = {
  all: () => ["deadline-table"] as const,
  fetchAll: ({ filters }: DeadlineTableFetchAllQueryDeps = {}) =>
    ["deadline-table", "fetch-all", filters ?? {}] as const,
  findById: ({ id }: DeadlineTableFindByIdQueryDeps) =>
    ["deadline-table", "find-by-id", id] as const,
} as const;

const DeadlineTableQueryOptions = {
  fetchAll: ({ filters }: DeadlineTableFetchAllQueryDeps = {}) =>
    queryOptions({
      queryKey: DeadlineTableQueryKeys.fetchAll({ filters }),
      queryFn: () => DeadlineTableService.fetchAll({ filters }),
    }),
  findById: ({ id }: DeadlineTableFindByIdQueryDeps) =>
    queryOptions({
      queryKey: DeadlineTableQueryKeys.findById({ id }),
      queryFn: () => DeadlineTableService.findById({ id }),
    }),
} as const;

export {
  type DeadlineTableFetchAllQueryDeps,
  type DeadlineTableFindByIdQueryDeps,
  DeadlineTableQueryKeys,
  DeadlineTableQueryOptions,
};
