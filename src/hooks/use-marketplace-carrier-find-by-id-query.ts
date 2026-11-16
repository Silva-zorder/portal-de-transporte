import { useQuery } from "@tanstack/react-query";
import {
  type MarketplaceCarrierFindByIdQueryDeps,
  MarketplaceCarrierQueryOptions,
} from "@/lib/query/marketplace-carrier.query";

function useMarketplaceCarrierFindByIdQuery({ id }: MarketplaceCarrierFindByIdQueryDeps) {
  return useQuery(MarketplaceCarrierQueryOptions.findById({ id }));
}

export { useMarketplaceCarrierFindByIdQuery };
