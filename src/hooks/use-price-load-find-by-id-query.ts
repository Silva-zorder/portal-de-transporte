import { useQuery } from "@tanstack/react-query";
import {
  type PriceLoadFindByIdQueryDeps,
  PriceLoadQueryOptions,
} from "@/lib/query/price-load.query";

function usePriceLoadFindByIdQuery({ id }: PriceLoadFindByIdQueryDeps) {
  return useQuery(PriceLoadQueryOptions.findById({ id }));
}

export { usePriceLoadFindByIdQuery };
