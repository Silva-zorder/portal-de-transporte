import { queryOptions } from "@tanstack/react-query";
import {
  type CustomerFetchAllRequest,
  type CustomerFindByIdRequest,
  CustomerService,
} from "@/services/portal/v1/customer.service";

type CustomerFetchAllQueryDeps = CustomerFetchAllRequest;
type CustomerFindByIdQueryDeps = CustomerFindByIdRequest;

const CustomerQueryKeys = {
  all: () => ["customer"] as const,
  fetchAll: ({ filters }: CustomerFetchAllQueryDeps = {}) =>
    ["customer", "fetch-all", filters ?? {}] as const,
  findById: ({ id }: CustomerFindByIdQueryDeps) =>
    ["customer", "find-by-id", id] as const,
} as const;

const CustomerQueryOptions = {
  fetchAll: ({ filters }: CustomerFetchAllQueryDeps = {}) =>
    queryOptions({
      queryKey: CustomerQueryKeys.fetchAll({ filters }),
      queryFn: () => CustomerService.fetchAll({ filters }),
    }),
  findById: ({ id }: CustomerFindByIdQueryDeps) =>
    queryOptions({
      queryKey: CustomerQueryKeys.findById({ id }),
      queryFn: () => CustomerService.findById({ id }),
    }),
} as const;

export {
  type CustomerFetchAllQueryDeps,
  type CustomerFindByIdQueryDeps,
  CustomerQueryKeys,
  CustomerQueryOptions,
};
