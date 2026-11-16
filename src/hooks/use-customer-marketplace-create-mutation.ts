import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/client";
import { CustomerMarketplaceQueryKeys } from "@/lib/query/customer-marketplace.query";
import {
  type CustomerMarketplaceCreateRequest,
  CustomerMarketplaceService,
} from "@/services/portal/v1/customer-marketplace.service";

function useCustomerMarketplaceCreateMutation() {
  return useMutation({
    mutationFn: (request: CustomerMarketplaceCreateRequest) =>
      CustomerMarketplaceService.create(request),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: CustomerMarketplaceQueryKeys.all() }),
  });
}

export { useCustomerMarketplaceCreateMutation };
