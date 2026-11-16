import { useQuery } from "@tanstack/react-query";
import {
  type UserProfileFindByIdQueryDeps,
  UserProfileQueryOptions,
} from "@/lib/query/user-profile.query";

function useUserProfileFindByIdQuery({ id }: UserProfileFindByIdQueryDeps) {
  return useQuery(UserProfileQueryOptions.findById({ id }));
}

export { useUserProfileFindByIdQuery };
