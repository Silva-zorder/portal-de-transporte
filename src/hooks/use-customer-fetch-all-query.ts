import { useQuery } from "@tanstack/react-query";
import {
  type CustomerFetchAllQueryDeps,
  CustomerQueryOptions,
} from "@/lib/query/customer.query";

function useCustomerFetchAllQuery({ filters }: CustomerFetchAllQueryDeps = {}) {
  return useQuery(CustomerQueryOptions.fetchAll({ filters }));
}

export { useCustomerFetchAllQuery };
