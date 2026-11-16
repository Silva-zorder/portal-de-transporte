import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/client";
import { CustomerGroupMemberQueryKeys } from "@/lib/query/customer-group-member.query";
import {
  type CustomerGroupMemberCreateRequest,
  CustomerGroupMemberService,
} from "@/services/portal/v1/customer-group-member.service";

function useCustomerGroupMemberCreateMutation() {
  return useMutation({
    mutationFn: (request: CustomerGroupMemberCreateRequest) =>
      CustomerGroupMemberService.create(request),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: CustomerGroupMemberQueryKeys.all() }),
  });
}

export { useCustomerGroupMemberCreateMutation };
