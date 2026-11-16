import { useQuery } from "@tanstack/react-query";
import {
  type ProfileFindByIdQueryDeps,
  ProfileQueryOptions,
} from "@/lib/query/profile.query";

function useProfileFindByIdQuery({ id }: ProfileFindByIdQueryDeps) {
  return useQuery(ProfileQueryOptions.findById({ id }));
}

export { useProfileFindByIdQuery };
