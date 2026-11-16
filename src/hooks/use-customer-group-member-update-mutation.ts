import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/client";
import { CustomerGroupMemberQueryKeys } from "@/lib/query/customer-group-member.query";
import {
  type CustomerGroupMemberUpdateRequest,
  CustomerGroupMemberService,
} from "@/services/portal/v1/customer-group-member.service";

function useCustomerGroupMemberUpdateMutation() {
  return useMutation({
    mutationFn: (request: CustomerGroupMemberUpdateRequest) =>
      CustomerGroupMemberService.update(request),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: CustomerGroupMemberQueryKeys.all() }),
  });
}

export { useCustomerGroupMemberUpdateMutation };
