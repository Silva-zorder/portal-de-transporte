import { useQuery } from "@tanstack/react-query";
import {
  type CarrierFetchAllQueryDeps,
  CarrierQueryOptions,
} from "@/lib/query/carrier.query";

function useCarrierFetchAllQuery({ filters }: CarrierFetchAllQueryDeps = {}) {
  return useQuery(CarrierQueryOptions.fetchAll({ filters }));
}

export { useCarrierFetchAllQuery };
