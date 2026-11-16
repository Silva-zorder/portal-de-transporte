import { queryOptions } from "@tanstack/react-query";
import {
  type CarrierFetchAllRequest,
  type CarrierFindByIdRequest,
  CarrierService,
} from "@/services/portal/v1/carrier.service";

type CarrierFetchAllQueryDeps = CarrierFetchAllRequest;
type CarrierFindByIdQueryDeps = CarrierFindByIdRequest;

const CarrierQueryKeys = {
  all: () => ["carrier"] as const,
  fetchAll: ({ filters }: CarrierFetchAllQueryDeps = {}) =>
    ["carrier", "fetch-all", filters ?? {}] as const,
  findById: ({ id }: CarrierFindByIdQueryDeps) =>
    ["carrier", "find-by-id", id] as const,
} as const;

const CarrierQueryOptions = {
  fetchAll: ({ filters }: CarrierFetchAllQueryDeps = {}) =>
    queryOptions({
      queryKey: CarrierQueryKeys.fetchAll({ filters }),
      queryFn: () => CarrierService.fetchAll({ filters }),
    }),
  findById: ({ id }: CarrierFindByIdQueryDeps) =>
    queryOptions({
      queryKey: CarrierQueryKeys.findById({ id }),
      queryFn: () => CarrierService.findById({ id }),
    }),
} as const;

export {
  type CarrierFetchAllQueryDeps,
  type CarrierFindByIdQueryDeps,
  CarrierQueryKeys,
  CarrierQueryOptions,
};
