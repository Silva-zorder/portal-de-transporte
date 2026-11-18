import { useQuery } from "@tanstack/react-query";
import {
  type ProfileRouteFindByIdQueryDeps,
  ProfileRouteQueryOptions,
} from "@/lib/query/profile-route.query";

function useProfileRouteFindByIdQuery({ id }: ProfileRouteFindByIdQueryDeps) {
  return useQuery(ProfileRouteQueryOptions.findById({ id }));
}

export { useProfileRouteFindByIdQuery };
