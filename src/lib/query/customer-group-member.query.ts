import { queryOptions } from "@tanstack/react-query";
import {
  type CustomerGroupMemberFetchAllRequest,
  type CustomerGroupMemberFindByIdRequest,
  CustomerGroupMemberService,
} from "@/services/portal/v1/customer-group-member.service";

type CustomerGroupMemberFetchAllQueryDeps = CustomerGroupMemberFetchAllRequest;
type CustomerGroupMemberFindByIdQueryDeps = CustomerGroupMemberFindByIdRequest;

const CustomerGroupMemberQueryKeys = {
  all: () => ["customer-group-member"] as const,
  fetchAll: ({ filters }: CustomerGroupMemberFetchAllQueryDeps = {}) =>
    ["customer-group-member", "fetch-all", filters ?? {}] as const,
  findById: ({ id }: CustomerGroupMemberFindByIdQueryDeps) =>
    ["customer-group-member", "find-by-id", id] as const,
} as const;

const CustomerGroupMemberQueryOptions = {
  fetchAll: ({ filters }: CustomerGroupMemberFetchAllQueryDeps = {}) =>
    queryOptions({
      queryKey: CustomerGroupMemberQueryKeys.fetchAll({ filters }),
      queryFn: () => CustomerGroupMemberService.fetchAll({ filters }),
    }),
  findById: ({ id }: CustomerGroupMemberFindByIdQueryDeps) =>
    queryOptions({
      queryKey: CustomerGroupMemberQueryKeys.findById({ id }),
      queryFn: () => CustomerGroupMemberService.findById({ id }),
    }),
} as const;

export {
  type CustomerGroupMemberFetchAllQueryDeps,
  type CustomerGroupMemberFindByIdQueryDeps,
  CustomerGroupMemberQueryKeys,
  CustomerGroupMemberQueryOptions,
};
