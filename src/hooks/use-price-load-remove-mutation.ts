import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/client";
import { PriceLoadQueryKeys } from "@/lib/query/price-load.query";
import {
  type PriceLoadRemoveRequest,
  PriceLoadService,
} from "@/services/portal/v1/price-load.service";

function usePriceLoadRemoveMutation() {
  return useMutation({
    mutationFn: (request: PriceLoadRemoveRequest) =>
      PriceLoadService.remove(request),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: PriceLoadQueryKeys.all() }),
  });
}

export { usePriceLoadRemoveMutation };
