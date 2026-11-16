import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/client";
import { CarrierQueryKeys } from "@/lib/query/carrier.query";
import {
  type CarrierCreateRequest,
  CarrierService,
} from "@/services/portal/v1/carrier.service";

function useCarrierCreateMutation() {
  return useMutation({
    mutationFn: (request: CarrierCreateRequest) =>
      CarrierService.create(request),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: CarrierQueryKeys.all() }),
  });
}

export { useCarrierCreateMutation };
