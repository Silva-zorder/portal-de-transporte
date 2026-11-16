import { useQuery } from "@tanstack/react-query";
import {
  type TableRelationFetchAllQueryDeps,
  TableRelationQueryOptions,
} from "@/lib/query/table-relation.query";

function useTableRelationFetchAllQuery({ filters }: TableRelationFetchAllQueryDeps = {}) {
  return useQuery(TableRelationQueryOptions.fetchAll({ filters }));
}

export { useTableRelationFetchAllQuery };
