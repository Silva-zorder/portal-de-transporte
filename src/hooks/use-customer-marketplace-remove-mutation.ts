import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/client";
import { CustomerMarketplaceQueryKeys } from "@/lib/query/customer-marketplace.query";
import {
  type CustomerMarketplaceRemoveRequest,
  CustomerMarketplaceService,
} from "@/services/portal/v1/customer-marketplace.service";

function useCustomerMarketplaceRemoveMutation() {
  return useMutation({
    mutationFn: (request: CustomerMarketplaceRemoveRequest) =>
      CustomerMarketplaceService.remove(request),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: CustomerMarketplaceQueryKeys.all() }),
  });
}

export { useCustomerMarketplaceRemoveMutation };
