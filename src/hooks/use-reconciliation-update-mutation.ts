import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/client";
import { ReconciliationQueryKeys } from "@/lib/query/reconciliation.query";
import {
  type ReconciliationUpdateRequest,
  ReconciliationService,
} from "@/services/portal/v1/reconciliation.service";

function useReconciliationUpdateMutation() {
  return useMutation({
    mutationFn: (request: ReconciliationUpdateRequest) =>
      ReconciliationService.update(request),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ReconciliationQueryKeys.all() }),
  });
}

export { useReconciliationUpdateMutation };
