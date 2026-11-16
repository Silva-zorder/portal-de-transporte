import { useQuery } from "@tanstack/react-query";
import {
  type UserProfileFetchAllQueryDeps,
  UserProfileQueryOptions,
} from "@/lib/query/user-profile.query";

function useUserProfileFetchAllQuery({ filters }: UserProfileFetchAllQueryDeps = {}) {
  return useQuery(UserProfileQueryOptions.fetchAll({ filters }));
}

export { useUserProfileFetchAllQuery };
