import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/client";
import { CustomerGroupQueryKeys } from "@/lib/query/customer-group.query";
import {
  type CustomerGroupCreateRequest,
  CustomerGroupService,
} from "@/services/portal/v1/customer-group.service";

function useCustomerGroupCreateMutation() {
  return useMutation({
    mutationFn: (request: CustomerGroupCreateRequest) =>
      CustomerGroupService.create(request),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: CustomerGroupQueryKeys.all() }),
  });
}

export { useCustomerGroupCreateMutation };
