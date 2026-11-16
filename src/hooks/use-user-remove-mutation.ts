import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/client";
import { UserQueryKeys } from "@/lib/query/user.query";
import {
  type UserRemoveRequest,
  UserService,
} from "@/services/portal/v1/user.service";

function useUserRemoveMutation() {
  return useMutation({
    mutationFn: (request: UserRemoveRequest) =>
      UserService.remove(request),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: UserQueryKeys.all() }),
  });
}

export { useUserRemoveMutation };
