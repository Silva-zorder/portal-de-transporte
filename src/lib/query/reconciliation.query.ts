import { queryOptions } from "@tanstack/react-query";
import {
  type ReconciliationFetchAllRequest,
  type ReconciliationFindByIdRequest,
  ReconciliationService,
} from "@/services/portal/v1/reconciliation.service";

type ReconciliationFetchAllQueryDeps = ReconciliationFetchAllRequest;
type ReconciliationFindByIdQueryDeps = ReconciliationFindByIdRequest;

const ReconciliationQueryKeys = {
  all: () => ["reconciliation"] as const,
  fetchAll: ({ filters }: ReconciliationFetchAllQueryDeps = {}) =>
    ["reconciliation", "fetch-all", filters ?? {}] as const,
  findById: ({ id }: ReconciliationFindByIdQueryDeps) =>
    ["reconciliation", "find-by-id", id] as const,
} as const;

const ReconciliationQueryOptions = {
  fetchAll: ({ filters }: ReconciliationFetchAllQueryDeps = {}) =>
    queryOptions({
      queryKey: ReconciliationQueryKeys.fetchAll({ filters }),
      queryFn: () => ReconciliationService.fetchAll({ filters }),
    }),
  findById: ({ id }: ReconciliationFindByIdQueryDeps) =>
    queryOptions({
      queryKey: ReconciliationQueryKeys.findById({ id }),
      queryFn: () => ReconciliationService.findById({ id }),
    }),
} as const;

export {
  type ReconciliationFetchAllQueryDeps,
  type ReconciliationFindByIdQueryDeps,
  ReconciliationQueryKeys,
  ReconciliationQueryOptions,
};
