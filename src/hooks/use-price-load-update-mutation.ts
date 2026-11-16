import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/client";
import { PriceLoadQueryKeys } from "@/lib/query/price-load.query";
import {
  type PriceLoadUpdateRequest,
  PriceLoadService,
} from "@/services/portal/v1/price-load.service";

function usePriceLoadUpdateMutation() {
  return useMutation({
    mutationFn: (request: PriceLoadUpdateRequest) =>
      PriceLoadService.update(request),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: PriceLoadQueryKeys.all() }),
  });
}

export { usePriceLoadUpdateMutation };
