import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@hubble-ds/components/ui/accordion";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@hubble-ds/components/ui/empty";
import { Skeleton } from "@hubble-ds/components/ui/skeleton";
import { useNotificationRequestFetchAllQuery } from "@/hooks/use-notification-request-fetch-all-query";
import type { ResourceField, ResourceRecord } from "@/lib/resource/types";
import type { Notification } from "@/services/portal/v1/notification.service";
import type { NotificationRequest } from "@/services/portal/v1/notification-request.service";
import { ResourceBadge } from "./resource-badge";
import { ResourceReadOnlyFields } from "./resource-fields";

const requestFields: ResourceField<ResourceRecord>[] = [
  { name: "note", label: "Nota" },
  { name: "date", label: "Data", span: "half" },
  { name: "integration", label: "Integração", span: "half" },
  { name: "message", label: "Message" },
  { name: "url", label: "URL" },
  { name: "method", label: "Method", span: "half" },
  { name: "httpCode", label: "Código HTTP", span: "half" },
  { name: "request", label: "Request", kind: "code" },
  { name: "response", label: "Response", kind: "code" },
];

const isSuccess = (request: NotificationRequest) =>
  request.httpCode >= 200 && request.httpCode < 300;

/**
 * "Detalhes do request" da notificação: uma notificação pode ser enviada indefinidas vezes, então
 * cada request é um accordion próprio, da mais recente para a mais antiga, todos fechados.
 */
function NotificationRequests({
  record,
  context,
}: Readonly<{ record: ResourceRecord; context: string }>) {
  const notification = record as unknown as Notification;
  const query = useNotificationRequestFetchAllQuery({
    filters: { notificationId: notification.id },
  });
  const requests = (query.data ?? []).toSorted((one, other) => other.id - one.id);

  if (query.isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-xs p-md" data-testid={`${context}-loading`}>
        <Skeleton className="h-12" />
        <Skeleton className="h-12" />
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <Empty className="flex-1" data-testid={`${context}-empty`}>
        <EmptyHeader>
          <EmptyTitle>Nenhum request</EmptyTitle>
          <EmptyDescription>Esta notificação ainda não foi enviada.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div
      className="flex flex-1 flex-col gap-xs overflow-auto p-md"
      data-testid={`${context}-requests`}
    >
      {requests.map((request, index) => {
        const itemContext = `${context}-request-${request.id}`;
        return (
          <Accordion
            key={request.id}
            type="single"
            collapsible
            data-testid={`${itemContext}-accordion`}
          >
          <AccordionItem value={String(request.id)} data-testid={`${itemContext}-item`}>
            <AccordionTrigger data-testid={`${itemContext}-trigger`}>
              <span className="flex flex-1 items-center gap-xs">
                <span>{index === 0 ? "Request mais recente" : `Request ${requests.length - index}`}</span>
                <span className="typo-caption-1 text-muted-text">{request.date}</span>
                <ResourceBadge
                  variant={isSuccess(request) ? "success" : "destructive"}
                  data-testid={`${itemContext}-http-code-badge`}
                >
                  {request.httpCode}
                </ResourceBadge>
              </span>
            </AccordionTrigger>
            <AccordionContent className="rounded-b-md bg-accent-0">
              <ResourceReadOnlyFields
                fields={requestFields}
                record={request as unknown as ResourceRecord}
                context={itemContext}
              />
            </AccordionContent>
          </AccordionItem>
          </Accordion>
        );
      })}
    </div>
  );
}

export { NotificationRequests };
