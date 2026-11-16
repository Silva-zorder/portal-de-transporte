import { api } from "./api";

type User = {
  id: number;
  platform: string;
  name: string;
  email: string;
  type: string;
  active: boolean;
};

type UserFetchAllRequest = { filters?: Partial<User> };
type UserFetchAllResponse = User[];
type UserFindByIdRequest = Pick<User, "id">;
type UserFindByIdResponse = User;
type UserCreateRequest = Omit<User, "id">;
type UserCreateResponse = User;
type UserUpdateRequest = Pick<User, "id"> & Partial<User>;
type UserUpdateResponse = User;
type UserRemoveRequest = Pick<User, "id">;

const UserService = {
  fetchAll: async ({ filters }: UserFetchAllRequest = {}) => {
    const res = await api.get<UserFetchAllResponse>("/users", {
      params: filters,
    });
    return res.data;
  },
  findById: async ({ id }: UserFindByIdRequest) => {
    const res = await api.get<UserFindByIdResponse>(
      "/users/:id".replace(":id", String(id)),
    );
    return res.data;
  },
  create: async (request: UserCreateRequest) => {
    const res = await api.post<UserCreateResponse>("/users", request);
    return res.data;
  },
  update: async ({ id, ...changes }: UserUpdateRequest) => {
    const res = await api.put<UserUpdateResponse>(
      "/users/:id".replace(":id", String(id)),
      changes,
    );
    return res.data;
  },
  remove: async ({ id }: UserRemoveRequest) => {
    await api.delete("/users/:id".replace(":id", String(id)));
  },
} as const;

export {
  type User,
  type UserCreateRequest,
  type UserCreateResponse,
  type UserFetchAllRequest,
  type UserFetchAllResponse,
  type UserFindByIdRequest,
  type UserFindByIdResponse,
  type UserRemoveRequest,
  UserService,
  type UserUpdateRequest,
  type UserUpdateResponse,
};
