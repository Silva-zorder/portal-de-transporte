import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/client";
import { DeadlineTableQueryKeys } from "@/lib/query/deadline-table.query";
import {
  type DeadlineTableCreateRequest,
  DeadlineTableService,
} from "@/services/portal/v1/deadline-table.service";

function useDeadlineTableCreateMutation() {
  return useMutation({
    mutationFn: (request: DeadlineTableCreateRequest) =>
      DeadlineTableService.create(request),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: DeadlineTableQueryKeys.all() }),
  });
}

export { useDeadlineTableCreateMutation };
