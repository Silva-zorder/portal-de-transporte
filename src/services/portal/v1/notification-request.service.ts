import { api } from "./api";

type NotificationRequest = {
  id: number;
  notificationId: number;
  note: string;
  date: string;
  integration: string;
  message: string;
  url: string;
  method: string;
  httpCode: number;
  request: string;
  response: string;
};

type NotificationRequestFetchAllRequest = { filters?: Partial<NotificationRequest> };
type NotificationRequestFetchAllResponse = NotificationRequest[];
type NotificationRequestFindByIdRequest = Pick<NotificationRequest, "id">;
type NotificationRequestFindByIdResponse = NotificationRequest;
type NotificationRequestCreateRequest = Omit<NotificationRequest, "id">;
type NotificationRequestCreateResponse = NotificationRequest;
type NotificationRequestUpdateRequest = Pick<NotificationRequest, "id"> & Partial<NotificationRequest>;
type NotificationRequestUpdateResponse = NotificationRequest;
type NotificationRequestRemoveRequest = Pick<NotificationRequest, "id">;

const NotificationRequestService = {
  fetchAll: async ({ filters }: NotificationRequestFetchAllRequest = {}) => {
    const res = await api.get<NotificationRequestFetchAllResponse>("/notification-requests", {
      params: filters,
    });
    return res.data;
  },
  findById: async ({ id }: NotificationRequestFindByIdRequest) => {
    const res = await api.get<NotificationRequestFindByIdResponse>(
      "/notification-requests/:id".replace(":id", String(id)),
    );
    return res.data;
  },
  create: async (request: NotificationRequestCreateRequest) => {
    const res = await api.post<NotificationRequestCreateResponse>("/notification-requests", request);
    return res.data;
  },
  update: async ({ id, ...changes }: NotificationRequestUpdateRequest) => {
    const res = await api.put<NotificationRequestUpdateResponse>(
      "/notification-requests/:id".replace(":id", String(id)),
      changes,
    );
    return res.data;
  },
  remove: async ({ id }: NotificationRequestRemoveRequest) => {
    await api.delete("/notification-requests/:id".replace(":id", String(id)));
  },
} as const;

export {
  type NotificationRequest,
  type NotificationRequestCreateRequest,
  type NotificationRequestCreateResponse,
  type NotificationRequestFetchAllRequest,
  type NotificationRequestFetchAllResponse,
  type NotificationRequestFindByIdRequest,
  type NotificationRequestFindByIdResponse,
  type NotificationRequestRemoveRequest,
  NotificationRequestService,
  type NotificationRequestUpdateRequest,
  type NotificationRequestUpdateResponse,
};
