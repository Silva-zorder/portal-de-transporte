import { useQuery } from "@tanstack/react-query";
import {
  type LogFetchAllQueryDeps,
  LogQueryOptions,
} from "@/lib/query/log.query";

function useLogFetchAllQuery({ filters }: LogFetchAllQueryDeps = {}) {
  return useQuery(LogQueryOptions.fetchAll({ filters }));
}

export { useLogFetchAllQuery };
