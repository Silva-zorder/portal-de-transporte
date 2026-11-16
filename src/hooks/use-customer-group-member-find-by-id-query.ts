import { useQuery } from "@tanstack/react-query";
import {
  type CustomerGroupMemberFindByIdQueryDeps,
  CustomerGroupMemberQueryOptions,
} from "@/lib/query/customer-group-member.query";

function useCustomerGroupMemberFindByIdQuery({ id }: CustomerGroupMemberFindByIdQueryDeps) {
  return useQuery(CustomerGroupMemberQueryOptions.findById({ id }));
}

export { useCustomerGroupMemberFindByIdQuery };
