import { useQuery } from "@tanstack/react-query";
import {
  type UserGroupFetchAllQueryDeps,
  UserGroupQueryOptions,
} from "@/lib/query/user-group.query";

function useUserGroupFetchAllQuery({ filters }: UserGroupFetchAllQueryDeps = {}) {
  return useQuery(UserGroupQueryOptions.fetchAll({ filters }));
}

export { useUserGroupFetchAllQuery };
