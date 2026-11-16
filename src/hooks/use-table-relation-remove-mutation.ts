import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/client";
import { TableRelationQueryKeys } from "@/lib/query/table-relation.query";
import {
  type TableRelationRemoveRequest,
  TableRelationService,
} from "@/services/portal/v1/table-relation.service";

function useTableRelationRemoveMutation() {
  return useMutation({
    mutationFn: (request: TableRelationRemoveRequest) =>
      TableRelationService.remove(request),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: TableRelationQueryKeys.all() }),
  });
}

export { useTableRelationRemoveMutation };
