import { api } from "./api";

type CustomerGroupMember = {
  id: number;
  customerGroupId: number;
  name: string;
  identifier: string;
};

type CustomerGroupMemberFetchAllRequest = { filters?: Partial<CustomerGroupMember> };
type CustomerGroupMemberFetchAllResponse = CustomerGroupMember[];
type CustomerGroupMemberFindByIdRequest = Pick<CustomerGroupMember, "id">;
type CustomerGroupMemberFindByIdResponse = CustomerGroupMember;
type CustomerGroupMemberCreateRequest = Omit<CustomerGroupMember, "id">;
type CustomerGroupMemberCreateResponse = CustomerGroupMember;
type CustomerGroupMemberUpdateRequest = Pick<CustomerGroupMember, "id"> & Partial<CustomerGroupMember>;
type CustomerGroupMemberUpdateResponse = CustomerGroupMember;
type CustomerGroupMemberRemoveRequest = Pick<CustomerGroupMember, "id">;

const CustomerGroupMemberService = {
  fetchAll: async ({ filters }: CustomerGroupMemberFetchAllRequest = {}) => {
    const res = await api.get<CustomerGroupMemberFetchAllResponse>("/customer-group-members", {
      params: filters,
    });
    return res.data;
  },
  findById: async ({ id }: CustomerGroupMemberFindByIdRequest) => {
    const res = await api.get<CustomerGroupMemberFindByIdResponse>(
      "/customer-group-members/:id".replace(":id", String(id)),
    );
    return res.data;
  },
  create: async (request: CustomerGroupMemberCreateRequest) => {
    const res = await api.post<CustomerGroupMemberCreateResponse>("/customer-group-members", request);
    return res.data;
  },
  update: async ({ id, ...changes }: CustomerGroupMemberUpdateRequest) => {
    const res = await api.put<CustomerGroupMemberUpdateResponse>(
      "/customer-group-members/:id".replace(":id", String(id)),
      changes,
    );
    return res.data;
  },
  remove: async ({ id }: CustomerGroupMemberRemoveRequest) => {
    await api.delete("/customer-group-members/:id".replace(":id", String(id)));
  },
} as const;

export {
  type CustomerGroupMember,
  type CustomerGroupMemberCreateRequest,
  type CustomerGroupMemberCreateResponse,
  type CustomerGroupMemberFetchAllRequest,
  type CustomerGroupMemberFetchAllResponse,
  type CustomerGroupMemberFindByIdRequest,
  type CustomerGroupMemberFindByIdResponse,
  type CustomerGroupMemberRemoveRequest,
  CustomerGroupMemberService,
  type CustomerGroupMemberUpdateRequest,
  type CustomerGroupMemberUpdateResponse,
};
