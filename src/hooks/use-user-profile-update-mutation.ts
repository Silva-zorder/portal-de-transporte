import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/client";
import { UserProfileQueryKeys } from "@/lib/query/user-profile.query";
import {
  type UserProfileUpdateRequest,
  UserProfileService,
} from "@/services/portal/v1/user-profile.service";

function useUserProfileUpdateMutation() {
  return useMutation({
    mutationFn: (request: UserProfileUpdateRequest) =>
      UserProfileService.update(request),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: UserProfileQueryKeys.all() }),
  });
}

export { useUserProfileUpdateMutation };
