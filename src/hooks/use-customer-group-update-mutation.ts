import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/client";
import { CustomerGroupQueryKeys } from "@/lib/query/customer-group.query";
import {
  type CustomerGroupUpdateRequest,
  CustomerGroupService,
} from "@/services/portal/v1/customer-group.service";

function useCustomerGroupUpdateMutation() {
  return useMutation({
    mutationFn: (request: CustomerGroupUpdateRequest) =>
      CustomerGroupService.update(request),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: CustomerGroupQueryKeys.all() }),
  });
}

export { useCustomerGroupUpdateMutation };
