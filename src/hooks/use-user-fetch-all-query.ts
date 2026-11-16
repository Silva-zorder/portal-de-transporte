import { useQuery } from "@tanstack/react-query";
import {
  type UserFetchAllQueryDeps,
  UserQueryOptions,
} from "@/lib/query/user.query";

function useUserFetchAllQuery({ filters }: UserFetchAllQueryDeps = {}) {
  return useQuery(UserQueryOptions.fetchAll({ filters }));
}

export { useUserFetchAllQuery };
