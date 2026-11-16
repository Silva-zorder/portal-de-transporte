import { queryOptions } from "@tanstack/react-query";
import {
  type MarketplaceCarrierFetchAllRequest,
  type MarketplaceCarrierFindByIdRequest,
  MarketplaceCarrierService,
} from "@/services/portal/v1/marketplace-carrier.service";

type MarketplaceCarrierFetchAllQueryDeps = MarketplaceCarrierFetchAllRequest;
type MarketplaceCarrierFindByIdQueryDeps = MarketplaceCarrierFindByIdRequest;

const MarketplaceCarrierQueryKeys = {
  all: () => ["marketplace-carrier"] as const,
  fetchAll: ({ filters }: MarketplaceCarrierFetchAllQueryDeps = {}) =>
    ["marketplace-carrier", "fetch-all", filters ?? {}] as const,
  findById: ({ id }: MarketplaceCarrierFindByIdQueryDeps) =>
    ["marketplace-carrier", "find-by-id", id] as const,
} as const;

const MarketplaceCarrierQueryOptions = {
  fetchAll: ({ filters }: MarketplaceCarrierFetchAllQueryDeps = {}) =>
    queryOptions({
      queryKey: MarketplaceCarrierQueryKeys.fetchAll({ filters }),
      queryFn: () => MarketplaceCarrierService.fetchAll({ filters }),
    }),
  findById: ({ id }: MarketplaceCarrierFindByIdQueryDeps) =>
    queryOptions({
      queryKey: MarketplaceCarrierQueryKeys.findById({ id }),
      queryFn: () => MarketplaceCarrierService.findById({ id }),
    }),
} as const;

export {
  type MarketplaceCarrierFetchAllQueryDeps,
  type MarketplaceCarrierFindByIdQueryDeps,
  MarketplaceCarrierQueryKeys,
  MarketplaceCarrierQueryOptions,
};
