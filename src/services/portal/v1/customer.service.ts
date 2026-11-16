import { api } from "./api";

type Customer = {
  id: number;
  platform: string;
  name: string;
  identifier: string;
  cnpj: string;
  token: string;
  analyst: string;
  melhorEnvioId: string;
  active: boolean;
};

type CustomerFetchAllRequest = { filters?: Partial<Customer> };
type CustomerFetchAllResponse = Customer[];
type CustomerFindByIdRequest = Pick<Customer, "id">;
type CustomerFindByIdResponse = Customer;
type CustomerCreateRequest = Omit<Customer, "id">;
type CustomerCreateResponse = Customer;
type CustomerUpdateRequest = Pick<Customer, "id"> & Partial<Customer>;
type CustomerUpdateResponse = Customer;
type CustomerRemoveRequest = Pick<Customer, "id">;

const CustomerService = {
  fetchAll: async ({ filters }: CustomerFetchAllRequest = {}) => {
    const res = await api.get<CustomerFetchAllResponse>("/customers", {
      params: filters,
    });
    return res.data;
  },
  findById: async ({ id }: CustomerFindByIdRequest) => {
    const res = await api.get<CustomerFindByIdResponse>(
      "/customers/:id".replace(":id", String(id)),
    );
    return res.data;
  },
  create: async (request: CustomerCreateRequest) => {
    const res = await api.post<CustomerCreateResponse>("/customers", request);
    return res.data;
  },
  update: async ({ id, ...changes }: CustomerUpdateRequest) => {
    const res = await api.put<CustomerUpdateResponse>(
      "/customers/:id".replace(":id", String(id)),
      changes,
    );
    return res.data;
  },
  remove: async ({ id }: CustomerRemoveRequest) => {
    await api.delete("/customers/:id".replace(":id", String(id)));
  },
} as const;

export {
  type Customer,
  type CustomerCreateRequest,
  type CustomerCreateResponse,
  type CustomerFetchAllRequest,
  type CustomerFetchAllResponse,
  type CustomerFindByIdRequest,
  type CustomerFindByIdResponse,
  type CustomerRemoveRequest,
  CustomerService,
  type CustomerUpdateRequest,
  type CustomerUpdateResponse,
};
