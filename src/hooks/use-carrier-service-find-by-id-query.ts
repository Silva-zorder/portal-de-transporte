import { useQuery } from "@tanstack/react-query";
import {
  type CarrierServiceFindByIdQueryDeps,
  CarrierServiceQueryOptions,
} from "@/lib/query/carrier-service.query";

function useCarrierServiceFindByIdQuery({ id }: CarrierServiceFindByIdQueryDeps) {
  return useQuery(CarrierServiceQueryOptions.findById({ id }));
}

export { useCarrierServiceFindByIdQuery };
