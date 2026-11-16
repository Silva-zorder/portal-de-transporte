import { api } from "./api";

type CustomerMarketplace = {
  id: number;
  identifier: string;
  customerId: number;
  customerName: string;
  marketplace: string;
  description: string;
  userId: string;
  active: boolean;
};

type CustomerMarketplaceFetchAllRequest = { filters?: Partial<CustomerMarketplace> };
type CustomerMarketplaceFetchAllResponse = CustomerMarketplace[];
type CustomerMarketplaceFindByIdRequest = Pick<CustomerMarketplace, "id">;
type CustomerMarketplaceFindByIdResponse = CustomerMarketplace;
type CustomerMarketplaceCreateRequest = Omit<CustomerMarketplace, "id">;
type CustomerMarketplaceCreateResponse = CustomerMarketplace;
type CustomerMarketplaceUpdateRequest = Pick<CustomerMarketplace, "id"> & Partial<CustomerMarketplace>;
type CustomerMarketplaceUpdateResponse = CustomerMarketplace;
type CustomerMarketplaceRemoveRequest = Pick<CustomerMarketplace, "id">;

const CustomerMarketplaceService = {
  fetchAll: async ({ filters }: CustomerMarketplaceFetchAllRequest = {}) => {
    const res = await api.get<CustomerMarketplaceFetchAllResponse>("/customer-marketplaces", {
      params: filters,
    });
    return res.data;
  },
  findById: async ({ id }: CustomerMarketplaceFindByIdRequest) => {
    const res = await api.get<CustomerMarketplaceFindByIdResponse>(
      "/customer-marketplaces/:id".replace(":id", String(id)),
    );
    return res.data;
  },
  create: async (request: CustomerMarketplaceCreateRequest) => {
    const res = await api.post<CustomerMarketplaceCreateResponse>("/customer-marketplaces", request);
    return res.data;
  },
  update: async ({ id, ...changes }: CustomerMarketplaceUpdateRequest) => {
    const res = await api.put<CustomerMarketplaceUpdateResponse>(
      "/customer-marketplaces/:id".replace(":id", String(id)),
      changes,
    );
    return res.data;
  },
  remove: async ({ id }: CustomerMarketplaceRemoveRequest) => {
    await api.delete("/customer-marketplaces/:id".replace(":id", String(id)));
  },
} as const;

export {
  type CustomerMarketplace,
  type CustomerMarketplaceCreateRequest,
  type CustomerMarketplaceCreateResponse,
  type CustomerMarketplaceFetchAllRequest,
  type CustomerMarketplaceFetchAllResponse,
  type CustomerMarketplaceFindByIdRequest,
  type CustomerMarketplaceFindByIdResponse,
  type CustomerMarketplaceRemoveRequest,
  CustomerMarketplaceService,
  type CustomerMarketplaceUpdateRequest,
  type CustomerMarketplaceUpdateResponse,
};
