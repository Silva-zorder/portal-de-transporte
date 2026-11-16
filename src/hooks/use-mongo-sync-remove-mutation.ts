import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/client";
import { MongoSyncQueryKeys } from "@/lib/query/mongo-sync.query";
import {
  type MongoSyncRemoveRequest,
  MongoSyncService,
} from "@/services/portal/v1/mongo-sync.service";

function useMongoSyncRemoveMutation() {
  return useMutation({
    mutationFn: (request: MongoSyncRemoveRequest) =>
      MongoSyncService.remove(request),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: MongoSyncQueryKeys.all() }),
  });
}

export { useMongoSyncRemoveMutation };
