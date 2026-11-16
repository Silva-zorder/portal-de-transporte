import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/client";
import { CteQueryKeys } from "@/lib/query/cte.query";
import {
  type CteRemoveRequest,
  CteService,
} from "@/services/portal/v1/cte.service";

function useCteRemoveMutation() {
  return useMutation({
    mutationFn: (request: CteRemoveRequest) =>
      CteService.remove(request),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: CteQueryKeys.all() }),
  });
}

export { useCteRemoveMutation };
