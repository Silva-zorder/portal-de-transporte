import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/client";
import { DeadlineTableQueryKeys } from "@/lib/query/deadline-table.query";
import {
  type DeadlineTableUpdateRequest,
  DeadlineTableService,
} from "@/services/portal/v1/deadline-table.service";

function useDeadlineTableUpdateMutation() {
  return useMutation({
    mutationFn: (request: DeadlineTableUpdateRequest) =>
      DeadlineTableService.update(request),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: DeadlineTableQueryKeys.all() }),
  });
}

export { useDeadlineTableUpdateMutation };
