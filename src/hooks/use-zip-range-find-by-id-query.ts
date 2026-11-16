import { useQuery } from "@tanstack/react-query";
import {
  type ZipRangeFindByIdQueryDeps,
  ZipRangeQueryOptions,
} from "@/lib/query/zip-range.query";

function useZipRangeFindByIdQuery({ id }: ZipRangeFindByIdQueryDeps) {
  return useQuery(ZipRangeQueryOptions.findById({ id }));
}

export { useZipRangeFindByIdQuery };
