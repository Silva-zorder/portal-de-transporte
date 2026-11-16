import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/client";
import { ReconciliationQueryKeys } from "@/lib/query/reconciliation.query";
import {
  type ReconciliationCreateRequest,
  ReconciliationService,
} from "@/services/portal/v1/reconciliation.service";

function useReconciliationCreateMutation() {
  return useMutation({
    mutationFn: (request: ReconciliationCreateRequest) =>
      ReconciliationService.create(request),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ReconciliationQueryKeys.all() }),
  });
}

export { useReconciliationCreateMutation };
