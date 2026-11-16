import { toast } from "@hubble-ds/components/ui/toast";
import {
  ArrowsClockwiseIcon,
  ClockCounterClockwiseIcon,
  DownloadSimpleIcon,
  PaperPlaneTiltIcon,
  ScalesIcon,
  UploadSimpleIcon,
} from "@phosphor-icons/react";
import { useBillingDocumentCreateMutation } from "@/hooks/use-billing-document-create-mutation";
import { useBillingDocumentFetchAllQuery } from "@/hooks/use-billing-document-fetch-all-query";
import { useBillingDocumentRemoveMutation } from "@/hooks/use-billing-document-remove-mutation";
import { useCteFetchAllQuery } from "@/hooks/use-cte-fetch-all-query";
import { useReconciliationCreateMutation } from "@/hooks/use-reconciliation-create-mutation";
import { useReconciliationCteFetchAllQuery } from "@/hooks/use-reconciliation-cte-fetch-all-query";
import { useReconciliationFetchAllQuery } from "@/hooks/use-reconciliation-fetch-all-query";
import { useReconciliationFindByIdQuery } from "@/hooks/use-reconciliation-find-by-id-query";
import { useReconciliationRemoveMutation } from "@/hooks/use-reconciliation-remove-mutation";
import { EnumBillingDocumentStatusOptions } from "@/lib/enum/billing-document-status";
import { EnumBillingDocumentTypeOptions } from "@/lib/enum/billing-document-type";
import { formatInteger } from "@/lib/resource/format";
import { defineRecord } from "@/lib/resource/record";
import { defineResource } from "@/lib/resource/types";
import type { BillingDocument } from "@/services/portal/v1/billing-document.service";
import type { Cte } from "@/services/portal/v1/cte.service";
import type { Reconciliation } from "@/services/portal/v1/reconciliation.service";
import type { ReconciliationCte } from "@/services/portal/v1/reconciliation-cte.service";
import { useCustomerNameOptions } from "./registrations.resource";

const billingDocumentTypeOptions = EnumBillingDocumentTypeOptions.map((option) => option.value);
const billingDocumentStatusOptions = EnumBillingDocumentStatusOptions.map((option) => option.value);

const cteResource = defineResource<Cte>({
  key: "ctes",
  title: "CTEs",
  noun: "CTE",
  article: "o",
  describe: (cte) => `CTE ${cte.id}`,
  hooks: { useFetchAll: useCteFetchAllQuery },
  selectable: true,
  columns: [
    { key: "id", header: "Número", size: 110 },
    { key: "customerName", header: "Cliente", filterable: true },
    { key: "key", header: "Chave", size: 330 },
    { key: "issuedAt", header: "Emissão", size: 120 },
    { key: "carrierService", header: "Transp. serviço", filterable: true },
    { key: "freightValue", header: "Valor do frete", kind: "money", size: 140 },
    { key: "status", header: "Situação", size: 130, filterable: true },
  ],
  searchKeys: ["id", "key"],
  searchPlaceholder: "Pesquisar por número ou chave do CTE...",
  toolbar: ["refresh", "filter"],
  detail: {
    title: (cte) => `Visualizar CTE · ${cte.id}`,
    fields: [
      { name: "customerName", label: "Cliente", span: "half" },
      { name: "carrierService", label: "Transp. serviço", span: "half" },
      { name: "key", label: "Chave do CTE" },
      { name: "issuedAt", label: "Emissão", span: "third" },
      { name: "freightValue", label: "Valor do frete", kind: "money", span: "third" },
      { name: "status", label: "Situação", span: "third" },
    ],
  },
  rowActions: [
    {
      key: "send-billing",
      label: "Enviar cobrança",
      icon: PaperPlaneTiltIcon,
      run: (cte) => toast.success(`Cobrança do CTE ${cte.id} enviada.`),
    },
    {
      key: "reconcile",
      label: "Conciliar frete",
      icon: ScalesIcon,
      run: (cte) => toast.success(`CTE ${cte.id} enviado para conciliação.`),
    },
    {
      key: "download",
      label: "Baixar arquivo",
      icon: DownloadSimpleIcon,
      run: (cte) => toast.success(`Download do XML do CTE ${cte.id} iniciado.`),
    },
  ],
});

const reconciliationCteResource = defineResource<ReconciliationCte>({
  key: "reconciliation-ctes",
  title: "CTEs",
  noun: "CTE",
  article: "o",
  describe: (cte) => `CTE ${cte.id}`,
  hooks: { useFetchAll: useReconciliationCteFetchAllQuery },
  columns: [
    { key: "id", header: "CTE", size: 110 },
    { key: "issuedAt", header: "Emissão" },
    { key: "cteValue", header: "Valor do CTE", kind: "money" },
    { key: "calculatedFreight", header: "Frete calculado", kind: "money" },
    { key: "difference", header: "Diferença", kind: "money" },
    { key: "status", header: "Situação", size: 130, filterable: true },
  ],
  searchKeys: ["id"],
  searchPlaceholder: "Pesquisar CTE...",
  toolbar: ["export", "import", "filter"],
  detail: {
    title: (cte) => `Visualizar CTE · ${cte.id}`,
    fields: [
      { name: "issuedAt", label: "Emissão", span: "half" },
      { name: "status", label: "Situação", span: "half" },
      { name: "cteValue", label: "Valor do CTE", kind: "money", span: "third" },
      { name: "calculatedFreight", label: "Frete calculado", kind: "money", span: "third" },
      { name: "difference", label: "Diferença", kind: "money", span: "third" },
    ],
  },
});

const reconciliationResource = defineResource<Reconciliation>({
  key: "reconciliations",
  title: "Conciliações de frete",
  noun: "conciliação",
  article: "a",
  describe: (reconciliation) => `Conciliação #${reconciliation.id}`,
  hooks: {
    useFetchAll: useReconciliationFetchAllQuery,
    useCreate: useReconciliationCreateMutation,
    useRemove: useReconciliationRemoveMutation,
  },
  columns: [
    { key: "id", header: "ID", size: 96 },
    { key: "date", header: "Data", size: 130 },
    { key: "customerName", header: "Cliente", filterable: true },
    { key: "tolerance", header: "Tolerância", kind: "percent", size: 120 },
    { key: "cteCount", header: "CTEs", size: 100 },
    { key: "totalValue", header: "Valor total", kind: "money", size: 150 },
    { key: "reconciledPercent", header: "% conciliado", kind: "percent", size: 140 },
  ],
  searchKeys: ["id", "customerName"],
  searchPlaceholder: "Pesquisar conciliação...",
  toolbar: ["download-csv", "filter"],
  createLabel: "Nova conciliação",
  recordPath: (reconciliation) =>
    `/magazord-envios/conciliacoes-de-frete/${reconciliation.id}`,
  rowActions: [
    {
      key: "recalculation-history",
      label: "Histórico de recálculo",
      icon: ClockCounterClockwiseIcon,
      run: (reconciliation) =>
        toast.info(
          `Conciliação #${reconciliation.id}: nenhum recálculo registrado ainda.`,
        ),
    },
  ],
  form: {
    kind: "drawer",
    createTitle: "Nova conciliação",
    editTitle: (reconciliation) => `Editar conciliação #${reconciliation.id}`,
    defaults: {
      date: new Date().toLocaleDateString("pt-BR"),
      customerName: "",
      tolerance: 2,
      cteCount: 0,
      totalValue: 0,
      calculatedFreight: 0,
      reconciledPercent: 0,
      status: "Em análise",
    },
    fields: [
      { name: "customerName", label: "Cliente", kind: "select", required: true, useOptions: useCustomerNameOptions },
      { name: "date", label: "Data", span: "half", required: true, placeholder: "dd/mm/aaaa" },
      { name: "tolerance", label: "Tolerância", kind: "integer", suffix: "%", span: "half", required: true },
    ],
  },
});

const reconciliationRecord = defineRecord<Reconciliation>({
  definition: reconciliationResource,
  listPath: "/magazord-envios/conciliacoes-de-frete",
  useFindById: useReconciliationFindByIdQuery,
  title: (reconciliation) => `Conciliação #${reconciliation.id}`,
  status: (reconciliation) => reconciliation.status,
  editLabel: "Editar conciliação",
  primaryAction: {
    key: "recalculate",
    label: "Recalcular fatura",
    icon: ArrowsClockwiseIcon,
    run: (reconciliation) =>
      toast.success(
        `Recálculo da fatura da conciliação #${reconciliation.id} iniciado.`,
      ),
  },
  cards: [
    {
      key: "identification",
      title: "Identificação",
      description: "Dados da conciliação",
      span: "half",
      fields: [
        { name: "customerName", label: "Cliente" },
        { name: "date", label: "Data", span: "half" },
        { name: "tolerance", label: "Tolerância", suffix: "%", span: "half" },
        { name: "status", label: "Status" },
      ],
    },
    {
      key: "values",
      title: "Valores",
      description: "Comparativo entre CTEs e frete calculado",
      span: "half",
      fields: [
        { name: "totalValue", label: "Total dos CTEs", kind: "money", span: "half" },
        { name: "calculatedFreight", label: "Frete calculado", kind: "money", span: "half" },
        { name: "reconciledPercent", label: "% conciliado", suffix: "%", span: "half" },
        { name: "cteCount", label: "CTEs informados", span: "half" },
      ],
    },
  ],
  tabs: [
    {
      key: "ctes",
      label: "CTEs",
      definition: reconciliationCteResource,
      parentKey: "reconciliationId",
      summary: (count) => `${formatInteger(count)} CTEs nesta conciliação`,
      linkLabel: "Ver CTEs",
    },
  ],
});

const billingDocumentResource = defineResource<BillingDocument>({
  key: "billing-documents",
  title: "Documentos de cobrança",
  noun: "documento",
  article: "o",
  describe: (document) => `Documento ${document.id}`,
  hooks: {
    useFetchAll: useBillingDocumentFetchAllQuery,
    useCreate: useBillingDocumentCreateMutation,
    useRemove: useBillingDocumentRemoveMutation,
  },
  columns: [
    { key: "id", header: "ID", size: 96 },
    { key: "type", header: "Tipo", size: 110, filterable: true },
    { key: "identifier", header: "Identificador" },
    { key: "competence", header: "Competência", size: 130, filterable: true },
    { key: "value", header: "Valor", kind: "money", size: 140 },
    { key: "file", header: "Arquivo" },
    { key: "status", header: "Situação", size: 130, filterable: true },
    { key: "date", header: "Data", size: 130 },
  ],
  searchKeys: ["id", "identifier", "file"],
  searchPlaceholder: "Pesquisar documento...",
  toolbar: ["download-csv", "filter"],
  createLabel: "Importar",
  createIcon: UploadSimpleIcon,
  rowActions: [
    {
      key: "download",
      label: "Baixar arquivo",
      icon: DownloadSimpleIcon,
      run: (document) => toast.success(`Download de ${document.file} iniciado.`),
    },
  ],
  form: {
    kind: "drawer",
    createTitle: "Importar documento de cobrança",
    editTitle: (document) => `Documento ${document.id}`,
    defaults: {
      type: "NFS-e",
      identifier: "",
      competence: "",
      value: 0,
      file: "",
      status: "Pendente",
      date: new Date().toLocaleDateString("pt-BR"),
    },
    fields: [
      { name: "type", label: "Tipo", kind: "select", options: billingDocumentTypeOptions, span: "half", required: true },
      { name: "status", label: "Situação", kind: "select", options: billingDocumentStatusOptions, span: "half", required: true },
      { name: "identifier", label: "Identificador", required: true },
      { name: "competence", label: "Competência", span: "half", required: true, placeholder: "mm/aaaa" },
      { name: "value", label: "Valor", kind: "money", span: "half", required: true },
      { name: "file", label: "Chave NFS-e ou nome do arquivo", required: true },
    ],
  },
});

export {
  billingDocumentResource,
  cteResource,
  reconciliationRecord,
  reconciliationResource,
};
