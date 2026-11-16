import { useQuery } from "@tanstack/react-query";
import {
  type MongoSyncFetchAllQueryDeps,
  MongoSyncQueryOptions,
} from "@/lib/query/mongo-sync.query";

function useMongoSyncFetchAllQuery({ filters }: MongoSyncFetchAllQueryDeps = {}) {
  return useQuery(MongoSyncQueryOptions.fetchAll({ filters }));
}

export { useMongoSyncFetchAllQuery };
