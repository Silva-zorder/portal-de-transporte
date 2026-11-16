import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/client";
import { PriceFeeQueryKeys } from "@/lib/query/price-fee.query";
import {
  type PriceFeeUpdateRequest,
  PriceFeeService,
} from "@/services/portal/v1/price-fee.service";

function usePriceFeeUpdateMutation() {
  return useMutation({
    mutationFn: (request: PriceFeeUpdateRequest) =>
      PriceFeeService.update(request),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: PriceFeeQueryKeys.all() }),
  });
}

export { usePriceFeeUpdateMutation };
