import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/client";
import { LogQueryKeys } from "@/lib/query/log.query";
import {
  type LogCreateRequest,
  LogService,
} from "@/services/portal/v1/log.service";

function useLogCreateMutation() {
  return useMutation({
    mutationFn: (request: LogCreateRequest) =>
      LogService.create(request),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: LogQueryKeys.all() }),
  });
}

export { useLogCreateMutation };
