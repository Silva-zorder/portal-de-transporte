import { api } from "./api";

type Reconciliation = {
  id: number;
  date: string;
  customerName: string;
  cnpj: string;
  tolerance: number;
  cteCount: number;
  itemCount: number;
  totalValue: number;
  calculatedFreight: number;
  difference: number;
  reconciledPercent: number;
  status: string;
};

type ReconciliationFetchAllRequest = { filters?: Partial<Reconciliation> };
type ReconciliationFetchAllResponse = Reconciliation[];
type ReconciliationFindByIdRequest = Pick<Reconciliation, "id">;
type ReconciliationFindByIdResponse = Reconciliation;
type ReconciliationCreateRequest = Omit<Reconciliation, "id">;
type ReconciliationCreateResponse = Reconciliation;
type ReconciliationUpdateRequest = Pick<Reconciliation, "id"> & Partial<Reconciliation>;
type ReconciliationUpdateResponse = Reconciliation;
type ReconciliationRemoveRequest = Pick<Reconciliation, "id">;

const ReconciliationService = {
  fetchAll: async ({ filters }: ReconciliationFetchAllRequest = {}) => {
    const res = await api.get<ReconciliationFetchAllResponse>("/reconciliations", {
      params: filters,
    });
    return res.data;
  },
  findById: async ({ id }: ReconciliationFindByIdRequest) => {
    const res = await api.get<ReconciliationFindByIdResponse>(
      "/reconciliations/:id".replace(":id", String(id)),
    );
    return res.data;
  },
  create: async (request: ReconciliationCreateRequest) => {
    const res = await api.post<ReconciliationCreateResponse>("/reconciliations", request);
    return res.data;
  },
  update: async ({ id, ...changes }: ReconciliationUpdateRequest) => {
    const res = await api.put<ReconciliationUpdateResponse>(
      "/reconciliations/:id".replace(":id", String(id)),
      changes,
    );
    return res.data;
  },
  remove: async ({ id }: ReconciliationRemoveRequest) => {
    await api.delete("/reconciliations/:id".replace(":id", String(id)));
  },
} as const;

export {
  type Reconciliation,
  type ReconciliationCreateRequest,
  type ReconciliationCreateResponse,
  type ReconciliationFetchAllRequest,
  type ReconciliationFetchAllResponse,
  type ReconciliationFindByIdRequest,
  type ReconciliationFindByIdResponse,
  type ReconciliationRemoveRequest,
  ReconciliationService,
  type ReconciliationUpdateRequest,
  type ReconciliationUpdateResponse,
};
