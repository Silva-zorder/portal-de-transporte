import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/client";
import { ZipRangeQueryKeys } from "@/lib/query/zip-range.query";
import {
  type ZipRangeUpdateRequest,
  ZipRangeService,
} from "@/services/portal/v1/zip-range.service";

function useZipRangeUpdateMutation() {
  return useMutation({
    mutationFn: (request: ZipRangeUpdateRequest) =>
      ZipRangeService.update(request),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ZipRangeQueryKeys.all() }),
  });
}

export { useZipRangeUpdateMutation };
