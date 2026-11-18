import { api } from "./api";

type Notification = {
  id: number;
  identifier: string;
  trackingCode: string;
  number: string;
  key: string;
  issuedAt: string;
  carrierService: string;
  platform: string;
  status: string;
};

type NotificationFetchAllRequest = { filters?: Partial<Notification> };
type NotificationFetchAllResponse = Notification[];
type NotificationFindByIdRequest = Pick<Notification, "id">;
type NotificationFindByIdResponse = Notification;
type NotificationCreateRequest = Omit<Notification, "id">;
type NotificationCreateResponse = Notification;
type NotificationUpdateRequest = Pick<Notification, "id"> & Partial<Notification>;
type NotificationUpdateResponse = Notification;
type NotificationRemoveRequest = Pick<Notification, "id">;

const NotificationService = {
  fetchAll: async ({ filters }: NotificationFetchAllRequest = {}) => {
    const res = await api.get<NotificationFetchAllResponse>("/notifications", {
      params: filters,
    });
    return res.data;
  },
  findById: async ({ id }: NotificationFindByIdRequest) => {
    const res = await api.get<NotificationFindByIdResponse>(
      "/notifications/:id".replace(":id", String(id)),
    );
    return res.data;
  },
  create: async (request: NotificationCreateRequest) => {
    const res = await api.post<NotificationCreateResponse>("/notifications", request);
    return res.data;
  },
  update: async ({ id, ...changes }: NotificationUpdateRequest) => {
    const res = await api.put<NotificationUpdateResponse>(
      "/notifications/:id".replace(":id", String(id)),
      changes,
    );
    return res.data;
  },
  remove: async ({ id }: NotificationRemoveRequest) => {
    await api.delete("/notifications/:id".replace(":id", String(id)));
  },
} as const;

export {
  type Notification,
  type NotificationCreateRequest,
  type NotificationCreateResponse,
  type NotificationFetchAllRequest,
  type NotificationFetchAllResponse,
  type NotificationFindByIdRequest,
  type NotificationFindByIdResponse,
  type NotificationRemoveRequest,
  NotificationService,
  type NotificationUpdateRequest,
  type NotificationUpdateResponse,
};
