import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/client";
import { PriceFeeQueryKeys } from "@/lib/query/price-fee.query";
import {
  type PriceFeeCreateRequest,
  PriceFeeService,
} from "@/services/portal/v1/price-fee.service";

function usePriceFeeCreateMutation() {
  return useMutation({
    mutationFn: (request: PriceFeeCreateRequest) =>
      PriceFeeService.create(request),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: PriceFeeQueryKeys.all() }),
  });
}

export { usePriceFeeCreateMutation };
