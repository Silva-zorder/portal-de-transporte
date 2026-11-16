import { useQuery } from "@tanstack/react-query";
import {
  type CustomerMarketplaceFetchAllQueryDeps,
  CustomerMarketplaceQueryOptions,
} from "@/lib/query/customer-marketplace.query";

function useCustomerMarketplaceFetchAllQuery({ filters }: CustomerMarketplaceFetchAllQueryDeps = {}) {
  return useQuery(CustomerMarketplaceQueryOptions.fetchAll({ filters }));
}

export { useCustomerMarketplaceFetchAllQuery };
