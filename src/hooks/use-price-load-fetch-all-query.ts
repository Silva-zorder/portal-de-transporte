import { useQuery } from "@tanstack/react-query";
import {
  type PriceLoadFetchAllQueryDeps,
  PriceLoadQueryOptions,
} from "@/lib/query/price-load.query";

function usePriceLoadFetchAllQuery({ filters }: PriceLoadFetchAllQueryDeps = {}) {
  return useQuery(PriceLoadQueryOptions.fetchAll({ filters }));
}

export { usePriceLoadFetchAllQuery };
