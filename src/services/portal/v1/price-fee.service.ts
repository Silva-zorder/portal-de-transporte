import { api } from "./api";

type PriceFee = {
  id: number;
  priceTableId: number;
  zipStart: string;
  zipEnd: string;
  type: string;
  calculationBase: string;
  value: number;
  order: number;
};

type PriceFeeFetchAllRequest = { filters?: Partial<PriceFee> };
type PriceFeeFetchAllResponse = PriceFee[];
type PriceFeeFindByIdRequest = Pick<PriceFee, "id">;
type PriceFeeFindByIdResponse = PriceFee;
type PriceFeeCreateRequest = Omit<PriceFee, "id">;
type PriceFeeCreateResponse = PriceFee;
type PriceFeeUpdateRequest = Pick<PriceFee, "id"> & Partial<PriceFee>;
type PriceFeeUpdateResponse = PriceFee;
type PriceFeeRemoveRequest = Pick<PriceFee, "id">;

const PriceFeeService = {
  fetchAll: async ({ filters }: PriceFeeFetchAllRequest = {}) => {
    const res = await api.get<PriceFeeFetchAllResponse>("/price-fees", {
      params: filters,
    });
    return res.data;
  },
  findById: async ({ id }: PriceFeeFindByIdRequest) => {
    const res = await api.get<PriceFeeFindByIdResponse>(
      "/price-fees/:id".replace(":id", String(id)),
    );
    return res.data;
  },
  create: async (request: PriceFeeCreateRequest) => {
    const res = await api.post<PriceFeeCreateResponse>("/price-fees", request);
    return res.data;
  },
  update: async ({ id, ...changes }: PriceFeeUpdateRequest) => {
    const res = await api.put<PriceFeeUpdateResponse>(
      "/price-fees/:id".replace(":id", String(id)),
      changes,
    );
    return res.data;
  },
  remove: async ({ id }: PriceFeeRemoveRequest) => {
    await api.delete("/price-fees/:id".replace(":id", String(id)));
  },
} as const;

export {
  type PriceFee,
  type PriceFeeCreateRequest,
  type PriceFeeCreateResponse,
  type PriceFeeFetchAllRequest,
  type PriceFeeFetchAllResponse,
  type PriceFeeFindByIdRequest,
  type PriceFeeFindByIdResponse,
  type PriceFeeRemoveRequest,
  PriceFeeService,
  type PriceFeeUpdateRequest,
  type PriceFeeUpdateResponse,
};
