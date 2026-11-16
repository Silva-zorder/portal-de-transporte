import { api } from "./api";

type BillingDocument = {
  id: number;
  type: string;
  identifier: string;
  competence: string;
  value: number;
  file: string;
  status: string;
  date: string;
};

type BillingDocumentFetchAllRequest = { filters?: Partial<BillingDocument> };
type BillingDocumentFetchAllResponse = BillingDocument[];
type BillingDocumentFindByIdRequest = Pick<BillingDocument, "id">;
type BillingDocumentFindByIdResponse = BillingDocument;
type BillingDocumentCreateRequest = Omit<BillingDocument, "id">;
type BillingDocumentCreateResponse = BillingDocument;
type BillingDocumentUpdateRequest = Pick<BillingDocument, "id"> & Partial<BillingDocument>;
type BillingDocumentUpdateResponse = BillingDocument;
type BillingDocumentRemoveRequest = Pick<BillingDocument, "id">;

const BillingDocumentService = {
  fetchAll: async ({ filters }: BillingDocumentFetchAllRequest = {}) => {
    const res = await api.get<BillingDocumentFetchAllResponse>("/billing-documents", {
      params: filters,
    });
    return res.data;
  },
  findById: async ({ id }: BillingDocumentFindByIdRequest) => {
    const res = await api.get<BillingDocumentFindByIdResponse>(
      "/billing-documents/:id".replace(":id", String(id)),
    );
    return res.data;
  },
  create: async (request: BillingDocumentCreateRequest) => {
    const res = await api.post<BillingDocumentCreateResponse>("/billing-documents", request);
    return res.data;
  },
  update: async ({ id, ...changes }: BillingDocumentUpdateRequest) => {
    const res = await api.put<BillingDocumentUpdateResponse>(
      "/billing-documents/:id".replace(":id", String(id)),
      changes,
    );
    return res.data;
  },
  remove: async ({ id }: BillingDocumentRemoveRequest) => {
    await api.delete("/billing-documents/:id".replace(":id", String(id)));
  },
} as const;

export {
  type BillingDocument,
  type BillingDocumentCreateRequest,
  type BillingDocumentCreateResponse,
  type BillingDocumentFetchAllRequest,
  type BillingDocumentFetchAllResponse,
  type BillingDocumentFindByIdRequest,
  type BillingDocumentFindByIdResponse,
  type BillingDocumentRemoveRequest,
  BillingDocumentService,
  type BillingDocumentUpdateRequest,
  type BillingDocumentUpdateResponse,
};
