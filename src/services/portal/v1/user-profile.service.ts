import { api } from "./api";

type UserProfile = {
  id: number;
  userId: number;
  description: string;
  platform: string;
};

type UserProfileFetchAllRequest = { filters?: Partial<UserProfile> };
type UserProfileFetchAllResponse = UserProfile[];
type UserProfileFindByIdRequest = Pick<UserProfile, "id">;
type UserProfileFindByIdResponse = UserProfile;
type UserProfileCreateRequest = Omit<UserProfile, "id">;
type UserProfileCreateResponse = UserProfile;
type UserProfileUpdateRequest = Pick<UserProfile, "id"> & Partial<UserProfile>;
type UserProfileUpdateResponse = UserProfile;
type UserProfileRemoveRequest = Pick<UserProfile, "id">;

const UserProfileService = {
  fetchAll: async ({ filters }: UserProfileFetchAllRequest = {}) => {
    const res = await api.get<UserProfileFetchAllResponse>("/user-profiles", {
      params: filters,
    });
    return res.data;
  },
  findById: async ({ id }: UserProfileFindByIdRequest) => {
    const res = await api.get<UserProfileFindByIdResponse>(
      "/user-profiles/:id".replace(":id", String(id)),
    );
    return res.data;
  },
  create: async (request: UserProfileCreateRequest) => {
    const res = await api.post<UserProfileCreateResponse>("/user-profiles", request);
    return res.data;
  },
  update: async ({ id, ...changes }: UserProfileUpdateRequest) => {
    const res = await api.put<UserProfileUpdateResponse>(
      "/user-profiles/:id".replace(":id", String(id)),
      changes,
    );
    return res.data;
  },
  remove: async ({ id }: UserProfileRemoveRequest) => {
    await api.delete("/user-profiles/:id".replace(":id", String(id)));
  },
} as const;

export {
  type UserProfile,
  type UserProfileCreateRequest,
  type UserProfileCreateResponse,
  type UserProfileFetchAllRequest,
  type UserProfileFetchAllResponse,
  type UserProfileFindByIdRequest,
  type UserProfileFindByIdResponse,
  type UserProfileRemoveRequest,
  UserProfileService,
  type UserProfileUpdateRequest,
  type UserProfileUpdateResponse,
};
