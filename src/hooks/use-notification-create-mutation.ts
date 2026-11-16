import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/client";
import { NotificationQueryKeys } from "@/lib/query/notification.query";
import {
  type NotificationCreateRequest,
  NotificationService,
} from "@/services/portal/v1/notification.service";

function useNotificationCreateMutation() {
  return useMutation({
    mutationFn: (request: NotificationCreateRequest) =>
      NotificationService.create(request),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: NotificationQueryKeys.all() }),
  });
}

export { useNotificationCreateMutation };
