import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/client";
import { ProfileRouteQueryKeys } from "@/lib/query/profile-route.query";
import {
  type ProfileRouteCreateRequest,
  ProfileRouteService,
} from "@/services/portal/v1/profile-route.service";

function useProfileRouteCreateMutation() {
  return useMutation({
    mutationFn: (request: ProfileRouteCreateRequest) =>
      ProfileRouteService.create(request),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ProfileRouteQueryKeys.all() }),
  });
}

export { useProfileRouteCreateMutation };
