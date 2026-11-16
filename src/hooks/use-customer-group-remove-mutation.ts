import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/client";
import { CustomerGroupQueryKeys } from "@/lib/query/customer-group.query";
import {
  type CustomerGroupRemoveRequest,
  CustomerGroupService,
} from "@/services/portal/v1/customer-group.service";

function useCustomerGroupRemoveMutation() {
  return useMutation({
    mutationFn: (request: CustomerGroupRemoveRequest) =>
      CustomerGroupService.remove(request),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: CustomerGroupQueryKeys.all() }),
  });
}

export { useCustomerGroupRemoveMutation };
