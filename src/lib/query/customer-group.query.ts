import { queryOptions } from "@tanstack/react-query";
import {
  type CustomerGroupFetchAllRequest,
  type CustomerGroupFindByIdRequest,
  CustomerGroupService,
} from "@/services/portal/v1/customer-group.service";

type CustomerGroupFetchAllQueryDeps = CustomerGroupFetchAllRequest;
type CustomerGroupFindByIdQueryDeps = CustomerGroupFindByIdRequest;

const CustomerGroupQueryKeys = {
  all: () => ["customer-group"] as const,
  fetchAll: ({ filters }: CustomerGroupFetchAllQueryDeps = {}) =>
    ["customer-group", "fetch-all", filters ?? {}] as const,
  findById: ({ id }: CustomerGroupFindByIdQueryDeps) =>
    ["customer-group", "find-by-id", id] as const,
} as const;

const CustomerGroupQueryOptions = {
  fetchAll: ({ filters }: CustomerGroupFetchAllQueryDeps = {}) =>
    queryOptions({
      queryKey: CustomerGroupQueryKeys.fetchAll({ filters }),
      queryFn: () => CustomerGroupService.fetchAll({ filters }),
    }),
  findById: ({ id }: CustomerGroupFindByIdQueryDeps) =>
    queryOptions({
      queryKey: CustomerGroupQueryKeys.findById({ id }),
      queryFn: () => CustomerGroupService.findById({ id }),
    }),
} as const;

export {
  type CustomerGroupFetchAllQueryDeps,
  type CustomerGroupFindByIdQueryDeps,
  CustomerGroupQueryKeys,
  CustomerGroupQueryOptions,
};
