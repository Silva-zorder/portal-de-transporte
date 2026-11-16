import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/client";
import { MongoSyncQueryKeys } from "@/lib/query/mongo-sync.query";
import {
  type MongoSyncCreateRequest,
  MongoSyncService,
} from "@/services/portal/v1/mongo-sync.service";

function useMongoSyncCreateMutation() {
  return useMutation({
    mutationFn: (request: MongoSyncCreateRequest) =>
      MongoSyncService.create(request),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: MongoSyncQueryKeys.all() }),
  });
}

export { useMongoSyncCreateMutation };
