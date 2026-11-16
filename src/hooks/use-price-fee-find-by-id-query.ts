import { useQuery } from "@tanstack/react-query";
import {
  type PriceFeeFindByIdQueryDeps,
  PriceFeeQueryOptions,
} from "@/lib/query/price-fee.query";

function usePriceFeeFindByIdQuery({ id }: PriceFeeFindByIdQueryDeps) {
  return useQuery(PriceFeeQueryOptions.findById({ id }));
}

export { usePriceFeeFindByIdQuery };
