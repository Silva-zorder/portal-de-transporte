import { queryOptions } from "@tanstack/react-query";
import {
  type MongoSyncFetchAllRequest,
  type MongoSyncFindByIdRequest,
  MongoSyncService,
} from "@/services/portal/v1/mongo-sync.service";

type MongoSyncFetchAllQueryDeps = MongoSyncFetchAllRequest;
type MongoSyncFindByIdQueryDeps = MongoSyncFindByIdRequest;

const MongoSyncQueryKeys = {
  all: () => ["mongo-sync"] as const,
  fetchAll: ({ filters }: MongoSyncFetchAllQueryDeps = {}) =>
    ["mongo-sync", "fetch-all", filters ?? {}] as const,
  findById: ({ id }: MongoSyncFindByIdQueryDeps) =>
    ["mongo-sync", "find-by-id", id] as const,
} as const;

const MongoSyncQueryOptions = {
  fetchAll: ({ filters }: MongoSyncFetchAllQueryDeps = {}) =>
    queryOptions({
      queryKey: MongoSyncQueryKeys.fetchAll({ filters }),
      queryFn: () => MongoSyncService.fetchAll({ filters }),
    }),
  findById: ({ id }: MongoSyncFindByIdQueryDeps) =>
    queryOptions({
      queryKey: MongoSyncQueryKeys.findById({ id }),
      queryFn: () => MongoSyncService.findById({ id }),
    }),
} as const;

export {
  type MongoSyncFetchAllQueryDeps,
  type MongoSyncFindByIdQueryDeps,
  MongoSyncQueryKeys,
  MongoSyncQueryOptions,
};
