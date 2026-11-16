import { useQuery } from "@tanstack/react-query";
import {
  type LogFindByIdQueryDeps,
  LogQueryOptions,
} from "@/lib/query/log.query";

function useLogFindByIdQuery({ id }: LogFindByIdQueryDeps) {
  return useQuery(LogQueryOptions.findById({ id }));
}

export { useLogFindByIdQuery };
