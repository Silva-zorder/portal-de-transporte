import { useQuery } from "@tanstack/react-query";
import {
  type ProfileFetchAllQueryDeps,
  ProfileQueryOptions,
} from "@/lib/query/profile.query";

function useProfileFetchAllQuery({ filters }: ProfileFetchAllQueryDeps = {}) {
  return useQuery(ProfileQueryOptions.fetchAll({ filters }));
}

export { useProfileFetchAllQuery };
