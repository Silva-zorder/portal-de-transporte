import { useQuery } from "@tanstack/react-query";
import {
  type CustomerGroupFetchAllQueryDeps,
  CustomerGroupQueryOptions,
} from "@/lib/query/customer-group.query";

function useCustomerGroupFetchAllQuery({ filters }: CustomerGroupFetchAllQueryDeps = {}) {
  return useQuery(CustomerGroupQueryOptions.fetchAll({ filters }));
}

export { useCustomerGroupFetchAllQuery };
