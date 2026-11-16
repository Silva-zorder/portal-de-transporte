import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/client";
import { UserProfileQueryKeys } from "@/lib/query/user-profile.query";
import {
  type UserProfileCreateRequest,
  UserProfileService,
} from "@/services/portal/v1/user-profile.service";

function useUserProfileCreateMutation() {
  return useMutation({
    mutationFn: (request: UserProfileCreateRequest) =>
      UserProfileService.create(request),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: UserProfileQueryKeys.all() }),
  });
}

export { useUserProfileCreateMutation };
