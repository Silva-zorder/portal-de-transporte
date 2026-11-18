import { toast } from "@hubble-ds/components/ui/toast";
import { ArrowsClockwiseIcon, EyeIcon, PaperPlaneTiltIcon } from "@phosphor-icons/react";
import { NotificationRequests } from "@/components/notification-requests";
import { useLogFetchAllQuery } from "@/hooks/use-log-fetch-all-query";
import { useMongoSyncCreateMutation } from "@/hooks/use-mongo-sync-create-mutation";
import { useMongoSyncFetchAllQuery } from "@/hooks/use-mongo-sync-fetch-all-query";
import { useNotificationFetchAllQuery } from "@/hooks/use-notification-fetch-all-query";
import { EnumMongoSyncTableOptions } from "@/lib/enum/mongo-sync-table";
import { defineResource } from "@/lib/resource/types";
import type { Log } from "@/services/portal/v1/log.service";
import type { MongoSync } from "@/services/portal/v1/mongo-sync.service";
import type { Notification } from "@/services/portal/v1/notification.service";

const mongoSyncTableOptions = EnumMongoSyncTableOptions.map((option) => option.value);

const notificationResource = defineResource<Notification>({
  key: "notifications",
  title: "Notificações",
  noun: "notificação",
  article: "a",
  describe: (notification) => `Notificação ${notification.number}`,
  hooks: { useFetchAll: useNotificationFetchAllQuery },
  columns: [
    { key: "identifier", header: "Identificador", size: 130 },
    { key: "trackingCode", header: "Código de rastreio", size: 170 },
    { key: "number", header: "Número", size: 100 },
    { key: "key", header: "Chave" },
    { key: "issuedAt", header: "Data de emissão", size: 170 },
    { key: "carrierService", header: "Transp. serviço" },
    { key: "platform", header: "Plataforma", size: 100 },
    {
      key: "status",
      header: "Situação",
      kind: "badge",
      size: 100,
      sortable: false,
      badgeVariants: { Enviado: "success", Falha: "destructive" },
    },
  ],
  searchKeys: ["identifier", "number", "key", "carrierService"],
  searchPlaceholder: "Pesquisar notificação...",
  filters: [
    { key: "identifier", label: "Identificador", kind: "search" },
    { key: "number", label: "Número", kind: "search" },
    { key: "key", label: "Chave", kind: "search" },
    { key: "carrierService", label: "Transportadora serviço", kind: "search" },
    { key: "trackingCode", label: "Código de rastreio", kind: "input" },
    { key: "issuedAt", label: "Data de emissão", kind: "date" },
    { key: "status", label: "Situação", kind: "select" },
    { key: "platform", label: "Plataforma", kind: "select" },
  ],
  toolbar: [],
  selectable: true,
  pageActions: [
    {
      key: "resend",
      label: "Reenviar",
      icon: PaperPlaneTiltIcon,
      primary: true,
      requiresSelection: true,
      run: (notifications) =>
        toast.success(
          notifications.length === 1
            ? `Notificação ${notifications[0].number} reenviada.`
            : `${notifications.length} notificações reenviadas.`,
        ),
    },
  ],
  views: [
    {
      key: "detail",
      label: "Visualizar",
      icon: EyeIcon,
      kind: "drawer",
      exposed: true,
      title: () => "Detalhes do request",
      fields: [],
      content: NotificationRequests,
      footerActions: ["resend"],
    },
  ],
  rowActions: [
    {
      key: "resend",
      label: "Reenviar",
      icon: PaperPlaneTiltIcon,
      exposed: true,
      run: (notification) =>
        toast.success(`Notificação ${notification.number} reenviada.`),
    },
  ],
});

const mongoSyncResource = defineResource<MongoSync>({
  key: "mongo-syncs",
  title: "Sincronização Mongo DB",
  noun: "sincronização",
  article: "a",
  describe: (sync) => `Sincronização de ${sync.requestedAt}`,
  hooks: {
    useFetchAll: useMongoSyncFetchAllQuery,
    useCreate: useMongoSyncCreateMutation,
  },
  columns: [
    {
      key: "status",
      header: "Status",
      kind: "badge",
      size: 130,
      sortable: false,
      filterable: true,
      badgeVariants: {
        Concluída: "success",
        "Em andamento": "warning",
        Erro: "destructive",
      },
    },
    { key: "requestedAt", header: "Data de solicitação" },
    { key: "duration", header: "Tempo gasto", size: 140 },
    { key: "tables", header: "Tabelas", filterable: true },
    { key: "filters", header: "Filtros", size: 140 },
  ],
  searchKeys: ["tables", "filters", "requestedAt"],
  searchPlaceholder: "Pesquisar sincronização...",
  toolbar: [],
  createLabel: "Nova sincronização",
  createIcon: ArrowsClockwiseIcon,
  form: {
    kind: "drawer",
    createTitle: "Nova sincronização",
    editTitle: (sync) => `Sincronização · ${sync.requestedAt}`,
    defaults: {
      status: "Em andamento",
      requestedAt: new Date().toLocaleDateString("pt-BR"),
      duration: "00:00:00",
      tables: "",
      filters: "",
    },
    fields: [
      { name: "tables", label: "Tabelas", kind: "select", options: mongoSyncTableOptions, required: true },
      { name: "filters", label: "Filtros", placeholder: "Ex.: JET" },
    ],
  },
});

const logResource = defineResource<Log>({
  key: "logs",
  title: "Histórico de registros",
  noun: "registro",
  article: "o",
  describe: (log) => `Registro ${log.id}`,
  hooks: { useFetchAll: useLogFetchAllQuery },
  columns: [
    {
      key: "action",
      header: "Ação realizada",
      kind: "badge",
      size: 150,
      filterable: true,
      badgeVariants: {
        Nova: "success",
        Alteração: "warning",
        Exclusão: "destructive",
      },
    },
    { key: "table", header: "Tabela" },
    { key: "user", header: "Usuário" },
    { key: "dbUser", header: "Usuário banco" },
    { key: "date", header: "Data" },
  ],
  searchKeys: ["table", "user", "action"],
  searchPlaceholder: "Pesquisar no histórico...",
  filters: [
    { key: "table", label: "Tabela", kind: "search" },
    { key: "user", label: "Usuário", kind: "search" },
    { key: "date", label: "Data", kind: "date" },
    { key: "action", label: "Ação realizada", kind: "select" },
    { key: "table", label: "Tabela", kind: "select" },
    { key: "user", label: "Usuário", kind: "select" },
  ],
  toolbar: [],
  detail: {
    title: (log) => `Detalhamento do registro · ${log.table}`,
    fields: [
      { name: "action", label: "Ação realizada", span: "half" },
      { name: "date", label: "Data", span: "half" },
      { name: "user", label: "Usuário", span: "half" },
      { name: "dbUser", label: "Usuário banco", span: "half" },
      { name: "data", label: "Dados", kind: "code" },
      { name: "changes", label: "Alterações", kind: "code" },
    ],
  },
});

export { logResource, mongoSyncResource, notificationResource };
