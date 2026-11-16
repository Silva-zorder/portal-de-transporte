import { useQuery } from "@tanstack/react-query";
import {
  type UserGroupFindByIdQueryDeps,
  UserGroupQueryOptions,
} from "@/lib/query/user-group.query";

function useUserGroupFindByIdQuery({ id }: UserGroupFindByIdQueryDeps) {
  return useQuery(UserGroupQueryOptions.findById({ id }));
}

export { useUserGroupFindByIdQuery };
