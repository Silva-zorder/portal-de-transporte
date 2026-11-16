import { queryOptions } from "@tanstack/react-query";
import {
  type UserGroupFetchAllRequest,
  type UserGroupFindByIdRequest,
  UserGroupService,
} from "@/services/portal/v1/user-group.service";

type UserGroupFetchAllQueryDeps = UserGroupFetchAllRequest;
type UserGroupFindByIdQueryDeps = UserGroupFindByIdRequest;

const UserGroupQueryKeys = {
  all: () => ["user-group"] as const,
  fetchAll: ({ filters }: UserGroupFetchAllQueryDeps = {}) =>
    ["user-group", "fetch-all", filters ?? {}] as const,
  findById: ({ id }: UserGroupFindByIdQueryDeps) =>
    ["user-group", "find-by-id", id] as const,
} as const;

const UserGroupQueryOptions = {
  fetchAll: ({ filters }: UserGroupFetchAllQueryDeps = {}) =>
    queryOptions({
      queryKey: UserGroupQueryKeys.fetchAll({ filters }),
      queryFn: () => UserGroupService.fetchAll({ filters }),
    }),
  findById: ({ id }: UserGroupFindByIdQueryDeps) =>
    queryOptions({
      queryKey: UserGroupQueryKeys.findById({ id }),
      queryFn: () => UserGroupService.findById({ id }),
    }),
} as const;

export {
  type UserGroupFetchAllQueryDeps,
  type UserGroupFindByIdQueryDeps,
  UserGroupQueryKeys,
  UserGroupQueryOptions,
};
