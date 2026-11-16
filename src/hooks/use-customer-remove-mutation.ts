import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/client";
import { CustomerQueryKeys } from "@/lib/query/customer.query";
import {
  type CustomerRemoveRequest,
  CustomerService,
} from "@/services/portal/v1/customer.service";

function useCustomerRemoveMutation() {
  return useMutation({
    mutationFn: (request: CustomerRemoveRequest) =>
      CustomerService.remove(request),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: CustomerQueryKeys.all() }),
  });
}

export { useCustomerRemoveMutation };
