import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/client";
import { CustomerGroupMemberQueryKeys } from "@/lib/query/customer-group-member.query";
import {
  type CustomerGroupMemberRemoveRequest,
  CustomerGroupMemberService,
} from "@/services/portal/v1/customer-group-member.service";

function useCustomerGroupMemberRemoveMutation() {
  return useMutation({
    mutationFn: (request: CustomerGroupMemberRemoveRequest) =>
      CustomerGroupMemberService.remove(request),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: CustomerGroupMemberQueryKeys.all() }),
  });
}

export { useCustomerGroupMemberRemoveMutation };
