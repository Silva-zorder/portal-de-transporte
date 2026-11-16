import { useQuery } from "@tanstack/react-query";
import {
  type BillingDocumentFetchAllQueryDeps,
  BillingDocumentQueryOptions,
} from "@/lib/query/billing-document.query";

function useBillingDocumentFetchAllQuery({ filters }: BillingDocumentFetchAllQueryDeps = {}) {
  return useQuery(BillingDocumentQueryOptions.fetchAll({ filters }));
}

export { useBillingDocumentFetchAllQuery };
