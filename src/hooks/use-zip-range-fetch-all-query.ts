import { useQuery } from "@tanstack/react-query";
import {
  type ZipRangeFetchAllQueryDeps,
  ZipRangeQueryOptions,
} from "@/lib/query/zip-range.query";

function useZipRangeFetchAllQuery({ filters }: ZipRangeFetchAllQueryDeps = {}) {
  return useQuery(ZipRangeQueryOptions.fetchAll({ filters }));
}

export { useZipRangeFetchAllQuery };
