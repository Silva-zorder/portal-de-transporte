import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/client";
import { CarrierServiceQueryKeys } from "@/lib/query/carrier-service.query";
import {
  type CarrierServiceRemoveRequest,
  CarrierServiceService,
} from "@/services/portal/v1/carrier-service.service";

function useCarrierServiceRemoveMutation() {
  return useMutation({
    mutationFn: (request: CarrierServiceRemoveRequest) =>
      CarrierServiceService.remove(request),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: CarrierServiceQueryKeys.all() }),
  });
}

export { useCarrierServiceRemoveMutation };
