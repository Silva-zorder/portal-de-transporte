import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/client";
import { ReconciliationCteQueryKeys } from "@/lib/query/reconciliation-cte.query";
import {
  type ReconciliationCteCreateRequest,
  ReconciliationCteService,
} from "@/services/portal/v1/reconciliation-cte.service";

function useReconciliationCteCreateMutation() {
  return useMutation({
    mutationFn: (request: ReconciliationCteCreateRequest) =>
      ReconciliationCteService.create(request),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ReconciliationCteQueryKeys.all() }),
  });
}

export { useReconciliationCteCreateMutation };
