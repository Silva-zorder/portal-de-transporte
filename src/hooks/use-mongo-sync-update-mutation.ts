import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/client";
import { MongoSyncQueryKeys } from "@/lib/query/mongo-sync.query";
import {
  type MongoSyncUpdateRequest,
  MongoSyncService,
} from "@/services/portal/v1/mongo-sync.service";

function useMongoSyncUpdateMutation() {
  return useMutation({
    mutationFn: (request: MongoSyncUpdateRequest) =>
      MongoSyncService.update(request),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: MongoSyncQueryKeys.all() }),
  });
}

export { useMongoSyncUpdateMutation };
