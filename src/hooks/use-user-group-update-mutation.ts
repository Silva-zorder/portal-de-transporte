import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/client";
import { UserGroupQueryKeys } from "@/lib/query/user-group.query";
import {
  type UserGroupUpdateRequest,
  UserGroupService,
} from "@/services/portal/v1/user-group.service";

function useUserGroupUpdateMutation() {
  return useMutation({
    mutationFn: (request: UserGroupUpdateRequest) =>
      UserGroupService.update(request),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: UserGroupQueryKeys.all() }),
  });
}

export { useUserGroupUpdateMutation };
