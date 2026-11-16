import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/client";
import { PriceLoadQueryKeys } from "@/lib/query/price-load.query";
import {
  type PriceLoadCreateRequest,
  PriceLoadService,
} from "@/services/portal/v1/price-load.service";

function usePriceLoadCreateMutation() {
  return useMutation({
    mutationFn: (request: PriceLoadCreateRequest) =>
      PriceLoadService.create(request),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: PriceLoadQueryKeys.all() }),
  });
}

export { usePriceLoadCreateMutation };
