import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/client";
import { UserQueryKeys } from "@/lib/query/user.query";
import {
  type UserUpdateRequest,
  UserService,
} from "@/services/portal/v1/user.service";

function useUserUpdateMutation() {
  return useMutation({
    mutationFn: (request: UserUpdateRequest) =>
      UserService.update(request),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: UserQueryKeys.all() }),
  });
}

export { useUserUpdateMutation };
