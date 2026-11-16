import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/client";
import { ReconciliationCteQueryKeys } from "@/lib/query/reconciliation-cte.query";
import {
  type ReconciliationCteUpdateRequest,
  ReconciliationCteService,
} from "@/services/portal/v1/reconciliation-cte.service";

function useReconciliationCteUpdateMutation() {
  return useMutation({
    mutationFn: (request: ReconciliationCteUpdateRequest) =>
      ReconciliationCteService.update(request),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ReconciliationCteQueryKeys.all() }),
  });
}

export { useReconciliationCteUpdateMutation };
