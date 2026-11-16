import { queryOptions } from "@tanstack/react-query";
import {
  type CarrierServiceFetchAllRequest,
  type CarrierServiceFindByIdRequest,
  CarrierServiceService,
} from "@/services/portal/v1/carrier-service.service";

type CarrierServiceFetchAllQueryDeps = CarrierServiceFetchAllRequest;
type CarrierServiceFindByIdQueryDeps = CarrierServiceFindByIdRequest;

const CarrierServiceQueryKeys = {
  all: () => ["carrier-service"] as const,
  fetchAll: ({ filters }: CarrierServiceFetchAllQueryDeps = {}) =>
    ["carrier-service", "fetch-all", filters ?? {}] as const,
  findById: ({ id }: CarrierServiceFindByIdQueryDeps) =>
    ["carrier-service", "find-by-id", id] as const,
} as const;

const CarrierServiceQueryOptions = {
  fetchAll: ({ filters }: CarrierServiceFetchAllQueryDeps = {}) =>
    queryOptions({
      queryKey: CarrierServiceQueryKeys.fetchAll({ filters }),
      queryFn: () => CarrierServiceService.fetchAll({ filters }),
    }),
  findById: ({ id }: CarrierServiceFindByIdQueryDeps) =>
    queryOptions({
      queryKey: CarrierServiceQueryKeys.findById({ id }),
      queryFn: () => CarrierServiceService.findById({ id }),
    }),
} as const;

export {
  type CarrierServiceFetchAllQueryDeps,
  type CarrierServiceFindByIdQueryDeps,
  CarrierServiceQueryKeys,
  CarrierServiceQueryOptions,
};
