import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/client";
import { UserQueryKeys } from "@/lib/query/user.query";
import {
  type UserCreateRequest,
  UserService,
} from "@/services/portal/v1/user.service";

function useUserCreateMutation() {
  return useMutation({
    mutationFn: (request: UserCreateRequest) =>
      UserService.create(request),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: UserQueryKeys.all() }),
  });
}

export { useUserCreateMutation };
