import { useQuery } from "@tanstack/react-query";
import {
  type NotificationRequestFetchAllQueryDeps,
  NotificationRequestQueryOptions,
} from "@/lib/query/notification-request.query";

function useNotificationRequestFetchAllQuery({ filters }: NotificationRequestFetchAllQueryDeps = {}) {
  return useQuery(NotificationRequestQueryOptions.fetchAll({ filters }));
}

export { useNotificationRequestFetchAllQuery };
