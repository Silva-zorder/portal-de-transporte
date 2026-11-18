import { toast } from "@hubble-ds/components/ui/toast";
import {
  ArrowsClockwiseIcon,
  ClockCounterClockwiseIcon,
  DownloadSimpleIcon,
  EyeIcon,
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
import { downloadCsv, formatInteger, toCsv } from "@/lib/resource/format";
import { defineRecord } from "@/lib/resource/record";
import { defineResource, type ResourceRecord } from "@/lib/resource/types";
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
    { key: "number", header: "Número", size: 100 },
    { key: "customerName", header: "Cliente" },
    { key: "key", header: "Chave", size: 260 },
    { key: "issuedAt", header: "Emissão", size: 100 },
    { key: "dueDate", header: "Vencimento", size: 100 },
    { key: "carrierService", header: "Transp. serviço" },
    { key: "freightValue", header: "Valor do frete", kind: "money", size: 120 },
    { key: "reconciled", header: "Conciliado", size: 100, valueLabels: reconciledLabels },
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
  toolbar: [],
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
      key: "import",
      label: "Importar",
      icon: UploadSimpleIcon,
      group: "transfer",
      form: {
        kind: "dialog",
        title: "Importar CTE",
        submitLabel: "Importar",
        defaults: { file: [], competence: "", invoiceNumber: "", dueDate: "", fileName: "" },
        fields: [
          {
            name: "file",
            label: "Arquivo",
            kind: "file",
            accept: ".zip,.xml",
            placeholder: "Clique aqui ou arraste um arquivo .ZIP ou .XML",
            required: true,
          },
          { name: "competence", label: "Competência", kind: "month", placeholder: "MM/AAAA", required: true },
          { name: "invoiceNumber", label: "Número da fatura", span: "half", required: true },
          { name: "dueDate", label: "Data de vencimento", kind: "date", span: "half", required: true },
          { name: "fileName", label: "Nome do arquivo", placeholder: "Usa o nome do arquivo enviado se ficar vazio" },
        ],
        submit: (values) => {
          const [file] = (values.file as File[] | undefined) ?? [];
          const name = String(values.fileName ?? "").trim() || file?.name || "arquivo";
          return `${name} recebido para a competência ${values.competence}. A importação será processada em segundo plano.`;
        },
      },
    },
    {
      key: "export",
      label: "Exportar",
      icon: DownloadSimpleIcon,
      group: "transfer",
      run: (_selected, visible) => {
        downloadCsv(
          "ctes.csv",
          toCsv(visible as unknown as ResourceRecord[], [
            { key: "number", header: "Número" },
            { key: "series", header: "Série" },
            { key: "key", header: "Chave" },
            { key: "customerIdentifier", header: "Identificador cliente" },
            { key: "customerName", header: "Cliente" },
            { key: "competence", header: "Competência" },
            { key: "issuedAt", header: "Emissão" },
            { key: "dueDate", header: "Vencimento" },
            { key: "carrierService", header: "Transportadora serviço" },
            { key: "trackingCode", header: "Código de rastreio" },
            { key: "invoice", header: "Fatura" },
            { key: "cteValue", header: "Valor CTE", kind: "money" },
            { key: "freightValue", header: "Valor do frete", kind: "money" },
            { key: "reconciled", header: "Conciliado", valueLabels: reconciledLabels },
          ]),
        );
        toast.success(
          visible.length === 1
            ? "1 CTE exportado em CSV."
            : `${visible.length} CTEs exportados em CSV.`,
        );
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
  /**
   * "Visualizar CTE" do legado, com as informações correlatas agrupadas: o documento CT-e, a NF-e
   * de origem, cliente e pedido, emitente/destinatário, transporte e cobrança; as opções (JSON) fecham a visualização.
   */
  views: [
    {
      key: "detail",
      label: "Visualizar",
      icon: EyeIcon,
      kind: "drawer",
      title: (cte) => `Visualizar CTE · ${cte.number}`,
      footerActions: ["download"],
      fields: [
        { name: "key", label: "Chave", group: "CT-e" },
        { name: "number", label: "Número", span: "third", group: "CT-e" },
        { name: "series", label: "Série", span: "third", group: "CT-e" },
        { name: "competence", label: "Competência", span: "third", group: "CT-e" },
        { name: "issuedAt", label: "Data de emissão", span: "half", group: "CT-e" },
        { name: "cteValue", label: "Valor", kind: "money", span: "half", group: "CT-e" },
        { name: "nfeKey", label: "Chave", group: "NF-e" },
        { name: "nfeGeneratedAt", label: "Data de geração", span: "half", group: "NF-e" },
        { name: "freightValue", label: "Valor do frete", kind: "money", span: "half", group: "NF-e" },
        { name: "customerName", label: "Nome do cliente", span: "half", group: "Cliente e pedido" },
        { name: "customerIdentifier", label: "Identificador do cliente", span: "half", group: "Cliente e pedido" },
        { name: "storeName", label: "Loja", span: "half", group: "Cliente e pedido" },
        { name: "storeCnpj", label: "CPF/CNPJ da loja", span: "half", group: "Cliente e pedido" },
        { name: "orderCode", label: "Código do pedido", span: "half", group: "Cliente e pedido" },
        { name: "issuerCnpj", label: "CPF/CNPJ do emitente", span: "half", group: "Emitente e destinatário" },
        { name: "recipientCnpj", label: "CPF/CNPJ do destinatário", span: "half", group: "Emitente e destinatário" },
        { name: "carrierService", label: "Transportadora", group: "Transporte" },
        { name: "trackingCode", label: "Código de rastreio", span: "half", group: "Transporte" },
        { name: "carrierTrackingCode", label: "Código de rastreio (transportadora)", span: "half", group: "Transporte" },
        { name: "grossWeight", label: "Peso bruto", kind: "decimal", suffix: "kg", span: "half", group: "Transporte" },
        { name: "billedWeight", label: "Peso faturado", kind: "decimal", suffix: "kg", span: "half", group: "Transporte" },
        { name: "dueDate", label: "Vencimento", span: "third", group: "Cobrança" },
        { name: "invoice", label: "Fatura", span: "third", group: "Cobrança" },
        { name: "reconciled", label: "Conciliado", kind: "switch", span: "third", group: "Cobrança" },
        { name: "options", label: "Opções", kind: "code" },
      ],
    },
  ],
  rowActions: [
    {
      key: "download",
      label: "Baixar arquivo",
      icon: DownloadSimpleIcon,
      run: (cte) => toast.success(`Download de ${cte.fileName} iniciado.`),
    },
  ],
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
    { key: "id", header: "ID item", size: 80 },
    { key: "cteId", header: "ID CTE", size: 80 },
    { key: "number", header: "Número", size: 90 },
    { key: "series", header: "Série", size: 64 },
    { key: "key", header: "Chave", size: 200 },
    { key: "dueDate", header: "Vencimento", size: 100 },
    { key: "customerName", header: "Cliente" },
    { key: "cteValue", header: "Valor CTE", kind: "money", size: 110 },
    { key: "intermediationValue", header: "Valor intermediação", kind: "money", size: 140 },
    { key: "freightValue", header: "Valor frete", kind: "money", size: 100 },
    { key: "reconciled", header: "Conciliado", kind: "switch", size: 100 },
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
    { key: "id", header: "ID", size: 72 },
    { key: "date", header: "Data", size: 100 },
    { key: "customerName", header: "Cliente", filterable: true },
    { key: "cnpj", header: "CNPJ", size: 150 },
    { key: "tolerance", header: "Tolerância", kind: "money", size: 100 },
    { key: "cteCount", header: "CTEs", size: 64 },
    { key: "itemCount", header: "Total de itens", size: 100 },
    { key: "totalValue", header: "Valor total", kind: "money", size: 120 },
    { key: "difference", header: "Valor diferença", kind: "money", size: 120 },
    { key: "reconciledPercent", header: "% conciliado", kind: "percent", size: 110 },
  ],
  searchKeys: ["id", "customerName", "cnpj"],
  searchPlaceholder: "Pesquisar conciliação...",
  toolbar: ["export"],
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
  toolbar: ["export"],
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
