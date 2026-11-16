import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/client";
import { NotificationQueryKeys } from "@/lib/query/notification.query";
import {
  type NotificationRemoveRequest,
  NotificationService,
} from "@/services/portal/v1/notification.service";

function useNotificationRemoveMutation() {
  return useMutation({
    mutationFn: (request: NotificationRemoveRequest) =>
      NotificationService.remove(request),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: NotificationQueryKeys.all() }),
  });
}

export { useNotificationRemoveMutation };
