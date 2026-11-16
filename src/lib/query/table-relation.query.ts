import { queryOptions } from "@tanstack/react-query";
import {
  type TableRelationFetchAllRequest,
  type TableRelationFindByIdRequest,
  TableRelationService,
} from "@/services/portal/v1/table-relation.service";

type TableRelationFetchAllQueryDeps = TableRelationFetchAllRequest;
type TableRelationFindByIdQueryDeps = TableRelationFindByIdRequest;

const TableRelationQueryKeys = {
  all: () => ["table-relation"] as const,
  fetchAll: ({ filters }: TableRelationFetchAllQueryDeps = {}) =>
    ["table-relation", "fetch-all", filters ?? {}] as const,
  findById: ({ id }: TableRelationFindByIdQueryDeps) =>
    ["table-relation", "find-by-id", id] as const,
} as const;

const TableRelationQueryOptions = {
  fetchAll: ({ filters }: TableRelationFetchAllQueryDeps = {}) =>
    queryOptions({
      queryKey: TableRelationQueryKeys.fetchAll({ filters }),
      queryFn: () => TableRelationService.fetchAll({ filters }),
    }),
  findById: ({ id }: TableRelationFindByIdQueryDeps) =>
    queryOptions({
      queryKey: TableRelationQueryKeys.findById({ id }),
      queryFn: () => TableRelationService.findById({ id }),
    }),
} as const;

export {
  type TableRelationFetchAllQueryDeps,
  type TableRelationFindByIdQueryDeps,
  TableRelationQueryKeys,
  TableRelationQueryOptions,
};
