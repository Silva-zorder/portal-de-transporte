import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/client";
import { UserGroupQueryKeys } from "@/lib/query/user-group.query";
import {
  type UserGroupRemoveRequest,
  UserGroupService,
} from "@/services/portal/v1/user-group.service";

function useUserGroupRemoveMutation() {
  return useMutation({
    mutationFn: (request: UserGroupRemoveRequest) =>
      UserGroupService.remove(request),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: UserGroupQueryKeys.all() }),
  });
}

export { useUserGroupRemoveMutation };
