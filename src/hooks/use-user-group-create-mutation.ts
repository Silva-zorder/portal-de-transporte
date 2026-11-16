import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/client";
import { UserGroupQueryKeys } from "@/lib/query/user-group.query";
import {
  type UserGroupCreateRequest,
  UserGroupService,
} from "@/services/portal/v1/user-group.service";

function useUserGroupCreateMutation() {
  return useMutation({
    mutationFn: (request: UserGroupCreateRequest) =>
      UserGroupService.create(request),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: UserGroupQueryKeys.all() }),
  });
}

export { useUserGroupCreateMutation };
