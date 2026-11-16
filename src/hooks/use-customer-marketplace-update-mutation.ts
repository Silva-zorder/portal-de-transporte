import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/client";
import { CustomerMarketplaceQueryKeys } from "@/lib/query/customer-marketplace.query";
import {
  type CustomerMarketplaceUpdateRequest,
  CustomerMarketplaceService,
} from "@/services/portal/v1/customer-marketplace.service";

function useCustomerMarketplaceUpdateMutation() {
  return useMutation({
    mutationFn: (request: CustomerMarketplaceUpdateRequest) =>
      CustomerMarketplaceService.update(request),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: CustomerMarketplaceQueryKeys.all() }),
  });
}

export { useCustomerMarketplaceUpdateMutation };
