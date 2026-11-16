import { useQuery } from "@tanstack/react-query";
import {
  type PriceTableFetchAllQueryDeps,
  PriceTableQueryOptions,
} from "@/lib/query/price-table.query";

function usePriceTableFetchAllQuery({ filters }: PriceTableFetchAllQueryDeps = {}) {
  return useQuery(PriceTableQueryOptions.fetchAll({ filters }));
}

export { usePriceTableFetchAllQuery };
