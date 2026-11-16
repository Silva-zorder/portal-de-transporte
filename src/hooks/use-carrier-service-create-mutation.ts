import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/client";
import { CarrierServiceQueryKeys } from "@/lib/query/carrier-service.query";
import {
  type CarrierServiceCreateRequest,
  CarrierServiceService,
} from "@/services/portal/v1/carrier-service.service";

function useCarrierServiceCreateMutation() {
  return useMutation({
    mutationFn: (request: CarrierServiceCreateRequest) =>
      CarrierServiceService.create(request),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: CarrierServiceQueryKeys.all() }),
  });
}

export { useCarrierServiceCreateMutation };
