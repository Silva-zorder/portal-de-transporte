import { useQuery } from "@tanstack/react-query";
import {
  type CteFindByIdQueryDeps,
  CteQueryOptions,
} from "@/lib/query/cte.query";

function useCteFindByIdQuery({ id }: CteFindByIdQueryDeps) {
  return useQuery(CteQueryOptions.findById({ id }));
}

export { useCteFindByIdQuery };
