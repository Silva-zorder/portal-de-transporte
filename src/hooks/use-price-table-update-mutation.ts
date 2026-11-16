import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/client";
import { PriceTableQueryKeys } from "@/lib/query/price-table.query";
import {
  type PriceTableUpdateRequest,
  PriceTableService,
} from "@/services/portal/v1/price-table.service";

function usePriceTableUpdateMutation() {
  return useMutation({
    mutationFn: (request: PriceTableUpdateRequest) =>
      PriceTableService.update(request),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: PriceTableQueryKeys.all() }),
  });
}

export { usePriceTableUpdateMutation };
