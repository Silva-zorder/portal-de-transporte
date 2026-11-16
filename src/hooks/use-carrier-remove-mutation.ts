import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/client";
import { CarrierQueryKeys } from "@/lib/query/carrier.query";
import {
  type CarrierRemoveRequest,
  CarrierService,
} from "@/services/portal/v1/carrier.service";

function useCarrierRemoveMutation() {
  return useMutation({
    mutationFn: (request: CarrierRemoveRequest) =>
      CarrierService.remove(request),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: CarrierQueryKeys.all() }),
  });
}

export { useCarrierRemoveMutation };
