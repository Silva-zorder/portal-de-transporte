import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/client";
import { ReconciliationQueryKeys } from "@/lib/query/reconciliation.query";
import {
  type ReconciliationRemoveRequest,
  ReconciliationService,
} from "@/services/portal/v1/reconciliation.service";

function useReconciliationRemoveMutation() {
  return useMutation({
    mutationFn: (request: ReconciliationRemoveRequest) =>
      ReconciliationService.remove(request),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ReconciliationQueryKeys.all() }),
  });
}

export { useReconciliationRemoveMutation };
