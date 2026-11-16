import { api } from "./api";

type ZipRange = {
  id: number;
  deadlineTableId: number;
  tariffAcronym: string;
  zipStart: string;
  zipEnd: string;
  days: number;
};

type ZipRangeFetchAllRequest = { filters?: Partial<ZipRange> };
type ZipRangeFetchAllResponse = ZipRange[];
type ZipRangeFindByIdRequest = Pick<ZipRange, "id">;
type ZipRangeFindByIdResponse = ZipRange;
type ZipRangeCreateRequest = Omit<ZipRange, "id">;
type ZipRangeCreateResponse = ZipRange;
type ZipRangeUpdateRequest = Pick<ZipRange, "id"> & Partial<ZipRange>;
type ZipRangeUpdateResponse = ZipRange;
type ZipRangeRemoveRequest = Pick<ZipRange, "id">;

const ZipRangeService = {
  fetchAll: async ({ filters }: ZipRangeFetchAllRequest = {}) => {
    const res = await api.get<ZipRangeFetchAllResponse>("/zip-ranges", {
      params: filters,
    });
    return res.data;
  },
  findById: async ({ id }: ZipRangeFindByIdRequest) => {
    const res = await api.get<ZipRangeFindByIdResponse>(
      "/zip-ranges/:id".replace(":id", String(id)),
    );
    return res.data;
  },
  create: async (request: ZipRangeCreateRequest) => {
    const res = await api.post<ZipRangeCreateResponse>("/zip-ranges", request);
    return res.data;
  },
  update: async ({ id, ...changes }: ZipRangeUpdateRequest) => {
    const res = await api.put<ZipRangeUpdateResponse>(
      "/zip-ranges/:id".replace(":id", String(id)),
      changes,
    );
    return res.data;
  },
  remove: async ({ id }: ZipRangeRemoveRequest) => {
    await api.delete("/zip-ranges/:id".replace(":id", String(id)));
  },
} as const;

export {
  type ZipRange,
  type ZipRangeCreateRequest,
  type ZipRangeCreateResponse,
  type ZipRangeFetchAllRequest,
  type ZipRangeFetchAllResponse,
  type ZipRangeFindByIdRequest,
  type ZipRangeFindByIdResponse,
  type ZipRangeRemoveRequest,
  ZipRangeService,
  type ZipRangeUpdateRequest,
  type ZipRangeUpdateResponse,
};
