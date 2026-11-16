import { api } from "./api";

type ReconciliationCte = {
  id: number;
  reconciliationId: number;
  issuedAt: string;
  cteValue: number;
  calculatedFreight: number;
  difference: number;
  status: string;
};

type ReconciliationCteFetchAllRequest = { filters?: Partial<ReconciliationCte> };
type ReconciliationCteFetchAllResponse = ReconciliationCte[];
type ReconciliationCteFindByIdRequest = Pick<ReconciliationCte, "id">;
type ReconciliationCteFindByIdResponse = ReconciliationCte;
type ReconciliationCteCreateRequest = Omit<ReconciliationCte, "id">;
type ReconciliationCteCreateResponse = ReconciliationCte;
type ReconciliationCteUpdateRequest = Pick<ReconciliationCte, "id"> & Partial<ReconciliationCte>;
type ReconciliationCteUpdateResponse = ReconciliationCte;
type ReconciliationCteRemoveRequest = Pick<ReconciliationCte, "id">;

const ReconciliationCteService = {
  fetchAll: async ({ filters }: ReconciliationCteFetchAllRequest = {}) => {
    const res = await api.get<ReconciliationCteFetchAllResponse>("/reconciliation-ctes", {
      params: filters,
    });
    return res.data;
  },
  findById: async ({ id }: ReconciliationCteFindByIdRequest) => {
    const res = await api.get<ReconciliationCteFindByIdResponse>(
      "/reconciliation-ctes/:id".replace(":id", String(id)),
    );
    return res.data;
  },
  create: async (request: ReconciliationCteCreateRequest) => {
    const res = await api.post<ReconciliationCteCreateResponse>("/reconciliation-ctes", request);
    return res.data;
  },
  update: async ({ id, ...changes }: ReconciliationCteUpdateRequest) => {
    const res = await api.put<ReconciliationCteUpdateResponse>(
      "/reconciliation-ctes/:id".replace(":id", String(id)),
      changes,
    );
    return res.data;
  },
  remove: async ({ id }: ReconciliationCteRemoveRequest) => {
    await api.delete("/reconciliation-ctes/:id".replace(":id", String(id)));
  },
} as const;

export {
  type ReconciliationCte,
  type ReconciliationCteCreateRequest,
  type ReconciliationCteCreateResponse,
  type ReconciliationCteFetchAllRequest,
  type ReconciliationCteFetchAllResponse,
  type ReconciliationCteFindByIdRequest,
  type ReconciliationCteFindByIdResponse,
  type ReconciliationCteRemoveRequest,
  ReconciliationCteService,
  type ReconciliationCteUpdateRequest,
  type ReconciliationCteUpdateResponse,
};
