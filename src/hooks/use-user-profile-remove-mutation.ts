import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/client";
import { UserProfileQueryKeys } from "@/lib/query/user-profile.query";
import {
  type UserProfileRemoveRequest,
  UserProfileService,
} from "@/services/portal/v1/user-profile.service";

function useUserProfileRemoveMutation() {
  return useMutation({
    mutationFn: (request: UserProfileRemoveRequest) =>
      UserProfileService.remove(request),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: UserProfileQueryKeys.all() }),
  });
}

export { useUserProfileRemoveMutation };
