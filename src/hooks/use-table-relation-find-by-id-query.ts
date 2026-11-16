import { useQuery } from "@tanstack/react-query";
import {
  type TableRelationFindByIdQueryDeps,
  TableRelationQueryOptions,
} from "@/lib/query/table-relation.query";

function useTableRelationFindByIdQuery({ id }: TableRelationFindByIdQueryDeps) {
  return useQuery(TableRelationQueryOptions.findById({ id }));
}

export { useTableRelationFindByIdQuery };
