import { queryOptions } from "@tanstack/react-query";
import {
  type ReconciliationCteFetchAllRequest,
  type ReconciliationCteFindByIdRequest,
  ReconciliationCteService,
} from "@/services/portal/v1/reconciliation-cte.service";

type ReconciliationCteFetchAllQueryDeps = ReconciliationCteFetchAllRequest;
type ReconciliationCteFindByIdQueryDeps = ReconciliationCteFindByIdRequest;

const ReconciliationCteQueryKeys = {
  all: () => ["reconciliation-cte"] as const,
  fetchAll: ({ filters }: ReconciliationCteFetchAllQueryDeps = {}) =>
    ["reconciliation-cte", "fetch-all", filters ?? {}] as const,
  findById: ({ id }: ReconciliationCteFindByIdQueryDeps) =>
    ["reconciliation-cte", "find-by-id", id] as const,
} as const;

const ReconciliationCteQueryOptions = {
  fetchAll: ({ filters }: ReconciliationCteFetchAllQueryDeps = {}) =>
    queryOptions({
      queryKey: ReconciliationCteQueryKeys.fetchAll({ filters }),
      queryFn: () => ReconciliationCteService.fetchAll({ filters }),
    }),
  findById: ({ id }: ReconciliationCteFindByIdQueryDeps) =>
    queryOptions({
      queryKey: ReconciliationCteQueryKeys.findById({ id }),
      queryFn: () => ReconciliationCteService.findById({ id }),
    }),
} as const;

export {
  type ReconciliationCteFetchAllQueryDeps,
  type ReconciliationCteFindByIdQueryDeps,
  ReconciliationCteQueryKeys,
  ReconciliationCteQueryOptions,
};
