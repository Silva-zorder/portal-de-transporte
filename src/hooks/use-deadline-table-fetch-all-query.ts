import { useQuery } from "@tanstack/react-query";
import {
  type DeadlineTableFetchAllQueryDeps,
  DeadlineTableQueryOptions,
} from "@/lib/query/deadline-table.query";

function useDeadlineTableFetchAllQuery({ filters }: DeadlineTableFetchAllQueryDeps = {}) {
  return useQuery(DeadlineTableQueryOptions.fetchAll({ filters }));
}

export { useDeadlineTableFetchAllQuery };
