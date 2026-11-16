import { useQuery } from "@tanstack/react-query";
import {
  type NotificationFetchAllQueryDeps,
  NotificationQueryOptions,
} from "@/lib/query/notification.query";

function useNotificationFetchAllQuery({ filters }: NotificationFetchAllQueryDeps = {}) {
  return useQuery(NotificationQueryOptions.fetchAll({ filters }));
}

export { useNotificationFetchAllQuery };
