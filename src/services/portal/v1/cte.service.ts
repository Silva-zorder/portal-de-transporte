import { api } from "./api";

type Cte = {
  id: number;
  number: string;
  customerIdentifier: string;
  customerName: string;
  competence: string;
  key: string;
  issuedAt: string;
  dueDate: string;
  carrierService: string;
  storeCnpj: string;
  issuerCnpj: string;
  recipientCnpj: string;
  invoice: string;
  freightValue: number;
  reconciled: boolean;
};

type CteFetchAllRequest = { filters?: Partial<Cte> };
type CteFetchAllResponse = Cte[];
type CteFindByIdRequest = Pick<Cte, "id">;
type CteFindByIdResponse = Cte;
type CteCreateRequest = Omit<Cte, "id">;
type CteCreateResponse = Cte;
type CteUpdateRequest = Pick<Cte, "id"> & Partial<Cte>;
type CteUpdateResponse = Cte;
type CteRemoveRequest = Pick<Cte, "id">;

const CteService = {
  fetchAll: async ({ filters }: CteFetchAllRequest = {}) => {
    const res = await api.get<CteFetchAllResponse>("/ctes", {
      params: filters,
    });
    return res.data;
  },
  findById: async ({ id }: CteFindByIdRequest) => {
    const res = await api.get<CteFindByIdResponse>(
      "/ctes/:id".replace(":id", String(id)),
    );
    return res.data;
  },
  create: async (request: CteCreateRequest) => {
    const res = await api.post<CteCreateResponse>("/ctes", request);
    return res.data;
  },
  update: async ({ id, ...changes }: CteUpdateRequest) => {
    const res = await api.put<CteUpdateResponse>(
      "/ctes/:id".replace(":id", String(id)),
      changes,
    );
    return res.data;
  },
  remove: async ({ id }: CteRemoveRequest) => {
    await api.delete("/ctes/:id".replace(":id", String(id)));
  },
} as const;

export {
  type Cte,
  type CteCreateRequest,
  type CteCreateResponse,
  type CteFetchAllRequest,
  type CteFetchAllResponse,
  type CteFindByIdRequest,
  type CteFindByIdResponse,
  type CteRemoveRequest,
  CteService,
  type CteUpdateRequest,
  type CteUpdateResponse,
};
