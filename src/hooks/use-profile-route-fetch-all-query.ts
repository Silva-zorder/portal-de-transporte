import { useQuery } from "@tanstack/react-query";
import {
  type ProfileRouteFetchAllQueryDeps,
  ProfileRouteQueryOptions,
} from "@/lib/query/profile-route.query";

function useProfileRouteFetchAllQuery({ filters }: ProfileRouteFetchAllQueryDeps = {}) {
  return useQuery(ProfileRouteQueryOptions.fetchAll({ filters }));
}

export { useProfileRouteFetchAllQuery };
