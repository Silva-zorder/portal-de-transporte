import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/client";
import { CustomerQueryKeys } from "@/lib/query/customer.query";
import {
  type CustomerUpdateRequest,
  CustomerService,
} from "@/services/portal/v1/customer.service";

function useCustomerUpdateMutation() {
  return useMutation({
    mutationFn: (request: CustomerUpdateRequest) =>
      CustomerService.update(request),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: CustomerQueryKeys.all() }),
  });
}

export { useCustomerUpdateMutation };
