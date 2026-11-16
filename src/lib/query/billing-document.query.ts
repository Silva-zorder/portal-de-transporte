import { queryOptions } from "@tanstack/react-query";
import {
  type BillingDocumentFetchAllRequest,
  type BillingDocumentFindByIdRequest,
  BillingDocumentService,
} from "@/services/portal/v1/billing-document.service";

type BillingDocumentFetchAllQueryDeps = BillingDocumentFetchAllRequest;
type BillingDocumentFindByIdQueryDeps = BillingDocumentFindByIdRequest;

const BillingDocumentQueryKeys = {
  all: () => ["billing-document"] as const,
  fetchAll: ({ filters }: BillingDocumentFetchAllQueryDeps = {}) =>
    ["billing-document", "fetch-all", filters ?? {}] as const,
  findById: ({ id }: BillingDocumentFindByIdQueryDeps) =>
    ["billing-document", "find-by-id", id] as const,
} as const;

const BillingDocumentQueryOptions = {
  fetchAll: ({ filters }: BillingDocumentFetchAllQueryDeps = {}) =>
    queryOptions({
      queryKey: BillingDocumentQueryKeys.fetchAll({ filters }),
      queryFn: () => BillingDocumentService.fetchAll({ filters }),
    }),
  findById: ({ id }: BillingDocumentFindByIdQueryDeps) =>
    queryOptions({
      queryKey: BillingDocumentQueryKeys.findById({ id }),
      queryFn: () => BillingDocumentService.findById({ id }),
    }),
} as const;

export {
  type BillingDocumentFetchAllQueryDeps,
  type BillingDocumentFindByIdQueryDeps,
  BillingDocumentQueryKeys,
  BillingDocumentQueryOptions,
};
