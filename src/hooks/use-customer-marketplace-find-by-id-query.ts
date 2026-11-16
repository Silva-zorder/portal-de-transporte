import { useQuery } from "@tanstack/react-query";
import {
  type CustomerMarketplaceFindByIdQueryDeps,
  CustomerMarketplaceQueryOptions,
} from "@/lib/query/customer-marketplace.query";

function useCustomerMarketplaceFindByIdQuery({ id }: CustomerMarketplaceFindByIdQueryDeps) {
  return useQuery(CustomerMarketplaceQueryOptions.findById({ id }));
}

export { useCustomerMarketplaceFindByIdQuery };
