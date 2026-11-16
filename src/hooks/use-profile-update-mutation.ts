import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/client";
import { ProfileQueryKeys } from "@/lib/query/profile.query";
import {
  type ProfileUpdateRequest,
  ProfileService,
} from "@/services/portal/v1/profile.service";

function useProfileUpdateMutation() {
  return useMutation({
    mutationFn: (request: ProfileUpdateRequest) =>
      ProfileService.update(request),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ProfileQueryKeys.all() }),
  });
}

export { useProfileUpdateMutation };
