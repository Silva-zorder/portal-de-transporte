import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/client";
import { CarrierQueryKeys } from "@/lib/query/carrier.query";
import {
  type CarrierUpdateRequest,
  CarrierService,
} from "@/services/portal/v1/carrier.service";

function useCarrierUpdateMutation() {
  return useMutation({
    mutationFn: (request: CarrierUpdateRequest) =>
      CarrierService.update(request),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: CarrierQueryKeys.all() }),
  });
}

export { useCarrierUpdateMutation };
