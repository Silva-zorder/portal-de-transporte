import { queryOptions } from "@tanstack/react-query";
import {
  type ZipRangeFetchAllRequest,
  type ZipRangeFindByIdRequest,
  ZipRangeService,
} from "@/services/portal/v1/zip-range.service";

type ZipRangeFetchAllQueryDeps = ZipRangeFetchAllRequest;
type ZipRangeFindByIdQueryDeps = ZipRangeFindByIdRequest;

const ZipRangeQueryKeys = {
  all: () => ["zip-range"] as const,
  fetchAll: ({ filters }: ZipRangeFetchAllQueryDeps = {}) =>
    ["zip-range", "fetch-all", filters ?? {}] as const,
  findById: ({ id }: ZipRangeFindByIdQueryDeps) =>
    ["zip-range", "find-by-id", id] as const,
} as const;

const ZipRangeQueryOptions = {
  fetchAll: ({ filters }: ZipRangeFetchAllQueryDeps = {}) =>
    queryOptions({
      queryKey: ZipRangeQueryKeys.fetchAll({ filters }),
      queryFn: () => ZipRangeService.fetchAll({ filters }),
    }),
  findById: ({ id }: ZipRangeFindByIdQueryDeps) =>
    queryOptions({
      queryKey: ZipRangeQueryKeys.findById({ id }),
      queryFn: () => ZipRangeService.findById({ id }),
    }),
} as const;

export {
  type ZipRangeFetchAllQueryDeps,
  type ZipRangeFindByIdQueryDeps,
  ZipRangeQueryKeys,
  ZipRangeQueryOptions,
};
