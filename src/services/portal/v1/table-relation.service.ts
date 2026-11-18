import { api } from "./api";

type TableRelation = {
  id: number;
  name: string;
  customerId: number;
  customerName: string;
  customerToken: string;
  carrierService: string;
  deadlineTableId: number;
  deadlineTable: string;
  priceTableId: number;
  priceTable: string;
  transferTableId: number;
  transferTable: string;
  magazordEnvios: boolean;
  intermediationTableId: number;
  intermediationTable: string;
  cubage: boolean;
  validatesDimensions: boolean;
  validatesWeight: boolean;
  freightCalculationType: string;
  limitsDimensions: boolean;
  volumeLimit: number;
  splitsVolumes: boolean;
  timeout: number;
  notifiesByEmail: boolean;
  notificationEmail: string;
  sendsPdf: boolean;
  notifiesByFtp: boolean;
  carrierApiType: string;
  trackingLink: string;
  apiToken: string;
  active: boolean;
};

type TableRelationFetchAllRequest = { filters?: Partial<TableRelation> };
type TableRelationFetchAllResponse = TableRelation[];
type TableRelationFindByIdRequest = Pick<TableRelation, "id">;
type TableRelationFindByIdResponse = TableRelation;
type TableRelationCreateRequest = Omit<TableRelation, "id">;
type TableRelationCreateResponse = TableRelation;
type TableRelationUpdateRequest = Pick<TableRelation, "id"> & Partial<TableRelation>;
type TableRelationUpdateResponse = TableRelation;
type TableRelationRemoveRequest = Pick<TableRelation, "id">;

const TableRelationService = {
  fetchAll: async ({ filters }: TableRelationFetchAllRequest = {}) => {
    const res = await api.get<TableRelationFetchAllResponse>("/table-relations", {
      params: filters,
    });
    return res.data;
  },
  findById: async ({ id }: TableRelationFindByIdRequest) => {
    const res = await api.get<TableRelationFindByIdResponse>(
      "/table-relations/:id".replace(":id", String(id)),
    );
    return res.data;
  },
  create: async (request: TableRelationCreateRequest) => {
    const res = await api.post<TableRelationCreateResponse>("/table-relations", request);
    return res.data;
  },
  update: async ({ id, ...changes }: TableRelationUpdateRequest) => {
    const res = await api.put<TableRelationUpdateResponse>(
      "/table-relations/:id".replace(":id", String(id)),
      changes,
    );
    return res.data;
  },
  remove: async ({ id }: TableRelationRemoveRequest) => {
    await api.delete("/table-relations/:id".replace(":id", String(id)));
  },
} as const;

export {
  type TableRelation,
  type TableRelationCreateRequest,
  type TableRelationCreateResponse,
  type TableRelationFetchAllRequest,
  type TableRelationFetchAllResponse,
  type TableRelationFindByIdRequest,
  type TableRelationFindByIdResponse,
  type TableRelationRemoveRequest,
  TableRelationService,
  type TableRelationUpdateRequest,
  type TableRelationUpdateResponse,
};
