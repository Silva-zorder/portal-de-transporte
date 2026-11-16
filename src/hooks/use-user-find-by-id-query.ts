import { useQuery } from "@tanstack/react-query";
import {
  type UserFindByIdQueryDeps,
  UserQueryOptions,
} from "@/lib/query/user.query";

function useUserFindByIdQuery({ id }: UserFindByIdQueryDeps) {
  return useQuery(UserQueryOptions.findById({ id }));
}

export { useUserFindByIdQuery };
