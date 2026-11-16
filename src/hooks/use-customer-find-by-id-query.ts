import { useQuery } from "@tanstack/react-query";
import {
  type CustomerFindByIdQueryDeps,
  CustomerQueryOptions,
} from "@/lib/query/customer.query";

function useCustomerFindByIdQuery({ id }: CustomerFindByIdQueryDeps) {
  return useQuery(CustomerQueryOptions.findById({ id }));
}

export { useCustomerFindByIdQuery };
