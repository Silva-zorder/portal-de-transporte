import { EyeIcon, GearSixIcon } from "@phosphor-icons/react";
import { useDeadlineTableCreateMutation } from "@/hooks/use-deadline-table-create-mutation";
import { useDeadlineTableFetchAllQuery } from "@/hooks/use-deadline-table-fetch-all-query";
import { useDeadlineTableFindByIdQuery } from "@/hooks/use-deadline-table-find-by-id-query";
import { useDeadlineTableRemoveMutation } from "@/hooks/use-deadline-table-remove-mutation";
import { useDeadlineTableUpdateMutation } from "@/hooks/use-deadline-table-update-mutation";
import { useCustomerFetchAllQuery } from "@/hooks/use-customer-fetch-all-query";
import { usePriceFeeCreateMutation } from "@/hooks/use-price-fee-create-mutation";
import { usePriceFeeFetchAllQuery } from "@/hooks/use-price-fee-fetch-all-query";
import { usePriceFeeRemoveMutation } from "@/hooks/use-price-fee-remove-mutation";
import { usePriceFeeUpdateMutation } from "@/hooks/use-price-fee-update-mutation";
import { usePriceLoadCreateMutation } from "@/hooks/use-price-load-create-mutation";
import { usePriceLoadFetchAllQuery } from "@/hooks/use-price-load-fetch-all-query";
import { usePriceLoadRemoveMutation } from "@/hooks/use-price-load-remove-mutation";
import { usePriceLoadUpdateMutation } from "@/hooks/use-price-load-update-mutation";
import { usePriceTableCreateMutation } from "@/hooks/use-price-table-create-mutation";
import { usePriceTableFetchAllQuery } from "@/hooks/use-price-table-fetch-all-query";
import { usePriceTableFindByIdQuery } from "@/hooks/use-price-table-find-by-id-query";
import { usePriceTableRemoveMutation } from "@/hooks/use-price-table-remove-mutation";
import { usePriceTableUpdateMutation } from "@/hooks/use-price-table-update-mutation";
import { useTableRelationCreateMutation } from "@/hooks/use-table-relation-create-mutation";
import { useTableRelationFetchAllQuery } from "@/hooks/use-table-relation-fetch-all-query";
import { useTableRelationRemoveMutation } from "@/hooks/use-table-relation-remove-mutation";
import { useTableRelationUpdateMutation } from "@/hooks/use-table-relation-update-mutation";
import { useZipRangeCreateMutation } from "@/hooks/use-zip-range-create-mutation";
import { useZipRangeFetchAllQuery } from "@/hooks/use-zip-range-fetch-all-query";
import { useZipRangeRemoveMutation } from "@/hooks/use-zip-range-remove-mutation";
import { useZipRangeUpdateMutation } from "@/hooks/use-zip-range-update-mutation";
import { EnumCalculationBaseOptions } from "@/lib/enum/calculation-base";
import { EnumCarrierApiTypeOptions } from "@/lib/enum/carrier-api-type";
import { EnumFeeTypeOptions } from "@/lib/enum/fee-type";
import { EnumFreightCalculationTypeOptions } from "@/lib/enum/freight-calculation-type";
import { EnumLoadTypeOptions } from "@/lib/enum/load-type";
import { EnumPlatformOptions } from "@/lib/enum/platform";
import { EnumPriceTableTypeOptions } from "@/lib/enum/price-table-type";
import { EnumSharedPlatformOptions } from "@/lib/enum/shared-platform";
import { EnumTariffAcronymOptions } from "@/lib/enum/tariff-acronym";
import { EnumUfOptions } from "@/lib/enum/uf";
import { formatInteger, formatStatus } from "@/lib/resource/format";
import { defineRecord } from "@/lib/resource/record";
import { defineResource, type ResourceField } from "@/lib/resource/types";
import type { DeadlineTable } from "@/services/portal/v1/deadline-table.service";
import type { PriceFee } from "@/services/portal/v1/price-fee.service";
import type { PriceLoad } from "@/services/portal/v1/price-load.service";
import type { PriceTable } from "@/services/portal/v1/price-table.service";
import type { TableRelation } from "@/services/portal/v1/table-relation.service";
import type { ZipRange } from "@/services/portal/v1/zip-range.service";
import {
  useCarrierServiceNameOptions,
  useCustomerNameOptions,
} from "./registrations.resource";

const platformOptions = EnumPlatformOptions.map((option) => option.value);
const sharedPlatformOptions = EnumSharedPlatformOptions.map((option) => option.value);
const priceTableTypeOptions = EnumPriceTableTypeOptions.map((option) => option.value);
const tariffAcronymOptions = EnumTariffAcronymOptions.map((option) => option.value);
const feeTypeOptions = EnumFeeTypeOptions.map((option) => option.value);
const calculationBaseOptions = EnumCalculationBaseOptions.map((option) => option.value);
const loadTypeOptions = EnumLoadTypeOptions.map((option) => option.value);
const ufOptions = EnumUfOptions.map((option) => option.value);
const freightCalculationTypeOptions = EnumFreightCalculationTypeOptions.map(
  (option) => option.value,
);
const carrierApiTypeOptions = EnumCarrierApiTypeOptions.map((option) => option.value);

const NO_OPTIONS: readonly string[] = [];

function useDeadlineTableNameOptions() {
  return useDeadlineTableFetchAllQuery().data?.map((table) => table.name) ?? NO_OPTIONS;
}

function usePriceTableNameOptions() {
  return usePriceTableFetchAllQuery().data?.map((table) => table.name) ?? NO_OPTIONS;
}

const zipRangeResource = defineResource<ZipRange>({
  key: "zip-ranges",
  title: "Faixas de CEP",
  noun: "faixa de CEP",
  article: "a",
  describe: (range) => `Faixa ${range.tariffAcronym} ${range.zipStart}`,
  hooks: {
    useFetchAll: useZipRangeFetchAllQuery,
    useCreate: useZipRangeCreateMutation,
    useUpdate: useZipRangeUpdateMutation,
    useRemove: useZipRangeRemoveMutation,
  },
  columns: [
    { key: "id", header: "ID", size: 96 },
    { key: "tariffAcronym", header: "Sigla tarifária" },
    { key: "zipStart", header: "CEP inicial" },
    { key: "zipEnd", header: "CEP final" },
    { key: "days", header: "Prazo (dias)", size: 140 },
    { key: "maxDays", header: "Prazo máximo (dias)", size: 180 },
  ],
  searchKeys: ["id"],
  searchPlaceholder: "Pesquisar por ID...",
  filters: [
    { key: "id", label: "ID", kind: "search" },
    { key: "tariffAcronym", label: "Sigla tarifária", kind: "input" },
    { key: "zipStart", label: "CEP", kind: "input", keys: ["zipStart", "zipEnd"] },
    { key: "days", label: "Prazo", kind: "input", keys: ["days", "maxDays"] },
  ],
  toolbar: ["export", "import"],
  createLabel: "Nova faixa",
  form: {
    kind: "dialog",
    createTitle: "Nova faixa de CEP",
    editTitle: (range) => `Editar faixa · ${range.tariffAcronym}`,
    defaults: {
      deadlineTableId: 0,
      tariffAcronym: "",
      zipStart: "",
      zipEnd: "",
      days: 1,
      maxDays: 1,
    },
    fields: [
      {
        name: "tariffAcronym",
        label: "Sigla tarifária",
        kind: "select",
        options: tariffAcronymOptions,
        required: true,
      },
      { name: "zipStart", label: "CEP inicial", kind: "cep", span: "half", required: true, placeholder: "00000-000" },
      { name: "zipEnd", label: "CEP final", kind: "cep", span: "half", required: true, placeholder: "00000-000" },
      { name: "days", label: "Prazo (dias)", kind: "integer", span: "half", required: true },
      { name: "maxDays", label: "Prazo máximo (dias)", kind: "integer", span: "half", required: true },
    ],
  },
});

const deadlineTableResource = defineResource<DeadlineTable>({
  key: "deadline-tables",
  title: "Prazos",
  noun: "tabela de prazo",
  article: "a",
  describe: (table) => table.name,
  hooks: {
    useFetchAll: useDeadlineTableFetchAllQuery,
    useCreate: useDeadlineTableCreateMutation,
    useUpdate: useDeadlineTableUpdateMutation,
    useRemove: useDeadlineTableRemoveMutation,
  },
  statusSwitch: true,
  columns: [
    { key: "id", header: "ID", size: 96 },
    { key: "platform", header: "Plataforma", size: 120, filterable: true },
    { key: "carrierService", header: "Transp. serviço", filterable: true },
    { key: "name", header: "Nome" },
  ],
  searchKeys: ["id", "name", "carrierService"],
  searchPlaceholder: "Pesquisar tabela de prazo...",
  toolbar: ["download-csv"],
  createLabel: "Nova tabela de prazo",
  recordPath: (table) => `/tabelas-de-frete/prazos/${table.id}`,
  rowLinks: [
    {
      key: "zip-ranges",
      label: "Faixas de CEP",
      to: (table) => `/tabelas-de-frete/prazos/${table.id}/faixas-de-cep`,
    },
  ],
  form: {
    kind: "drawer",
    createTitle: "Nova tabela de prazo",
    editTitle: () => "Editar tabela de prazo",
    defaults: {
      platform: "MZ",
      carrierService: "",
      name: "",
      sharedPlatforms: "MZ",
      active: true,
    },
    fields: [
      { name: "platform", label: "Plataforma", kind: "select", options: platformOptions, span: "half", required: true },
      { name: "sharedPlatforms", label: "Plataformas compartilhadas", kind: "select", options: sharedPlatformOptions, span: "half" },
      { name: "name", label: "Nome", required: true },
      {
        name: "carrierService",
        label: "Transportadora serviço",
        kind: "select",
        required: true,
        useOptions: useCarrierServiceNameOptions,
      },
    ],
    editFields: [
      { name: "sharedPlatforms", label: "Plataformas compartilhadas", kind: "select", options: sharedPlatformOptions },
      { name: "name", label: "Nome", required: true },
      {
        name: "carrierService",
        label: "Transportadora serviço",
        kind: "select",
        required: true,
        useOptions: useCarrierServiceNameOptions,
      },
    ],
  },
});

const deadlineTableRecord = defineRecord<DeadlineTable>({
  definition: deadlineTableResource,
  listPath: "/tabelas-de-frete/prazos",
  useFindById: useDeadlineTableFindByIdQuery,
  title: (table) => table.name,
  status: (table) => formatStatus(table.active, "a"),
  editLabel: "Editar tabela",
  cards: [
    {
      key: "identification",
      title: "Identificação",
      description: "Dados gerais da tabela",
      span: "full",
      fields: [
        { name: "name", label: "Nome" },
        { name: "carrierService", label: "Transportadora serviço", span: "half" },
        { name: "platform", label: "Plataforma", span: "half" },
        { name: "sharedPlatforms", label: "Plataformas compartilhadas", span: "half" },
        { name: "active", label: "Status", kind: "status-feminine", span: "half" },
      ],
    },
  ],
  tabs: [
    {
      key: "faixas-de-cep",
      label: "Faixas de CEP",
      definition: zipRangeResource,
      parentKey: "deadlineTableId",
      summary: (count) =>
        `${formatInteger(count)} faixas de CEP com prazo de entrega por sigla tarifária`,
      linkLabel: "Ver faixas de CEP",
    },
  ],
});

const priceLoadResource = defineResource<PriceLoad>({
  key: "price-loads",
  title: "Cargas",
  noun: "carga",
  article: "a",
  describe: (load) => `Carga ${load.tariffAcronym} até ${formatInteger(load.weightLimit)} kg`,
  hooks: {
    useFetchAll: usePriceLoadFetchAllQuery,
    useCreate: usePriceLoadCreateMutation,
    useUpdate: usePriceLoadUpdateMutation,
    useRemove: usePriceLoadRemoveMutation,
  },
  columns: [
    { key: "id", header: "ID", size: 120 },
    { key: "tariffAcronym", header: "Sigla tarifária" },
    { key: "type", header: "Tipo" },
    { key: "calculationBase", header: "Base de cálculo" },
    { key: "weightLimit", header: "Peso até (kg)", kind: "decimal" },
    { key: "value", header: "Valor", kind: "money" },
  ],
  searchKeys: ["tariffAcronym"],
  searchPlaceholder: "Pesquisar por sigla tarifária...",
  filters: [
    { key: "tariffAcronym", label: "Sigla tarifária", kind: "search" },
    { key: "value", label: "Valor", kind: "input", format: "money" },
    { key: "weightLimit", label: "Peso até", kind: "input", format: "decimal" },
  ],
  toolbar: ["export", "import"],
  createLabel: "Nova carga",
  form: {
    kind: "dialog",
    createTitle: "Nova carga",
    editTitle: (load) => `Editar carga · ${load.tariffAcronym}`,
    defaults: {
      priceTableId: 0,
      tariffAcronym: "",
      type: "",
      calculationBase: "",
      weightLimit: 0,
      value: 0,
    },
    fields: [
      {
        name: "tariffAcronym",
        label: "Sigla tarifária",
        kind: "select",
        options: tariffAcronymOptions,
        required: true,
      },
      { name: "type", label: "Tipo", kind: "select", options: loadTypeOptions, required: true },
      { name: "calculationBase", label: "Base de cálculo", kind: "select", options: calculationBaseOptions, required: true },
    ],
  },
});

const priceFeeFields: ResourceField<PriceFee>[] = [
  { name: "tariffAcronym", label: "Sigla tarifária", kind: "select", options: tariffAcronymOptions, required: true },
  { name: "zipStart", label: "CEP inicial", span: "half", required: true },
  { name: "zipEnd", label: "CEP final", span: "half", required: true },
  { name: "type", label: "Tipo", kind: "select", options: feeTypeOptions, span: "half", required: true },
  { name: "originUf", label: "UF origem", kind: "select", options: ufOptions, span: "half", required: true },
  { name: "calculationBase", label: "Base de cálculo", kind: "select", options: calculationBaseOptions, required: true },
  { name: "baseValueStart", label: "Base de cálculo · valor inicial", kind: "money", span: "half" },
  { name: "baseValueEnd", label: "Base de cálculo · valor final", kind: "money", span: "half" },
  { name: "value", label: "Valor", kind: "decimal", span: "third", required: true },
  { name: "minValue", label: "Valor mínimo", kind: "money", span: "third" },
  { name: "order", label: "Ordem", kind: "integer", span: "third", required: true },
];

const priceFeeResource = defineResource<PriceFee>({
  key: "price-fees",
  title: "Taxas",
  noun: "taxa",
  article: "a",
  describe: (fee) => `Taxa ${fee.type}`,
  hooks: {
    useFetchAll: usePriceFeeFetchAllQuery,
    useCreate: usePriceFeeCreateMutation,
    useUpdate: usePriceFeeUpdateMutation,
    useRemove: usePriceFeeRemoveMutation,
  },
  columns: [
    { key: "id", header: "ID", size: 110 },
    { key: "tariffAcronym", header: "Sigla tarifária", size: 130 },
    { key: "zipStart", header: "CEP inicial" },
    { key: "zipEnd", header: "CEP final" },
    { key: "type", header: "Tipo" },
    { key: "originUf", header: "UF origem", size: 110 },
    { key: "calculationBase", header: "Base de cálculo" },
    { key: "value", header: "Valor", kind: "decimal", size: 110 },
    { key: "minValue", header: "Valor mínimo", kind: "money", size: 130 },
    { key: "order", header: "Ordem", size: 96 },
  ],
  searchKeys: ["zipStart", "zipEnd", "order", "value"],
  searchPlaceholder: "Pesquisar taxa...",
  filters: [
    { key: "zipStart", label: "CEP", kind: "search", keys: ["zipStart", "zipEnd"] },
    { key: "order", label: "Ordem", kind: "search" },
    { key: "value", label: "Valor", kind: "search", format: "decimal" },
    { key: "type", label: "Tipo", kind: "select" },
    { key: "calculationBase", label: "Base de cálculo", kind: "select" },
  ],
  toolbar: ["export", "import"],
  createLabel: "Nova taxa",
  form: {
    kind: "drawer",
    createTitle: "Nova taxa",
    editTitle: (fee) => `Editar taxa · ${fee.type}`,
    defaults: {
      priceTableId: 0,
      tariffAcronym: "",
      zipStart: "",
      zipEnd: "",
      type: "",
      originUf: "",
      calculationBase: "",
      baseValueStart: 0,
      baseValueEnd: 0,
      value: 0,
      minValue: 0,
      order: 1,
    },
    fields: priceFeeFields,
  },
});

const priceTableResource = defineResource<PriceTable>({
  key: "price-tables",
  title: "Preços",
  noun: "tabela de preço",
  article: "a",
  describe: (table) => table.name,
  hooks: {
    useFetchAll: usePriceTableFetchAllQuery,
    useCreate: usePriceTableCreateMutation,
    useUpdate: usePriceTableUpdateMutation,
    useRemove: usePriceTableRemoveMutation,
  },
  statusSwitch: true,
  columns: [
    { key: "id", header: "ID", size: 96 },
    { key: "name", header: "Nome" },
    { key: "carrierService", header: "Transp. serviço", size: 220, filterable: true },
    { key: "platform", header: "Plataforma", size: 120, filterable: true },
  ],
  searchKeys: ["id", "name", "carrierService"],
  searchPlaceholder: "Pesquisar tabela de preço...",
  toolbar: ["export"],
  createLabel: "Nova tabela de preço",
  recordPath: (table) => `/tabelas-de-frete/precos/${table.id}`,
  rowLinks: [
    {
      key: "loads",
      label: "Cargas",
      to: (table) => `/tabelas-de-frete/precos/${table.id}/cargas`,
    },
    {
      key: "fees",
      label: "Taxas",
      to: (table) => `/tabelas-de-frete/precos/${table.id}/taxas`,
    },
  ],
  form: {
    kind: "drawer",
    createTitle: "Nova tabela de preço",
    editTitle: () => "Editar tabela de preço",
    defaults: {
      name: "",
      carrierService: "",
      type: "Preço",
      platform: "MZ",
      sharedPlatforms: "Magazord",
      valueLimit: 0,
      minWeight: 0,
      weightLimit: 0,
      heightLimit: 0,
      widthLimit: 0,
      lengthLimit: 0,
      active: true,
    },
    fields: [
      { name: "name", label: "Nome", required: true },
      {
        name: "carrierService",
        label: "Transportadora serviço",
        kind: "select",
        span: "half",
        required: true,
        useOptions: useCarrierServiceNameOptions,
      },
      { name: "type", label: "Tipo", kind: "select", options: priceTableTypeOptions, span: "half", required: true },
      { name: "sharedPlatforms", label: "Plataformas compartilhadas", kind: "select", options: sharedPlatformOptions },
      { name: "valueLimit", label: "Valor limite", kind: "money", span: "third" },
      { name: "minWeight", label: "Peso mínimo", kind: "decimal", suffix: "kg", span: "third" },
      { name: "weightLimit", label: "Peso limite", kind: "decimal", suffix: "kg", span: "third" },
      { name: "heightLimit", label: "Altura limite", kind: "decimal", suffix: "m", span: "third" },
      { name: "widthLimit", label: "Largura limite", kind: "decimal", suffix: "m", span: "third" },
      { name: "lengthLimit", label: "Comprimento limite", kind: "decimal", suffix: "m", span: "third" },
    ],
  },
});

const priceTableRecord = defineRecord<PriceTable>({
  definition: priceTableResource,
  listPath: "/tabelas-de-frete/precos",
  useFindById: usePriceTableFindByIdQuery,
  title: (table) => table.name,
  status: (table) => formatStatus(table.active, "a"),
  editLabel: "Editar",
  cards: [
    {
      key: "identification",
      title: "Identificação",
      description: "Dados gerais da tabela",
      span: "half",
      fields: [
        { name: "name", label: "Nome" },
        { name: "carrierService", label: "Transportadora serviço", span: "half" },
        { name: "type", label: "Tipo", span: "half" },
        { name: "sharedPlatforms", label: "Plataformas compartilhadas", span: "half" },
        { name: "active", label: "Status", kind: "status-feminine", span: "half" },
      ],
    },
    {
      key: "limits",
      title: "Limites",
      description: "Restrições aplicadas no cálculo do frete",
      span: "half",
      fields: [
        { name: "valueLimit", label: "Valor limite", kind: "money", span: "third" },
        { name: "minWeight", label: "Peso mínimo", kind: "decimal", suffix: "kg", span: "third" },
        { name: "weightLimit", label: "Peso limite", kind: "decimal", suffix: "kg", span: "third" },
        { name: "heightLimit", label: "Altura limite", kind: "decimal", suffix: "m", span: "third" },
        { name: "widthLimit", label: "Largura limite", kind: "decimal", suffix: "m", span: "third" },
        { name: "lengthLimit", label: "Comprimento limite", kind: "decimal", suffix: "m", span: "third" },
      ],
    },
  ],
  tabs: [
    {
      key: "cargas",
      label: "Cargas",
      definition: priceLoadResource,
      parentKey: "priceTableId",
      summary: (count) =>
        `${formatInteger(count)} faixas de peso × valor por sigla tarifária`,
      linkLabel: "Ver cargas",
    },
    {
      key: "taxas",
      label: "Taxas",
      definition: priceFeeResource,
      parentKey: "priceTableId",
      summary: (count) =>
        `${formatInteger(count)} regras (Advalorem, Gris, ICMS...) por faixa de CEP`,
      linkLabel: "Ver taxas",
    },
  ],
});

const tableRelationFields: ResourceField<TableRelation>[] = [
  { name: "customerName", label: "Cliente", kind: "select", required: true, useOptions: useCustomerNameOptions },
  { name: "carrierService", label: "Transportadora", kind: "select", required: true, useOptions: useCarrierServiceNameOptions },
  { name: "deadlineTable", label: "Tabela de prazo", kind: "select", required: true, useOptions: useDeadlineTableNameOptions },
  { name: "priceTable", label: "Tabela de preço", kind: "select", required: true, useOptions: usePriceTableNameOptions },
  { name: "transferTable", label: "Tabela de transferência", kind: "select", useOptions: usePriceTableNameOptions },
  { name: "magazordEnvios", label: "Magazord Envios", kind: "switch", group: "Opções" },
  {
    name: "intermediationTable",
    label: "Tabela de intermediação",
    kind: "select",
    required: true,
    useOptions: usePriceTableNameOptions,
    group: "Opções",
    visibleWhen: (values) => Boolean(values.magazordEnvios),
  },
  { name: "cubage", label: "Cubagem", kind: "switch", group: "Opções" },
  { name: "validatesDimensions", label: "Validação de dimensão", kind: "switch", group: "Opções" },
  { name: "validatesWeight", label: "Validação de peso", kind: "switch", group: "Opções" },
];

const integrationFields: ResourceField<TableRelation>[] = [
  { name: "freightCalculationType", label: "Tipo de cálculo de frete", kind: "select", options: freightCalculationTypeOptions, span: "half", group: "Cálculo de frete" },
  { name: "limitsDimensions", label: "Limite de dimensões", kind: "switch", span: "half", group: "Cálculo de frete" },
  { name: "volumeLimit", label: "Limite de volumes do cálculo de frete", kind: "integer", span: "half", group: "Cálculo de frete" },
  { name: "splitsVolumes", label: "Fracionar volumes", kind: "switch", span: "half", group: "Cálculo de frete" },
  { name: "timeout", label: "Tempo de timeout", kind: "integer", suffix: "ms", group: "Cálculo de frete" },
  { name: "notifiesByEmail", label: "Notificação via e-mail", kind: "switch", group: "Notificações" },
  {
    name: "notificationEmail",
    label: "E-mail",
    kind: "email",
    required: true,
    placeholder: "nome@empresa.com.br",
    group: "Notificações",
    visibleWhen: (values) => Boolean(values.notifiesByEmail),
  },
  {
    name: "sendsPdf",
    label: "Enviar como PDF",
    kind: "switch",
    group: "Notificações",
    visibleWhen: (values) => Boolean(values.notifiesByEmail),
  },
  { name: "notifiesByFtp", label: "Notificação FTP", kind: "switch", group: "Notificações" },
  { name: "carrierApiType", label: "Tipo de transportadora", kind: "select", options: carrierApiTypeOptions, group: "Dados de API" },
  { name: "trackingLink", label: "Link de rastreio", group: "Dados de API" },
  { name: "apiToken", label: "Token", group: "Dados de API" },
];

/** Resolve os ids do cliente e das tabelas escolhidos por nome nos selects. */
function useTableRelationPrepare() {
  const customers = useCustomerFetchAllQuery().data;
  const deadlineTables = useDeadlineTableFetchAllQuery().data;
  const priceTables = usePriceTableFetchAllQuery().data;
  return (values: Record<string, unknown>) => {
    const customer = customers?.find((candidate) => candidate.name === values.customerName);
    const idOf = (tables: { id: number; name: string }[] | undefined, name: unknown) =>
      tables?.find((table) => table.name === name)?.id ?? 0;
    return {
      ...values,
      name: customer?.name ?? values.name,
      customerId: customer?.id ?? values.customerId,
      customerToken: customer?.token ?? values.customerToken,
      deadlineTableId: idOf(deadlineTables, values.deadlineTable),
      priceTableId: idOf(priceTables, values.priceTable),
      transferTableId: idOf(priceTables, values.transferTable),
      intermediationTableId: values.magazordEnvios
        ? idOf(priceTables, values.intermediationTable)
        : 0,
      intermediationTable: values.magazordEnvios ? values.intermediationTable : "",
    };
  };
}

const tableRelationResource = defineResource<TableRelation>({
  key: "table-relations",
  title: "Relacionamento de tabelas",
  noun: "relacionamento",
  article: "o",
  describe: (relation) => `${relation.customerName} · ${relation.carrierService}`,
  hooks: {
    useFetchAll: useTableRelationFetchAllQuery,
    useCreate: useTableRelationCreateMutation,
    useUpdate: useTableRelationUpdateMutation,
    useRemove: useTableRelationRemoveMutation,
  },
  statusSwitch: true,
  columns: [
    { key: "id", header: "ID", size: 96 },
    { key: "customerId", header: "Cliente ID", size: 110 },
    { key: "name", header: "Nome" },
    { key: "carrierService", header: "Serviço transportadora" },
    { key: "priceTableId", header: "ID tabela de preço", size: 160 },
    { key: "deadlineTableId", header: "ID tabela de prazo", size: 160 },
  ],
  searchKeys: ["customerId", "name", "carrierService"],
  searchPlaceholder: "Pesquisar relacionamento...",
  filters: [
    { key: "customerId", label: "Cliente ID", kind: "search" },
    { key: "customerToken", label: "Token cliente", kind: "search" },
    { key: "name", label: "Nome", kind: "search" },
    { key: "carrierService", label: "Serviço transportadora", kind: "search" },
    { key: "priceTableId", label: "ID tabela de preço", kind: "search" },
    { key: "deadlineTableId", label: "ID tabela de prazo", kind: "search" },
    { key: "transferTableId", label: "ID tabela de transferência", kind: "search" },
    { key: "intermediationTableId", label: "ID tabela de intermediação", kind: "search" },
    { key: "active", label: "Ativo", kind: "select", valueLabels: { true: "Ativo", false: "Inativo" } },
  ],
  toolbar: ["download-csv"],
  createLabel: "Novo relacionamento",
  detail: {
    kind: "drawer",
    title: (relation) => `Relacionamento · ${relation.customerName}`,
    fields: tableRelationFields,
  },
  views: [
    {
      key: "integration-view",
      label: "Visualizar configuração de integração",
      icon: EyeIcon,
      kind: "drawer",
      title: (relation) => `Configuração de integração · ${relation.customerName}`,
      fields: integrationFields,
    },
  ],
  actionForms: [
    {
      key: "integration-edit",
      label: "Configuração de integração",
      icon: GearSixIcon,
      kind: "drawer",
      title: (relation) => `Configuração de integração · ${relation.customerName}`,
      fields: integrationFields,
    },
  ],
  menuOrder: ["integration-view", "integration-edit", "detail", "edit"],
  form: {
    kind: "drawer",
    createTitle: "Novo relacionamento",
    editTitle: () => "Editar relacionamento",
    usePrepare: useTableRelationPrepare,
    defaults: {
      name: "",
      customerId: 0,
      customerName: "",
      customerToken: "",
      carrierService: "",
      deadlineTableId: 0,
      deadlineTable: "",
      priceTableId: 0,
      priceTable: "",
      transferTableId: 0,
      transferTable: "",
      magazordEnvios: false,
      intermediationTableId: 0,
      intermediationTable: "",
      cubage: false,
      validatesDimensions: false,
      validatesWeight: false,
      freightCalculationType: "Peso real",
      limitsDimensions: false,
      volumeLimit: 10,
      splitsVolumes: false,
      timeout: 3000,
      notifiesByEmail: false,
      notificationEmail: "",
      sendsPdf: false,
      notifiesByFtp: false,
      carrierApiType: "",
      trackingLink: "",
      apiToken: "",
      active: true,
    },
    fields: tableRelationFields,
  },
});

export {
  deadlineTableRecord,
  deadlineTableResource,
  priceTableRecord,
  priceTableResource,
  tableRelationResource,
  useDeadlineTableNameOptions,
  usePriceTableNameOptions,
};
