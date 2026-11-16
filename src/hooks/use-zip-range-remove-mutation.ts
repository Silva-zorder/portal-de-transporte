import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/client";
import { ZipRangeQueryKeys } from "@/lib/query/zip-range.query";
import {
  type ZipRangeRemoveRequest,
  ZipRangeService,
} from "@/services/portal/v1/zip-range.service";

function useZipRangeRemoveMutation() {
  return useMutation({
    mutationFn: (request: ZipRangeRemoveRequest) =>
      ZipRangeService.remove(request),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ZipRangeQueryKeys.all() }),
  });
}

export { useZipRangeRemoveMutation };
