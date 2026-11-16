import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/client";
import { BillingDocumentQueryKeys } from "@/lib/query/billing-document.query";
import {
  type BillingDocumentUpdateRequest,
  BillingDocumentService,
} from "@/services/portal/v1/billing-document.service";

function useBillingDocumentUpdateMutation() {
  return useMutation({
    mutationFn: (request: BillingDocumentUpdateRequest) =>
      BillingDocumentService.update(request),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: BillingDocumentQueryKeys.all() }),
  });
}

export { useBillingDocumentUpdateMutation };
