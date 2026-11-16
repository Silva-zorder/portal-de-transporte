import { queryOptions } from "@tanstack/react-query";
import {
  type PriceFeeFetchAllRequest,
  type PriceFeeFindByIdRequest,
  PriceFeeService,
} from "@/services/portal/v1/price-fee.service";

type PriceFeeFetchAllQueryDeps = PriceFeeFetchAllRequest;
type PriceFeeFindByIdQueryDeps = PriceFeeFindByIdRequest;

const PriceFeeQueryKeys = {
  all: () => ["price-fee"] as const,
  fetchAll: ({ filters }: PriceFeeFetchAllQueryDeps = {}) =>
    ["price-fee", "fetch-all", filters ?? {}] as const,
  findById: ({ id }: PriceFeeFindByIdQueryDeps) =>
    ["price-fee", "find-by-id", id] as const,
} as const;

const PriceFeeQueryOptions = {
  fetchAll: ({ filters }: PriceFeeFetchAllQueryDeps = {}) =>
    queryOptions({
      queryKey: PriceFeeQueryKeys.fetchAll({ filters }),
      queryFn: () => PriceFeeService.fetchAll({ filters }),
    }),
  findById: ({ id }: PriceFeeFindByIdQueryDeps) =>
    queryOptions({
      queryKey: PriceFeeQueryKeys.findById({ id }),
      queryFn: () => PriceFeeService.findById({ id }),
    }),
} as const;

export {
  type PriceFeeFetchAllQueryDeps,
  type PriceFeeFindByIdQueryDeps,
  PriceFeeQueryKeys,
  PriceFeeQueryOptions,
};
