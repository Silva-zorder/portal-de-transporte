import { useQuery } from "@tanstack/react-query";
import {
  type PriceFeeFetchAllQueryDeps,
  PriceFeeQueryOptions,
} from "@/lib/query/price-fee.query";

function usePriceFeeFetchAllQuery({ filters }: PriceFeeFetchAllQueryDeps = {}) {
  return useQuery(PriceFeeQueryOptions.fetchAll({ filters }));
}

export { usePriceFeeFetchAllQuery };
