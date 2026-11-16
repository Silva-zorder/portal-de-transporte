import { queryOptions } from "@tanstack/react-query";
import {
  type CustomerMarketplaceFetchAllRequest,
  type CustomerMarketplaceFindByIdRequest,
  CustomerMarketplaceService,
} from "@/services/portal/v1/customer-marketplace.service";

type CustomerMarketplaceFetchAllQueryDeps = CustomerMarketplaceFetchAllRequest;
type CustomerMarketplaceFindByIdQueryDeps = CustomerMarketplaceFindByIdRequest;

const CustomerMarketplaceQueryKeys = {
  all: () => ["customer-marketplace"] as const,
  fetchAll: ({ filters }: CustomerMarketplaceFetchAllQueryDeps = {}) =>
    ["customer-marketplace", "fetch-all", filters ?? {}] as const,
  findById: ({ id }: CustomerMarketplaceFindByIdQueryDeps) =>
    ["customer-marketplace", "find-by-id", id] as const,
} as const;

const CustomerMarketplaceQueryOptions = {
  fetchAll: ({ filters }: CustomerMarketplaceFetchAllQueryDeps = {}) =>
    queryOptions({
      queryKey: CustomerMarketplaceQueryKeys.fetchAll({ filters }),
      queryFn: () => CustomerMarketplaceService.fetchAll({ filters }),
    }),
  findById: ({ id }: CustomerMarketplaceFindByIdQueryDeps) =>
    queryOptions({
      queryKey: CustomerMarketplaceQueryKeys.findById({ id }),
      queryFn: () => CustomerMarketplaceService.findById({ id }),
    }),
} as const;

export {
  type CustomerMarketplaceFetchAllQueryDeps,
  type CustomerMarketplaceFindByIdQueryDeps,
  CustomerMarketplaceQueryKeys,
  CustomerMarketplaceQueryOptions,
};
