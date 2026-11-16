import { useQuery } from "@tanstack/react-query";
import {
  type CustomerGroupFindByIdQueryDeps,
  CustomerGroupQueryOptions,
} from "@/lib/query/customer-group.query";

function useCustomerGroupFindByIdQuery({ id }: CustomerGroupFindByIdQueryDeps) {
  return useQuery(CustomerGroupQueryOptions.findById({ id }));
}

export { useCustomerGroupFindByIdQuery };
