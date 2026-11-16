import { api } from "./api";

type TableRelation = {
  id: number;
  name: string;
  carrierService: string;
  customerName: string;
  deadlineTable: string;
  priceTable: string;
  transferTable: string;
  calculatesFreight: boolean;
  notifiesByEmail: boolean;
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
