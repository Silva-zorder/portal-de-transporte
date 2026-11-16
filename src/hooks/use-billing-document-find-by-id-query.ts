import { useQuery } from "@tanstack/react-query";
import {
  type BillingDocumentFindByIdQueryDeps,
  BillingDocumentQueryOptions,
} from "@/lib/query/billing-document.query";

function useBillingDocumentFindByIdQuery({ id }: BillingDocumentFindByIdQueryDeps) {
  return useQuery(BillingDocumentQueryOptions.findById({ id }));
}

export { useBillingDocumentFindByIdQuery };
