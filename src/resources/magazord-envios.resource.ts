import { toast } from "@hubble-ds/components/ui/toast";
import {
  ArrowsClockwiseIcon,
  ClockCounterClockwiseIcon,
  DownloadSimpleIcon,
  UploadSimpleIcon,
} from "@phosphor-icons/react";
import { useBillingDocumentCreateMutation } from "@/hooks/use-billing-document-create-mutation";
import { useBillingDocumentFetchAllQuery } from "@/hooks/use-billing-document-fetch-all-query";
import { useBillingDocumentRemoveMutation } from "@/hooks/use-billing-document-remove-mutation";
import { useCteFetchAllQuery } from "@/hooks/use-cte-fetch-all-query";
import { useReconciliationCreateMutation } from "@/hooks/use-reconciliation-create-mutation";
import { useReconciliationCteFetchAllQuery } from "@/hooks/use-reconciliation-cte-fetch-all-query";
import { useReconciliationCteUpdateMutation } from "@/hooks/use-reconciliation-cte-update-mutation";
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

const reconciledLabels = { true: "Sim", false: "Não" };

const cteResource = defineResource<Cte>({
  key: "ctes",
  title: "CTEs",
  noun: "CTE",
  article: "o",
  describe: (cte) => `CTE ${cte.number}`,
  hooks: { useFetchAll: useCteFetchAllQuery },
  columns: [
    { key: "number", header: "Número", size: 110 },
    { key: "customerName", header: "Cliente" },
    { key: "key", header: "Chave", size: 330 },
    { key: "issuedAt", header: "Emissão", size: 120 },
    { key: "dueDate", header: "Vencimento", size: 120 },
    { key: "carrierService", header: "Transp. serviço" },
    { key: "freightValue", header: "Valor do frete", kind: "money", size: 140 },
    { key: "reconciled", header: "Conciliado", size: 120, valueLabels: reconciledLabels },
  ],
  searchKeys: ["number", "key"],
  searchPlaceholder: "Pesquisar CTE...",
  filters: [
    { key: "customerIdentifier", label: "Identificador cliente", kind: "search" },
    { key: "number", label: "Número", kind: "search" },
    { key: "key", label: "Chave CTE", kind: "search" },
    { key: "storeCnpj", label: "CNPJ loja", kind: "search" },
    { key: "issuerCnpj", label: "CNPJ emitente", kind: "search" },
    { key: "recipientCnpj", label: "CNPJ destinatário", kind: "search" },
    { key: "invoice", label: "Fatura", kind: "search" },
    { key: "customerName", label: "Cliente", kind: "select" },
    { key: "carrierService", label: "Transportadora serviço", kind: "select" },
    { key: "reconciled", label: "Conciliado", kind: "select", valueLabels: reconciledLabels },
    { key: "competence", label: "Competência", kind: "month" },
    { key: "issuedAt", label: "Data emissão", kind: "date" },
    { key: "dueDate", label: "Data vencimento", kind: "date" },
  ],
  toolbar: ["refresh"],
  pageActions: [
    {
      key: "send-billing",
      label: "Enviar cobrança",
      primary: true,
      form: {
        kind: "dialog",
        title: "Enviar cobrança",
        submitLabel: "Enviar cobrança",
        defaults: { customers: [], nfseKey: "", competence: "" },
        fields: [
          {
            name: "customers",
            label: "Clientes",
            kind: "multiselect",
            required: true,
            placeholder: "Buscar cliente",
            useOptions: useCustomerNameOptions,
          },
          { name: "nfseKey", label: "Chave NFS-e", required: true },
          { name: "competence", label: "Competência", kind: "date", required: true },
        ],
        submit: (values) => {
          const count = Array.isArray(values.customers) ? values.customers.length : 0;
          return `Cobrança enviada para ${count} cliente${count === 1 ? "" : "s"}.`;
        },
      },
    },
    {
      key: "reconcile",
      label: "Conciliar frete",
      run: () => toast.success("CTEs enviados para conciliação."),
    },
    {
      key: "summary",
      label: "Resumo dos valores",
      summary: {
        title: "Resumo dos valores",
        fields: [
          { name: "count", label: "CTEs", span: "half" },
          { name: "reconciledCount", label: "CTEs conciliados", span: "half" },
          { name: "total", label: "Valor total do frete", kind: "money", span: "half" },
          { name: "reconciledTotal", label: "Valor conciliado", kind: "money", span: "half" },
          { name: "pendingTotal", label: "Valor a conciliar", kind: "money" },
        ],
        compute: (ctes) => {
          const reconciled = ctes.filter((cte) => cte.reconciled);
          const sum = (items: readonly Cte[]) =>
            Math.round(items.reduce((total, cte) => total + cte.freightValue, 0) * 100) / 100;
          return {
            count: formatInteger(ctes.length),
            reconciledCount: formatInteger(reconciled.length),
            total: sum(ctes),
            reconciledTotal: sum(reconciled),
            pendingTotal: sum(ctes.filter((cte) => !cte.reconciled)),
          };
        },
      },
    },
  ],
  detail: {
    title: (cte) => `Visualizar CTE · ${cte.number}`,
    fields: [
      { name: "customerName", label: "Cliente", span: "half" },
      { name: "carrierService", label: "Transp. serviço", span: "half" },
      { name: "key", label: "Chave do CTE" },
      { name: "issuedAt", label: "Emissão", span: "third" },
      { name: "freightValue", label: "Valor do frete", kind: "money", span: "third" },
      { name: "reconciled", label: "Conciliado", kind: "switch", span: "third" },
    ],
  },
});

const reconciliationCteResource = defineResource<ReconciliationCte>({
  key: "reconciliation-ctes",
  title: "CTEs",
  noun: "CTE",
  article: "o",
  describe: (cte) => `CTE ${cte.number}`,
  hooks: {
    useFetchAll: useReconciliationCteFetchAllQuery,
    useUpdate: useReconciliationCteUpdateMutation,
  },
  columns: [
    { key: "id", header: "ID item", size: 110 },
    { key: "cteId", header: "ID CTE", size: 110 },
    { key: "number", header: "Número", size: 110 },
    { key: "series", header: "Série", size: 80 },
    { key: "key", header: "Chave", size: 330 },
    { key: "dueDate", header: "Vencimento", size: 120 },
    { key: "customerName", header: "Cliente" },
    { key: "cteValue", header: "Valor CTE", kind: "money", size: 120 },
    { key: "intermediationValue", header: "Valor intermediação", kind: "money", size: 170 },
    { key: "freightValue", header: "Valor frete", kind: "money", size: 120 },
    { key: "reconciled", header: "Conciliado", kind: "switch", size: 110 },
  ],
  searchKeys: ["number", "key"],
  searchPlaceholder: "Pesquisar CTE...",
  filters: [
    { key: "number", label: "Número CTE", kind: "search" },
    { key: "key", label: "Chave CTE", kind: "search" },
    { key: "reconciled", label: "Conciliado", kind: "select", valueLabels: reconciledLabels },
  ],
  toolbar: ["export"],
  pageActions: [
    {
      key: "recalculate",
      label: "Recalcular fatura",
      icon: ArrowsClockwiseIcon,
      primary: true,
      run: () => toast.success("Recálculo da fatura iniciado."),
    },
  ],
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
    { key: "date", header: "Data", size: 120 },
    { key: "customerName", header: "Cliente", filterable: true },
    { key: "cnpj", header: "CNPJ", size: 180 },
    { key: "tolerance", header: "Tolerância", kind: "money", size: 120 },
    { key: "cteCount", header: "CTEs", size: 90 },
    { key: "itemCount", header: "Total de itens", size: 130 },
    { key: "totalValue", header: "Valor total", kind: "money", size: 140 },
    { key: "difference", header: "Valor diferença", kind: "money", size: 150 },
    { key: "reconciledPercent", header: "% conciliado", kind: "percent", size: 130 },
  ],
  searchKeys: ["id", "customerName", "cnpj"],
  searchPlaceholder: "Pesquisar conciliação...",
  toolbar: ["download-csv"],
  createLabel: "Nova conciliação",
  recordPath: (reconciliation) =>
    `/magazord-envios/conciliacoes-de-frete/${reconciliation.id}`,
  rowLinks: [
    {
      key: "ctes",
      label: "Listar CTEs",
      to: (reconciliation) =>
        `/magazord-envios/conciliacoes-de-frete/${reconciliation.id}/ctes`,
    },
  ],
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
  menuOrder: ["recalculation-history", "record"],
  form: {
    kind: "drawer",
    createTitle: "Nova conciliação",
    editTitle: (reconciliation) => `Editar conciliação #${reconciliation.id}`,
    defaults: {
      date: new Date().toLocaleDateString("pt-BR"),
      customerName: "",
      cnpj: "",
      tolerance: 2,
      cteCount: 0,
      itemCount: 0,
      totalValue: 0,
      calculatedFreight: 0,
      difference: 0,
      reconciledPercent: 0,
      status: "Em análise",
    },
    fields: [
      { name: "customerName", label: "Cliente", kind: "select", required: true, useOptions: useCustomerNameOptions },
      { name: "date", label: "Data", kind: "date", span: "half", required: true },
      { name: "tolerance", label: "Tolerância", kind: "money", span: "half", required: true },
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
        { name: "customerName", label: "Cliente", span: "half" },
        { name: "cnpj", label: "CNPJ", span: "half" },
        { name: "date", label: "Data", span: "half" },
        { name: "tolerance", label: "Tolerância", kind: "money", span: "half" },
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
        { name: "difference", label: "Valor diferença", kind: "money", span: "half" },
        { name: "reconciledPercent", label: "% conciliado", suffix: "%", span: "half" },
        { name: "cteCount", label: "CTEs informados", span: "half" },
        { name: "itemCount", label: "Total de itens", span: "half" },
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
      linkLabel: "Listar CTEs",
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
  toolbar: ["download-csv"],
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
