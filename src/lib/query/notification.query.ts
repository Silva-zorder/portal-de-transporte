import { queryOptions } from "@tanstack/react-query";
import {
  type NotificationFetchAllRequest,
  type NotificationFindByIdRequest,
  NotificationService,
} from "@/services/portal/v1/notification.service";

type NotificationFetchAllQueryDeps = NotificationFetchAllRequest;
type NotificationFindByIdQueryDeps = NotificationFindByIdRequest;

const NotificationQueryKeys = {
  all: () => ["notification"] as const,
  fetchAll: ({ filters }: NotificationFetchAllQueryDeps = {}) =>
    ["notification", "fetch-all", filters ?? {}] as const,
  findById: ({ id }: NotificationFindByIdQueryDeps) =>
    ["notification", "find-by-id", id] as const,
} as const;

const NotificationQueryOptions = {
  fetchAll: ({ filters }: NotificationFetchAllQueryDeps = {}) =>
    queryOptions({
      queryKey: NotificationQueryKeys.fetchAll({ filters }),
      queryFn: () => NotificationService.fetchAll({ filters }),
    }),
  findById: ({ id }: NotificationFindByIdQueryDeps) =>
    queryOptions({
      queryKey: NotificationQueryKeys.findById({ id }),
      queryFn: () => NotificationService.findById({ id }),
    }),
} as const;

export {
  type NotificationFetchAllQueryDeps,
  type NotificationFindByIdQueryDeps,
  NotificationQueryKeys,
  NotificationQueryOptions,
};
