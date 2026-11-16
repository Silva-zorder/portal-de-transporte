import { queryOptions } from "@tanstack/react-query";
import {
  type PriceTableFetchAllRequest,
  type PriceTableFindByIdRequest,
  PriceTableService,
} from "@/services/portal/v1/price-table.service";

type PriceTableFetchAllQueryDeps = PriceTableFetchAllRequest;
type PriceTableFindByIdQueryDeps = PriceTableFindByIdRequest;

const PriceTableQueryKeys = {
  all: () => ["price-table"] as const,
  fetchAll: ({ filters }: PriceTableFetchAllQueryDeps = {}) =>
    ["price-table", "fetch-all", filters ?? {}] as const,
  findById: ({ id }: PriceTableFindByIdQueryDeps) =>
    ["price-table", "find-by-id", id] as const,
} as const;

const PriceTableQueryOptions = {
  fetchAll: ({ filters }: PriceTableFetchAllQueryDeps = {}) =>
    queryOptions({
      queryKey: PriceTableQueryKeys.fetchAll({ filters }),
      queryFn: () => PriceTableService.fetchAll({ filters }),
    }),
  findById: ({ id }: PriceTableFindByIdQueryDeps) =>
    queryOptions({
      queryKey: PriceTableQueryKeys.findById({ id }),
      queryFn: () => PriceTableService.findById({ id }),
    }),
} as const;

export {
  type PriceTableFetchAllQueryDeps,
  type PriceTableFindByIdQueryDeps,
  PriceTableQueryKeys,
  PriceTableQueryOptions,
};
