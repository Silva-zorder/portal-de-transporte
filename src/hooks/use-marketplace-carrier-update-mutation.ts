import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/client";
import { MarketplaceCarrierQueryKeys } from "@/lib/query/marketplace-carrier.query";
import {
  type MarketplaceCarrierUpdateRequest,
  MarketplaceCarrierService,
} from "@/services/portal/v1/marketplace-carrier.service";

function useMarketplaceCarrierUpdateMutation() {
  return useMutation({
    mutationFn: (request: MarketplaceCarrierUpdateRequest) =>
      MarketplaceCarrierService.update(request),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: MarketplaceCarrierQueryKeys.all() }),
  });
}

export { useMarketplaceCarrierUpdateMutation };
