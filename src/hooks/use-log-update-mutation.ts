import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/client";
import { LogQueryKeys } from "@/lib/query/log.query";
import {
  type LogUpdateRequest,
  LogService,
} from "@/services/portal/v1/log.service";

function useLogUpdateMutation() {
  return useMutation({
    mutationFn: (request: LogUpdateRequest) =>
      LogService.update(request),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: LogQueryKeys.all() }),
  });
}

export { useLogUpdateMutation };
