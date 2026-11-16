import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/client";
import { PriceFeeQueryKeys } from "@/lib/query/price-fee.query";
import {
  type PriceFeeRemoveRequest,
  PriceFeeService,
} from "@/services/portal/v1/price-fee.service";

function usePriceFeeRemoveMutation() {
  return useMutation({
    mutationFn: (request: PriceFeeRemoveRequest) =>
      PriceFeeService.remove(request),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: PriceFeeQueryKeys.all() }),
  });
}

export { usePriceFeeRemoveMutation };
