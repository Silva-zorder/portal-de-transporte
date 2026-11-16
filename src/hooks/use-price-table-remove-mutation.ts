import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/client";
import { PriceTableQueryKeys } from "@/lib/query/price-table.query";
import {
  type PriceTableRemoveRequest,
  PriceTableService,
} from "@/services/portal/v1/price-table.service";

function usePriceTableRemoveMutation() {
  return useMutation({
    mutationFn: (request: PriceTableRemoveRequest) =>
      PriceTableService.remove(request),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: PriceTableQueryKeys.all() }),
  });
}

export { usePriceTableRemoveMutation };
