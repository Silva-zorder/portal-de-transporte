import { useQuery } from "@tanstack/react-query";
import {
  type CteFetchAllQueryDeps,
  CteQueryOptions,
} from "@/lib/query/cte.query";

function useCteFetchAllQuery({ filters }: CteFetchAllQueryDeps = {}) {
  return useQuery(CteQueryOptions.fetchAll({ filters }));
}

export { useCteFetchAllQuery };
