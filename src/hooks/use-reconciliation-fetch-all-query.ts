import { useQuery } from "@tanstack/react-query";
import {
  type ReconciliationFetchAllQueryDeps,
  ReconciliationQueryOptions,
} from "@/lib/query/reconciliation.query";

function useReconciliationFetchAllQuery({ filters }: ReconciliationFetchAllQueryDeps = {}) {
  return useQuery(ReconciliationQueryOptions.fetchAll({ filters }));
}

export { useReconciliationFetchAllQuery };
