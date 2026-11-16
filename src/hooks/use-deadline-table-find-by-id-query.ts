import { useQuery } from "@tanstack/react-query";
import {
  type DeadlineTableFindByIdQueryDeps,
  DeadlineTableQueryOptions,
} from "@/lib/query/deadline-table.query";

function useDeadlineTableFindByIdQuery({ id }: DeadlineTableFindByIdQueryDeps) {
  return useQuery(DeadlineTableQueryOptions.findById({ id }));
}

export { useDeadlineTableFindByIdQuery };
