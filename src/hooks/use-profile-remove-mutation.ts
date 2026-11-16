import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/client";
import { ProfileQueryKeys } from "@/lib/query/profile.query";
import {
  type ProfileRemoveRequest,
  ProfileService,
} from "@/services/portal/v1/profile.service";

function useProfileRemoveMutation() {
  return useMutation({
    mutationFn: (request: ProfileRemoveRequest) =>
      ProfileService.remove(request),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ProfileQueryKeys.all() }),
  });
}

export { useProfileRemoveMutation };
