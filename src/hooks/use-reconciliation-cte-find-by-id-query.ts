import { useQuery } from "@tanstack/react-query";
import {
  type ReconciliationCteFindByIdQueryDeps,
  ReconciliationCteQueryOptions,
} from "@/lib/query/reconciliation-cte.query";

function useReconciliationCteFindByIdQuery({ id }: ReconciliationCteFindByIdQueryDeps) {
  return useQuery(ReconciliationCteQueryOptions.findById({ id }));
}

export { useReconciliationCteFindByIdQuery };
