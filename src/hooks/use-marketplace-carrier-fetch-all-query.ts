import { useQuery } from "@tanstack/react-query";
import {
  type MarketplaceCarrierFetchAllQueryDeps,
  MarketplaceCarrierQueryOptions,
} from "@/lib/query/marketplace-carrier.query";

function useMarketplaceCarrierFetchAllQuery({ filters }: MarketplaceCarrierFetchAllQueryDeps = {}) {
  return useQuery(MarketplaceCarrierQueryOptions.fetchAll({ filters }));
}

export { useMarketplaceCarrierFetchAllQuery };
