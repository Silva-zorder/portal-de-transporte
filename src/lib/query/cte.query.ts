import { queryOptions } from "@tanstack/react-query";
import {
  type CteFetchAllRequest,
  type CteFindByIdRequest,
  CteService,
} from "@/services/portal/v1/cte.service";

type CteFetchAllQueryDeps = CteFetchAllRequest;
type CteFindByIdQueryDeps = CteFindByIdRequest;

const CteQueryKeys = {
  all: () => ["cte"] as const,
  fetchAll: ({ filters }: CteFetchAllQueryDeps = {}) =>
    ["cte", "fetch-all", filters ?? {}] as const,
  findById: ({ id }: CteFindByIdQueryDeps) =>
    ["cte", "find-by-id", id] as const,
} as const;

const CteQueryOptions = {
  fetchAll: ({ filters }: CteFetchAllQueryDeps = {}) =>
    queryOptions({
      queryKey: CteQueryKeys.fetchAll({ filters }),
      queryFn: () => CteService.fetchAll({ filters }),
    }),
  findById: ({ id }: CteFindByIdQueryDeps) =>
    queryOptions({
      queryKey: CteQueryKeys.findById({ id }),
      queryFn: () => CteService.findById({ id }),
    }),
} as const;

export {
  type CteFetchAllQueryDeps,
  type CteFindByIdQueryDeps,
  CteQueryKeys,
  CteQueryOptions,
};
