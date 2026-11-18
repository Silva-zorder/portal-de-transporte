import { queryOptions } from "@tanstack/react-query";
import {
  type NotificationRequestFetchAllRequest,
  type NotificationRequestFindByIdRequest,
  NotificationRequestService,
} from "@/services/portal/v1/notification-request.service";

type NotificationRequestFetchAllQueryDeps = NotificationRequestFetchAllRequest;
type NotificationRequestFindByIdQueryDeps = NotificationRequestFindByIdRequest;

const NotificationRequestQueryKeys = {
  all: () => ["notification-request"] as const,
  fetchAll: ({ filters }: NotificationRequestFetchAllQueryDeps = {}) =>
    ["notification-request", "fetch-all", filters ?? {}] as const,
  findById: ({ id }: NotificationRequestFindByIdQueryDeps) =>
    ["notification-request", "find-by-id", id] as const,
} as const;

const NotificationRequestQueryOptions = {
  fetchAll: ({ filters }: NotificationRequestFetchAllQueryDeps = {}) =>
    queryOptions({
      queryKey: NotificationRequestQueryKeys.fetchAll({ filters }),
      queryFn: () => NotificationRequestService.fetchAll({ filters }),
    }),
  findById: ({ id }: NotificationRequestFindByIdQueryDeps) =>
    queryOptions({
      queryKey: NotificationRequestQueryKeys.findById({ id }),
      queryFn: () => NotificationRequestService.findById({ id }),
    }),
} as const;

export {
  type NotificationRequestFetchAllQueryDeps,
  type NotificationRequestFindByIdQueryDeps,
  NotificationRequestQueryKeys,
  NotificationRequestQueryOptions,
};
