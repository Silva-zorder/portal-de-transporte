import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/client";
import { CteQueryKeys } from "@/lib/query/cte.query";
import {
  type CteUpdateRequest,
  CteService,
} from "@/services/portal/v1/cte.service";

function useCteUpdateMutation() {
  return useMutation({
    mutationFn: (request: CteUpdateRequest) =>
      CteService.update(request),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: CteQueryKeys.all() }),
  });
}

export { useCteUpdateMutation };
