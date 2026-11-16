import { useQuery } from "@tanstack/react-query";
import {
  type CustomerGroupMemberFetchAllQueryDeps,
  CustomerGroupMemberQueryOptions,
} from "@/lib/query/customer-group-member.query";

function useCustomerGroupMemberFetchAllQuery({ filters }: CustomerGroupMemberFetchAllQueryDeps = {}) {
  return useQuery(CustomerGroupMemberQueryOptions.fetchAll({ filters }));
}

export { useCustomerGroupMemberFetchAllQuery };
