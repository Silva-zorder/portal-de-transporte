import { queryOptions } from "@tanstack/react-query";
import {
  type UserFetchAllRequest,
  type UserFindByIdRequest,
  UserService,
} from "@/services/portal/v1/user.service";

type UserFetchAllQueryDeps = UserFetchAllRequest;
type UserFindByIdQueryDeps = UserFindByIdRequest;

const UserQueryKeys = {
  all: () => ["user"] as const,
  fetchAll: ({ filters }: UserFetchAllQueryDeps = {}) =>
    ["user", "fetch-all", filters ?? {}] as const,
  findById: ({ id }: UserFindByIdQueryDeps) =>
    ["user", "find-by-id", id] as const,
} as const;

const UserQueryOptions = {
  fetchAll: ({ filters }: UserFetchAllQueryDeps = {}) =>
    queryOptions({
      queryKey: UserQueryKeys.fetchAll({ filters }),
      queryFn: () => UserService.fetchAll({ filters }),
    }),
  findById: ({ id }: UserFindByIdQueryDeps) =>
    queryOptions({
      queryKey: UserQueryKeys.findById({ id }),
      queryFn: () => UserService.findById({ id }),
    }),
} as const;

export {
  type UserFetchAllQueryDeps,
  type UserFindByIdQueryDeps,
  UserQueryKeys,
  UserQueryOptions,
};
