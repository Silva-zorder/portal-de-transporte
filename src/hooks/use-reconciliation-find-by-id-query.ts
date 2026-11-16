import { useQuery } from "@tanstack/react-query";
import {
  type ReconciliationFindByIdQueryDeps,
  ReconciliationQueryOptions,
} from "@/lib/query/reconciliation.query";

function useReconciliationFindByIdQuery({ id }: ReconciliationFindByIdQueryDeps) {
  return useQuery(ReconciliationQueryOptions.findById({ id }));
}

export { useReconciliationFindByIdQuery };
