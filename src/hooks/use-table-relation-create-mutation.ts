import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/client";
import { TableRelationQueryKeys } from "@/lib/query/table-relation.query";
import {
  type TableRelationCreateRequest,
  TableRelationService,
} from "@/services/portal/v1/table-relation.service";

function useTableRelationCreateMutation() {
  return useMutation({
    mutationFn: (request: TableRelationCreateRequest) =>
      TableRelationService.create(request),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: TableRelationQueryKeys.all() }),
  });
}

export { useTableRelationCreateMutation };
