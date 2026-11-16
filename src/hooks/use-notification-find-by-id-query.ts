import { useQuery } from "@tanstack/react-query";
import {
  type NotificationFindByIdQueryDeps,
  NotificationQueryOptions,
} from "@/lib/query/notification.query";

function useNotificationFindByIdQuery({ id }: NotificationFindByIdQueryDeps) {
  return useQuery(NotificationQueryOptions.findById({ id }));
}

export { useNotificationFindByIdQuery };
