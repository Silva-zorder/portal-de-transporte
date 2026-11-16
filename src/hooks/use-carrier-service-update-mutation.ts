import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/client";
import { CarrierServiceQueryKeys } from "@/lib/query/carrier-service.query";
import {
  type CarrierServiceUpdateRequest,
  CarrierServiceService,
} from "@/services/portal/v1/carrier-service.service";

function useCarrierServiceUpdateMutation() {
  return useMutation({
    mutationFn: (request: CarrierServiceUpdateRequest) =>
      CarrierServiceService.update(request),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: CarrierServiceQueryKeys.all() }),
  });
}

export { useCarrierServiceUpdateMutation };
