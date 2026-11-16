import { toast } from "@hubble-ds/components/ui/toast";
import { ArrowsClockwiseIcon, PaperPlaneTiltIcon } from "@phosphor-icons/react";
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
  selectable: true,
  columns: [
    { key: "identifier", header: "Identificador", size: 150, filterable: true },
    { key: "trackingCode", header: "Código de rastreio", size: 180 },
    { key: "number", header: "Número", size: 110 },
    { key: "key", header: "Chave" },
    { key: "issuedAt", header: "Data de emissão", size: 200 },
    { key: "carrierService", header: "Transp. serviço", filterable: true },
    {
      key: "status",
      header: "Situação",
      kind: "badge",
      size: 120,
      sortable: false,
      filterable: true,
      badgeVariants: { Enviado: "secondary", Falha: "destructive" },
    },
  ],
  searchKeys: ["identifier", "trackingCode", "number", "key"],
  searchPlaceholder: "Pesquisar notificação...",
  toolbar: ["refresh", "filter"],
  detail: {
    title: (notification) => `Notificação · ${notification.number}`,
    fields: [
      { name: "identifier", label: "Identificador", span: "half" },
      { name: "status", label: "Situação", span: "half" },
      { name: "trackingCode", label: "Código de rastreio", span: "half" },
      { name: "number", label: "Número", span: "half" },
      { name: "key", label: "Chave" },
      { name: "issuedAt", label: "Data de emissão", span: "half" },
      { name: "carrierService", label: "Transp. serviço", span: "half" },
    ],
  },
  rowActions: [
    {
      key: "resend",
      label: "Reenviar",
      icon: PaperPlaneTiltIcon,
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
        Concluída: "secondary",
        "Em andamento": "primary",
        Falhou: "destructive",
      },
    },
    { key: "requestedAt", header: "Data de solicitação" },
    { key: "duration", header: "Tempo gasto", size: 140 },
    { key: "tables", header: "Tabelas", filterable: true },
    { key: "filters", header: "Filtros", size: 140 },
  ],
  searchKeys: ["tables", "filters", "requestedAt"],
  searchPlaceholder: "Pesquisar sincronização...",
  toolbar: ["refresh", "filter"],
  createLabel: "Nova sincronização",
  createIcon: ArrowsClockwiseIcon,
  detail: {
    title: (sync) => `Sincronização · ${sync.requestedAt}`,
    fields: [
      { name: "status", label: "Status", span: "half" },
      { name: "duration", label: "Tempo gasto", span: "half" },
      { name: "tables", label: "Tabelas", span: "half" },
      { name: "filters", label: "Filtros", span: "half" },
    ],
  },
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
  title: "Log",
  noun: "log",
  article: "o",
  describe: (log) => `Log ${log.id}`,
  hooks: { useFetchAll: useLogFetchAllQuery },
  columns: [
    {
      key: "action",
      header: "Ação realizada",
      kind: "badge",
      size: 150,
      filterable: true,
      badgeVariants: {
        Alteração: "secondary",
        Exclusão: "destructive",
        Nova: "primary",
      },
    },
    { key: "table", header: "Tabela", filterable: true },
    { key: "user", header: "Usuário", filterable: true },
    { key: "dbUser", header: "Usuário banco" },
    { key: "date", header: "Data" },
  ],
  searchKeys: ["table", "user", "action"],
  searchPlaceholder: "Pesquisar no log...",
  toolbar: ["filter"],
  detail: {
    title: (log) => `Detalhamento de log · ${log.table}`,
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
