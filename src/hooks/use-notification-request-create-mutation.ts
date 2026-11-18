import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/client";
import { NotificationRequestQueryKeys } from "@/lib/query/notification-request.query";
import {
  type NotificationRequestCreateRequest,
  NotificationRequestService,
} from "@/services/portal/v1/notification-request.service";

function useNotificationRequestCreateMutation() {
  return useMutation({
    mutationFn: (request: NotificationRequestCreateRequest) =>
      NotificationRequestService.create(request),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: NotificationRequestQueryKeys.all() }),
  });
}

export { useNotificationRequestCreateMutation };
