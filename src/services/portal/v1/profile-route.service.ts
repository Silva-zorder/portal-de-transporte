import { api } from "./api";

type ProfileRoute = {
  id: number;
  profileId: number;
  method: string;
  route: string;
};

type ProfileRouteFetchAllRequest = { filters?: Partial<ProfileRoute> };
type ProfileRouteFetchAllResponse = ProfileRoute[];
type ProfileRouteFindByIdRequest = Pick<ProfileRoute, "id">;
type ProfileRouteFindByIdResponse = ProfileRoute;
type ProfileRouteCreateRequest = Omit<ProfileRoute, "id">;
type ProfileRouteCreateResponse = ProfileRoute;
type ProfileRouteUpdateRequest = Pick<ProfileRoute, "id"> & Partial<ProfileRoute>;
type ProfileRouteUpdateResponse = ProfileRoute;
type ProfileRouteRemoveRequest = Pick<ProfileRoute, "id">;

const ProfileRouteService = {
  fetchAll: async ({ filters }: ProfileRouteFetchAllRequest = {}) => {
    const res = await api.get<ProfileRouteFetchAllResponse>("/profile-routes", {
      params: filters,
    });
    return res.data;
  },
  findById: async ({ id }: ProfileRouteFindByIdRequest) => {
    const res = await api.get<ProfileRouteFindByIdResponse>(
      "/profile-routes/:id".replace(":id", String(id)),
    );
    return res.data;
  },
  create: async (request: ProfileRouteCreateRequest) => {
    const res = await api.post<ProfileRouteCreateResponse>("/profile-routes", request);
    return res.data;
  },
  update: async ({ id, ...changes }: ProfileRouteUpdateRequest) => {
    const res = await api.put<ProfileRouteUpdateResponse>(
      "/profile-routes/:id".replace(":id", String(id)),
      changes,
    );
    return res.data;
  },
  remove: async ({ id }: ProfileRouteRemoveRequest) => {
    await api.delete("/profile-routes/:id".replace(":id", String(id)));
  },
} as const;

export {
  type ProfileRoute,
  type ProfileRouteCreateRequest,
  type ProfileRouteCreateResponse,
  type ProfileRouteFetchAllRequest,
  type ProfileRouteFetchAllResponse,
  type ProfileRouteFindByIdRequest,
  type ProfileRouteFindByIdResponse,
  type ProfileRouteRemoveRequest,
  ProfileRouteService,
  type ProfileRouteUpdateRequest,
  type ProfileRouteUpdateResponse,
};
