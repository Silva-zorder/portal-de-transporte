import { queryOptions } from "@tanstack/react-query";
import {
  type UserProfileFetchAllRequest,
  type UserProfileFindByIdRequest,
  UserProfileService,
} from "@/services/portal/v1/user-profile.service";

type UserProfileFetchAllQueryDeps = UserProfileFetchAllRequest;
type UserProfileFindByIdQueryDeps = UserProfileFindByIdRequest;

const UserProfileQueryKeys = {
  all: () => ["user-profile"] as const,
  fetchAll: ({ filters }: UserProfileFetchAllQueryDeps = {}) =>
    ["user-profile", "fetch-all", filters ?? {}] as const,
  findById: ({ id }: UserProfileFindByIdQueryDeps) =>
    ["user-profile", "find-by-id", id] as const,
} as const;

const UserProfileQueryOptions = {
  fetchAll: ({ filters }: UserProfileFetchAllQueryDeps = {}) =>
    queryOptions({
      queryKey: UserProfileQueryKeys.fetchAll({ filters }),
      queryFn: () => UserProfileService.fetchAll({ filters }),
    }),
  findById: ({ id }: UserProfileFindByIdQueryDeps) =>
    queryOptions({
      queryKey: UserProfileQueryKeys.findById({ id }),
      queryFn: () => UserProfileService.findById({ id }),
    }),
} as const;

export {
  type UserProfileFetchAllQueryDeps,
  type UserProfileFindByIdQueryDeps,
  UserProfileQueryKeys,
  UserProfileQueryOptions,
};
