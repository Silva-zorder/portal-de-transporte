import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/client";
import { NotificationRequestQueryKeys } from "@/lib/query/notification-request.query";
import {
  type NotificationRequestUpdateRequest,
  NotificationRequestService,
} from "@/services/portal/v1/notification-request.service";

function useNotificationRequestUpdateMutation() {
  return useMutation({
    mutationFn: (request: NotificationRequestUpdateRequest) =>
      NotificationRequestService.update(request),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: NotificationRequestQueryKeys.all() }),
  });
}

export { useNotificationRequestUpdateMutation };
