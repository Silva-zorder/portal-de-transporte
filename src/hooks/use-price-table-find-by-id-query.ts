import { useQuery } from "@tanstack/react-query";
import {
  type PriceTableFindByIdQueryDeps,
  PriceTableQueryOptions,
} from "@/lib/query/price-table.query";

function usePriceTableFindByIdQuery({ id }: PriceTableFindByIdQueryDeps) {
  return useQuery(PriceTableQueryOptions.findById({ id }));
}

export { usePriceTableFindByIdQuery };
