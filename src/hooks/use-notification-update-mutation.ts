import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/client";
import { NotificationQueryKeys } from "@/lib/query/notification.query";
import {
  type NotificationUpdateRequest,
  NotificationService,
} from "@/services/portal/v1/notification.service";

function useNotificationUpdateMutation() {
  return useMutation({
    mutationFn: (request: NotificationUpdateRequest) =>
      NotificationService.update(request),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: NotificationQueryKeys.all() }),
  });
}

export { useNotificationUpdateMutation };
