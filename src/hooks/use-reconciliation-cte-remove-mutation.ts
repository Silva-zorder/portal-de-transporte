import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/client";
import { ReconciliationCteQueryKeys } from "@/lib/query/reconciliation-cte.query";
import {
  type ReconciliationCteRemoveRequest,
  ReconciliationCteService,
} from "@/services/portal/v1/reconciliation-cte.service";

function useReconciliationCteRemoveMutation() {
  return useMutation({
    mutationFn: (request: ReconciliationCteRemoveRequest) =>
      ReconciliationCteService.remove(request),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ReconciliationCteQueryKeys.all() }),
  });
}

export { useReconciliationCteRemoveMutation };
