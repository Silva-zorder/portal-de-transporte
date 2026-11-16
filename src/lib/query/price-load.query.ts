import { queryOptions } from "@tanstack/react-query";
import {
  type PriceLoadFetchAllRequest,
  type PriceLoadFindByIdRequest,
  PriceLoadService,
} from "@/services/portal/v1/price-load.service";

type PriceLoadFetchAllQueryDeps = PriceLoadFetchAllRequest;
type PriceLoadFindByIdQueryDeps = PriceLoadFindByIdRequest;

const PriceLoadQueryKeys = {
  all: () => ["price-load"] as const,
  fetchAll: ({ filters }: PriceLoadFetchAllQueryDeps = {}) =>
    ["price-load", "fetch-all", filters ?? {}] as const,
  findById: ({ id }: PriceLoadFindByIdQueryDeps) =>
    ["price-load", "find-by-id", id] as const,
} as const;

const PriceLoadQueryOptions = {
  fetchAll: ({ filters }: PriceLoadFetchAllQueryDeps = {}) =>
    queryOptions({
      queryKey: PriceLoadQueryKeys.fetchAll({ filters }),
      queryFn: () => PriceLoadService.fetchAll({ filters }),
    }),
  findById: ({ id }: PriceLoadFindByIdQueryDeps) =>
    queryOptions({
      queryKey: PriceLoadQueryKeys.findById({ id }),
      queryFn: () => PriceLoadService.findById({ id }),
    }),
} as const;

export {
  type PriceLoadFetchAllQueryDeps,
  type PriceLoadFindByIdQueryDeps,
  PriceLoadQueryKeys,
  PriceLoadQueryOptions,
};
