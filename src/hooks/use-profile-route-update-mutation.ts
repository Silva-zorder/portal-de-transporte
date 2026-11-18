import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/client";
import { ProfileRouteQueryKeys } from "@/lib/query/profile-route.query";
import {
  type ProfileRouteUpdateRequest,
  ProfileRouteService,
} from "@/services/portal/v1/profile-route.service";

function useProfileRouteUpdateMutation() {
  return useMutation({
    mutationFn: (request: ProfileRouteUpdateRequest) =>
      ProfileRouteService.update(request),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ProfileRouteQueryKeys.all() }),
  });
}

export { useProfileRouteUpdateMutation };
