import { api } from "./api";

type Profile = {
  id: number;
  platform: string;
  name: string;
  active: boolean;
};

type ProfileFetchAllRequest = { filters?: Partial<Profile> };
type ProfileFetchAllResponse = Profile[];
type ProfileFindByIdRequest = Pick<Profile, "id">;
type ProfileFindByIdResponse = Profile;
type ProfileCreateRequest = Omit<Profile, "id">;
type ProfileCreateResponse = Profile;
type ProfileUpdateRequest = Pick<Profile, "id"> & Partial<Profile>;
type ProfileUpdateResponse = Profile;
type ProfileRemoveRequest = Pick<Profile, "id">;

const ProfileService = {
  fetchAll: async ({ filters }: ProfileFetchAllRequest = {}) => {
    const res = await api.get<ProfileFetchAllResponse>("/profiles", {
      params: filters,
    });
    return res.data;
  },
  findById: async ({ id }: ProfileFindByIdRequest) => {
    const res = await api.get<ProfileFindByIdResponse>(
      "/profiles/:id".replace(":id", String(id)),
    );
    return res.data;
  },
  create: async (request: ProfileCreateRequest) => {
    const res = await api.post<ProfileCreateResponse>("/profiles", request);
    return res.data;
  },
  update: async ({ id, ...changes }: ProfileUpdateRequest) => {
    const res = await api.put<ProfileUpdateResponse>(
      "/profiles/:id".replace(":id", String(id)),
      changes,
    );
    return res.data;
  },
  remove: async ({ id }: ProfileRemoveRequest) => {
    await api.delete("/profiles/:id".replace(":id", String(id)));
  },
} as const;

export {
  type Profile,
  type ProfileCreateRequest,
  type ProfileCreateResponse,
  type ProfileFetchAllRequest,
  type ProfileFetchAllResponse,
  type ProfileFindByIdRequest,
  type ProfileFindByIdResponse,
  type ProfileRemoveRequest,
  ProfileService,
  type ProfileUpdateRequest,
  type ProfileUpdateResponse,
};
