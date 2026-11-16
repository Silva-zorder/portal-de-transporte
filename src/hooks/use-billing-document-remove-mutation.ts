import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/client";
import { BillingDocumentQueryKeys } from "@/lib/query/billing-document.query";
import {
  type BillingDocumentRemoveRequest,
  BillingDocumentService,
} from "@/services/portal/v1/billing-document.service";

function useBillingDocumentRemoveMutation() {
  return useMutation({
    mutationFn: (request: BillingDocumentRemoveRequest) =>
      BillingDocumentService.remove(request),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: BillingDocumentQueryKeys.all() }),
  });
}

export { useBillingDocumentRemoveMutation };
