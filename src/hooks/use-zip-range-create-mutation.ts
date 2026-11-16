import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/client";
import { ZipRangeQueryKeys } from "@/lib/query/zip-range.query";
import {
  type ZipRangeCreateRequest,
  ZipRangeService,
} from "@/services/portal/v1/zip-range.service";

function useZipRangeCreateMutation() {
  return useMutation({
    mutationFn: (request: ZipRangeCreateRequest) =>
      ZipRangeService.create(request),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ZipRangeQueryKeys.all() }),
  });
}

export { useZipRangeCreateMutation };
