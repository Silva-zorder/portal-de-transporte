import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/client";
import { NotificationRequestQueryKeys } from "@/lib/query/notification-request.query";
import {
  type NotificationRequestRemoveRequest,
  NotificationRequestService,
} from "@/services/portal/v1/notification-request.service";

function useNotificationRequestRemoveMutation() {
  return useMutation({
    mutationFn: (request: NotificationRequestRemoveRequest) =>
      NotificationRequestService.remove(request),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: NotificationRequestQueryKeys.all() }),
  });
}

export { useNotificationRequestRemoveMutation };
