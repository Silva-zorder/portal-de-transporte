import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/client";
import { CteQueryKeys } from "@/lib/query/cte.query";
import {
  type CteCreateRequest,
  CteService,
} from "@/services/portal/v1/cte.service";

function useCteCreateMutation() {
  return useMutation({
    mutationFn: (request: CteCreateRequest) =>
      CteService.create(request),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: CteQueryKeys.all() }),
  });
}

export { useCteCreateMutation };
