import { useQuery } from "@tanstack/react-query";
import {
  type ReconciliationCteFetchAllQueryDeps,
  ReconciliationCteQueryOptions,
} from "@/lib/query/reconciliation-cte.query";

function useReconciliationCteFetchAllQuery({ filters }: ReconciliationCteFetchAllQueryDeps = {}) {
  return useQuery(ReconciliationCteQueryOptions.fetchAll({ filters }));
}

export { useReconciliationCteFetchAllQuery };
