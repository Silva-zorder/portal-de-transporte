import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/client";
import { ProfileRouteQueryKeys } from "@/lib/query/profile-route.query";
import {
  type ProfileRouteRemoveRequest,
  ProfileRouteService,
} from "@/services/portal/v1/profile-route.service";

function useProfileRouteRemoveMutation() {
  return useMutation({
    mutationFn: (request: ProfileRouteRemoveRequest) =>
      ProfileRouteService.remove(request),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ProfileRouteQueryKeys.all() }),
  });
}

export { useProfileRouteRemoveMutation };
