import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/client";
import { PriceTableQueryKeys } from "@/lib/query/price-table.query";
import {
  type PriceTableCreateRequest,
  PriceTableService,
} from "@/services/portal/v1/price-table.service";

function usePriceTableCreateMutation() {
  return useMutation({
    mutationFn: (request: PriceTableCreateRequest) =>
      PriceTableService.create(request),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: PriceTableQueryKeys.all() }),
  });
}

export { usePriceTableCreateMutation };
