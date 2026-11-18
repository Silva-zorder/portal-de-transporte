import { queryOptions } from "@tanstack/react-query";
import {
  type ProfileRouteFetchAllRequest,
  type ProfileRouteFindByIdRequest,
  ProfileRouteService,
} from "@/services/portal/v1/profile-route.service";

type ProfileRouteFetchAllQueryDeps = ProfileRouteFetchAllRequest;
type ProfileRouteFindByIdQueryDeps = ProfileRouteFindByIdRequest;

const ProfileRouteQueryKeys = {
  all: () => ["profile-route"] as const,
  fetchAll: ({ filters }: ProfileRouteFetchAllQueryDeps = {}) =>
    ["profile-route", "fetch-all", filters ?? {}] as const,
  findById: ({ id }: ProfileRouteFindByIdQueryDeps) =>
    ["profile-route", "find-by-id", id] as const,
} as const;

const ProfileRouteQueryOptions = {
  fetchAll: ({ filters }: ProfileRouteFetchAllQueryDeps = {}) =>
    queryOptions({
      queryKey: ProfileRouteQueryKeys.fetchAll({ filters }),
      queryFn: () => ProfileRouteService.fetchAll({ filters }),
    }),
  findById: ({ id }: ProfileRouteFindByIdQueryDeps) =>
    queryOptions({
      queryKey: ProfileRouteQueryKeys.findById({ id }),
      queryFn: () => ProfileRouteService.findById({ id }),
    }),
} as const;

export {
  type ProfileRouteFetchAllQueryDeps,
  type ProfileRouteFindByIdQueryDeps,
  ProfileRouteQueryKeys,
  ProfileRouteQueryOptions,
};
