import { useQuery } from "@tanstack/react-query";
import {
  type MongoSyncFindByIdQueryDeps,
  MongoSyncQueryOptions,
} from "@/lib/query/mongo-sync.query";

function useMongoSyncFindByIdQuery({ id }: MongoSyncFindByIdQueryDeps) {
  return useQuery(MongoSyncQueryOptions.findById({ id }));
}

export { useMongoSyncFindByIdQuery };
