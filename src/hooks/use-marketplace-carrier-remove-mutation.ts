import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/client";
import { MarketplaceCarrierQueryKeys } from "@/lib/query/marketplace-carrier.query";
import {
  type MarketplaceCarrierRemoveRequest,
  MarketplaceCarrierService,
} from "@/services/portal/v1/marketplace-carrier.service";

function useMarketplaceCarrierRemoveMutation() {
  return useMutation({
    mutationFn: (request: MarketplaceCarrierRemoveRequest) =>
      MarketplaceCarrierService.remove(request),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: MarketplaceCarrierQueryKeys.all() }),
  });
}

export { useMarketplaceCarrierRemoveMutation };
