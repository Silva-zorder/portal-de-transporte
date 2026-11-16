import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/client";
import { DeadlineTableQueryKeys } from "@/lib/query/deadline-table.query";
import {
  type DeadlineTableRemoveRequest,
  DeadlineTableService,
} from "@/services/portal/v1/deadline-table.service";

function useDeadlineTableRemoveMutation() {
  return useMutation({
    mutationFn: (request: DeadlineTableRemoveRequest) =>
      DeadlineTableService.remove(request),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: DeadlineTableQueryKeys.all() }),
  });
}

export { useDeadlineTableRemoveMutation };
