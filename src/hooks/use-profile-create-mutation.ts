import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/client";
import { ProfileQueryKeys } from "@/lib/query/profile.query";
import {
  type ProfileCreateRequest,
  ProfileService,
} from "@/services/portal/v1/profile.service";

function useProfileCreateMutation() {
  return useMutation({
    mutationFn: (request: ProfileCreateRequest) =>
      ProfileService.create(request),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ProfileQueryKeys.all() }),
  });
}

export { useProfileCreateMutation };
