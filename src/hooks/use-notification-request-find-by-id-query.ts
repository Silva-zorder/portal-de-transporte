import { useQuery } from "@tanstack/react-query";
import {
  type NotificationRequestFindByIdQueryDeps,
  NotificationRequestQueryOptions,
} from "@/lib/query/notification-request.query";

function useNotificationRequestFindByIdQuery({ id }: NotificationRequestFindByIdQueryDeps) {
  return useQuery(NotificationRequestQueryOptions.findById({ id }));
}

export { useNotificationRequestFindByIdQuery };
