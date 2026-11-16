import { useQuery } from "@tanstack/react-query";
import {
  type CarrierFindByIdQueryDeps,
  CarrierQueryOptions,
} from "@/lib/query/carrier.query";

function useCarrierFindByIdQuery({ id }: CarrierFindByIdQueryDeps) {
  return useQuery(CarrierQueryOptions.findById({ id }));
}

export { useCarrierFindByIdQuery };
