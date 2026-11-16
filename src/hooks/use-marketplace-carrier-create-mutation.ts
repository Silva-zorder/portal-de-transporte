import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/client";
import { MarketplaceCarrierQueryKeys } from "@/lib/query/marketplace-carrier.query";
import {
  type MarketplaceCarrierCreateRequest,
  MarketplaceCarrierService,
} from "@/services/portal/v1/marketplace-carrier.service";

function useMarketplaceCarrierCreateMutation() {
  return useMutation({
    mutationFn: (request: MarketplaceCarrierCreateRequest) =>
      MarketplaceCarrierService.create(request),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: MarketplaceCarrierQueryKeys.all() }),
  });
}

export { useMarketplaceCarrierCreateMutation };
