import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/client";
import { CustomerQueryKeys } from "@/lib/query/customer.query";
import {
  type CustomerCreateRequest,
  CustomerService,
} from "@/services/portal/v1/customer.service";

function useCustomerCreateMutation() {
  return useMutation({
    mutationFn: (request: CustomerCreateRequest) =>
      CustomerService.create(request),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: CustomerQueryKeys.all() }),
  });
}

export { useCustomerCreateMutation };
