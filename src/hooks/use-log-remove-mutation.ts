import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/client";
import { LogQueryKeys } from "@/lib/query/log.query";
import {
  type LogRemoveRequest,
  LogService,
} from "@/services/portal/v1/log.service";

function useLogRemoveMutation() {
  return useMutation({
    mutationFn: (request: LogRemoveRequest) =>
      LogService.remove(request),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: LogQueryKeys.all() }),
  });
}

export { useLogRemoveMutation };
