import { api } from "./api";

type UserGroup = {
  id: number;
  userId: number;
  description: string;
  platform: string;
};

type UserGroupFetchAllRequest = { filters?: Partial<UserGroup> };
type UserGroupFetchAllResponse = UserGroup[];
type UserGroupFindByIdRequest = Pick<UserGroup, "id">;
type UserGroupFindByIdResponse = UserGroup;
type UserGroupCreateRequest = Omit<UserGroup, "id">;
type UserGroupCreateResponse = UserGroup;
type UserGroupUpdateRequest = Pick<UserGroup, "id"> & Partial<UserGroup>;
type UserGroupUpdateResponse = UserGroup;
type UserGroupRemoveRequest = Pick<UserGroup, "id">;

const UserGroupService = {
  fetchAll: async ({ filters }: UserGroupFetchAllRequest = {}) => {
    const res = await api.get<UserGroupFetchAllResponse>("/user-groups", {
      params: filters,
    });
    return res.data;
  },
  findById: async ({ id }: UserGroupFindByIdRequest) => {
    const res = await api.get<UserGroupFindByIdResponse>(
      "/user-groups/:id".replace(":id", String(id)),
    );
    return res.data;
  },
  create: async (request: UserGroupCreateRequest) => {
    const res = await api.post<UserGroupCreateResponse>("/user-groups", request);
    return res.data;
  },
  update: async ({ id, ...changes }: UserGroupUpdateRequest) => {
    const res = await api.put<UserGroupUpdateResponse>(
      "/user-groups/:id".replace(":id", String(id)),
      changes,
    );
    return res.data;
  },
  remove: async ({ id }: UserGroupRemoveRequest) => {
    await api.delete("/user-groups/:id".replace(":id", String(id)));
  },
} as const;

export {
  type UserGroup,
  type UserGroupCreateRequest,
  type UserGroupCreateResponse,
  type UserGroupFetchAllRequest,
  type UserGroupFetchAllResponse,
  type UserGroupFindByIdRequest,
  type UserGroupFindByIdResponse,
  type UserGroupRemoveRequest,
  UserGroupService,
  type UserGroupUpdateRequest,
  type UserGroupUpdateResponse,
};
