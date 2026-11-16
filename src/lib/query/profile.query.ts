import { queryOptions } from "@tanstack/react-query";
import {
  type ProfileFetchAllRequest,
  type ProfileFindByIdRequest,
  ProfileService,
} from "@/services/portal/v1/profile.service";

type ProfileFetchAllQueryDeps = ProfileFetchAllRequest;
type ProfileFindByIdQueryDeps = ProfileFindByIdRequest;

const ProfileQueryKeys = {
  all: () => ["profile"] as const,
  fetchAll: ({ filters }: ProfileFetchAllQueryDeps = {}) =>
    ["profile", "fetch-all", filters ?? {}] as const,
  findById: ({ id }: ProfileFindByIdQueryDeps) =>
    ["profile", "find-by-id", id] as const,
} as const;

const ProfileQueryOptions = {
  fetchAll: ({ filters }: ProfileFetchAllQueryDeps = {}) =>
    queryOptions({
      queryKey: ProfileQueryKeys.fetchAll({ filters }),
      queryFn: () => ProfileService.fetchAll({ filters }),
    }),
  findById: ({ id }: ProfileFindByIdQueryDeps) =>
    queryOptions({
      queryKey: ProfileQueryKeys.findById({ id }),
      queryFn: () => ProfileService.findById({ id }),
    }),
} as const;

export {
  type ProfileFetchAllQueryDeps,
  type ProfileFindByIdQueryDeps,
  ProfileQueryKeys,
  ProfileQueryOptions,
};
