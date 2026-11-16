import { api } from "./api";

type CustomerGroup = {
  id: number;
  platform: string;
  description: string;
  active: boolean;
};

type CustomerGroupFetchAllRequest = { filters?: Partial<CustomerGroup> };
type CustomerGroupFetchAllResponse = CustomerGroup[];
type CustomerGroupFindByIdRequest = Pick<CustomerGroup, "id">;
type CustomerGroupFindByIdResponse = CustomerGroup;
type CustomerGroupCreateRequest = Omit<CustomerGroup, "id">;
type CustomerGroupCreateResponse = CustomerGroup;
type CustomerGroupUpdateRequest = Pick<CustomerGroup, "id"> & Partial<CustomerGroup>;
type CustomerGroupUpdateResponse = CustomerGroup;
type CustomerGroupRemoveRequest = Pick<CustomerGroup, "id">;

const CustomerGroupService = {
  fetchAll: async ({ filters }: CustomerGroupFetchAllRequest = {}) => {
    const res = await api.get<CustomerGroupFetchAllResponse>("/customer-groups", {
      params: filters,
    });
    return res.data;
  },
  findById: async ({ id }: CustomerGroupFindByIdRequest) => {
    const res = await api.get<CustomerGroupFindByIdResponse>(
      "/customer-groups/:id".replace(":id", String(id)),
    );
    return res.data;
  },
  create: async (request: CustomerGroupCreateRequest) => {
    const res = await api.post<CustomerGroupCreateResponse>("/customer-groups", request);
    return res.data;
  },
  update: async ({ id, ...changes }: CustomerGroupUpdateRequest) => {
    const res = await api.put<CustomerGroupUpdateResponse>(
      "/customer-groups/:id".replace(":id", String(id)),
      changes,
    );
    return res.data;
  },
  remove: async ({ id }: CustomerGroupRemoveRequest) => {
    await api.delete("/customer-groups/:id".replace(":id", String(id)));
  },
} as const;

export {
  type CustomerGroup,
  type CustomerGroupCreateRequest,
  type CustomerGroupCreateResponse,
  type CustomerGroupFetchAllRequest,
  type CustomerGroupFetchAllResponse,
  type CustomerGroupFindByIdRequest,
  type CustomerGroupFindByIdResponse,
  type CustomerGroupRemoveRequest,
  CustomerGroupService,
  type CustomerGroupUpdateRequest,
  type CustomerGroupUpdateResponse,
};
