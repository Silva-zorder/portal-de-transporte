import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/client";
import { TableRelationQueryKeys } from "@/lib/query/table-relation.query";
import {
  type TableRelationUpdateRequest,
  TableRelationService,
} from "@/services/portal/v1/table-relation.service";

function useTableRelationUpdateMutation() {
  return useMutation({
    mutationFn: (request: TableRelationUpdateRequest) =>
      TableRelationService.update(request),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: TableRelationQueryKeys.all() }),
  });
}

export { useTableRelationUpdateMutation };
