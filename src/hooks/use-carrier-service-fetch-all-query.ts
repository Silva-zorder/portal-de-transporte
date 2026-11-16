import { useQuery } from "@tanstack/react-query";
import {
  type CarrierServiceFetchAllQueryDeps,
  CarrierServiceQueryOptions,
} from "@/lib/query/carrier-service.query";

function useCarrierServiceFetchAllQuery({ filters }: CarrierServiceFetchAllQueryDeps = {}) {
  return useQuery(CarrierServiceQueryOptions.fetchAll({ filters }));
}

export { useCarrierServiceFetchAllQuery };
