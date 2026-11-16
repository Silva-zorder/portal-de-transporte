import {
  MapPinIcon,
  PercentIcon,
  ScalesIcon,
} from "@phosphor-icons/react";
import { useDeadlineTableCreateMutation } from "@/hooks/use-deadline-table-create-mutation";
import { useDeadlineTableFetchAllQuery } from "@/hooks/use-deadline-table-fetch-all-query";
import { useDeadlineTableFindByIdQuery } from "@/hooks/use-deadline-table-find-by-id-query";
import { useDeadlineTableRemoveMutation } from "@/hooks/use-deadline-table-remove-mutation";
import { useDeadlineTableUpdateMutation } from "@/hooks/use-deadline-table-update-mutation";
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
import { EnumFeeTypeOptions } from "@/lib/enum/fee-type";
import { EnumPlatformOptions } from "@/lib/enum/platform";
import { EnumPriceTableTypeOptions } from "@/lib/enum/price-table-type";
import { EnumSharedPlatformOptions } from "@/lib/enum/shared-platform";
import { EnumTariffAcronymOptions } from "@/lib/enum/tariff-acronym";
import { formatInteger, formatStatus } from "@/lib/resource/format";
import { defineRecord } from "@/lib/resource/record";
import { defineResource } from "@/lib/resource/types";
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
    { key: "tariffAcronym", header: "Sigla tarifária", filterable: true },
    { key: "zipStart", header: "CEP inicial" },
    { key: "zipEnd", header: "CEP final" },
    { key: "days", header: "Prazo (dias)", size: 140 },
  ],
  searchKeys: ["tariffAcronym", "zipStart", "zipEnd"],
  searchPlaceholder: "Pesquisar por CEP ou sigla tarifária...",
  toolbar: ["export", "import", "filter"],
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
      { name: "days", label: "Prazo (dias)", kind: "integer", required: true },
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
  toolbar: ["download-csv", "filter"],
  createLabel: "Nova tabela de prazo",
  recordPath: (table) => `/tabelas-de-frete/prazos/${table.id}`,
  rowLinks: [
    {
      key: "zip-ranges",
      label: "Faixas de CEP",
      icon: MapPinIcon,
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
      additionalDays: 0,
      cutoffTime: "14:00",
      considerHolidays: true,
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
      { name: "platform", label: "Plataforma", kind: "select", options: platformOptions, span: "half", required: true },
      { name: "sharedPlatforms", label: "Plataformas compartilhadas", kind: "select", options: sharedPlatformOptions },
      { name: "additionalDays", label: "Dias adicionais", kind: "integer", span: "half" },
      { name: "cutoffTime", label: "Horário de corte", span: "half", placeholder: "00:00" },
      { name: "considerHolidays", label: "Considerar feriados", kind: "switch" },
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
      span: "half",
      fields: [
        { name: "name", label: "Nome" },
        { name: "carrierService", label: "Transportadora serviço", span: "half" },
        { name: "sharedPlatforms", label: "Plataformas compartilhadas", span: "half" },
        { name: "active", label: "Status", kind: "status-feminine" },
      ],
    },
    {
      key: "settings",
      title: "Configuração de prazos",
      description: "Regras aplicadas sobre o prazo da faixa",
      span: "half",
      fields: [
        { name: "additionalDays", label: "Dias adicionais", span: "third" },
        { name: "cutoffTime", label: "Horário de corte", span: "third" },
        { name: "considerHolidays", label: "Considerar feriados", kind: "switch", span: "third" },
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
    { key: "tariffAcronym", header: "Sigla tarifária", filterable: true },
    { key: "weightLimit", header: "Limite de peso (kg)", kind: "decimal" },
    { key: "value", header: "Valor", kind: "money" },
  ],
  searchKeys: ["id", "tariffAcronym"],
  searchPlaceholder: "Pesquisar por sigla tarifária...",
  toolbar: ["export", "import", "filter"],
  createLabel: "Nova carga",
  form: {
    kind: "dialog",
    createTitle: "Nova carga",
    editTitle: (load) =>
      `Editar carga · ${load.tariffAcronym} até ${formatInteger(load.weightLimit)} kg`,
    defaults: { priceTableId: 0, tariffAcronym: "", weightLimit: 0, value: 0 },
    fields: [
      {
        name: "tariffAcronym",
        label: "Sigla tarifária",
        kind: "select",
        options: tariffAcronymOptions,
        required: true,
      },
      { name: "weightLimit", label: "Limite de peso (kg)", kind: "decimal", required: true },
      { name: "value", label: "Valor", kind: "money", required: true },
    ],
  },
});

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
    { key: "zipStart", header: "CEP inicial" },
    { key: "zipEnd", header: "CEP final" },
    { key: "type", header: "Tipo", filterable: true },
    { key: "calculationBase", header: "Base de cálculo", filterable: true },
    { key: "value", header: "Valor", kind: "decimal", size: 110 },
    { key: "order", header: "Ordem", size: 96 },
  ],
  searchKeys: ["zipStart", "zipEnd", "type"],
  searchPlaceholder: "Pesquisar por CEP ou tipo...",
  toolbar: ["export", "import", "filter"],
  createLabel: "Nova taxa",
  form: {
    kind: "dialog",
    createTitle: "Nova taxa",
    editTitle: (fee) => `Editar taxa · ${fee.type}`,
    defaults: {
      priceTableId: 0,
      zipStart: "",
      zipEnd: "",
      type: "",
      calculationBase: "",
      value: 0,
      order: 1,
    },
    fields: [
      { name: "zipStart", label: "CEP inicial", span: "half", required: true },
      { name: "zipEnd", label: "CEP final", span: "half", required: true },
      { name: "type", label: "Tipo", kind: "select", options: feeTypeOptions, span: "half", required: true },
      { name: "calculationBase", label: "Base de cálculo", kind: "select", options: calculationBaseOptions, span: "half", required: true },
      { name: "value", label: "Valor", kind: "decimal", span: "half", required: true },
      { name: "order", label: "Ordem", kind: "integer", span: "half", required: true },
    ],
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
  toolbar: ["export", "filter"],
  createLabel: "Nova tabela de preço",
  recordPath: (table) => `/tabelas-de-frete/precos/${table.id}`,
  rowLinks: [
    {
      key: "loads",
      label: "Cargas",
      icon: ScalesIcon,
      to: (table) => `/tabelas-de-frete/precos/${table.id}/cargas`,
    },
    {
      key: "fees",
      label: "Taxas",
      icon: PercentIcon,
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

const tableRelationResource = defineResource<TableRelation>({
  key: "table-relations",
  title: "Relacionamento de tabelas",
  noun: "relacionamento",
  article: "o",
  describe: (relation) => `${relation.name} · ${relation.carrierService}`,
  hooks: {
    useFetchAll: useTableRelationFetchAllQuery,
    useCreate: useTableRelationCreateMutation,
    useUpdate: useTableRelationUpdateMutation,
    useRemove: useTableRelationRemoveMutation,
  },
  statusSwitch: true,
  columns: [
    { key: "id", header: "ID", size: 96 },
    { key: "name", header: "Nome", filterable: true },
    { key: "carrierService", header: "Serviço transportadora" },
  ],
  searchKeys: ["id", "name", "carrierService"],
  searchPlaceholder: "Pesquisar relacionamento...",
  toolbar: ["download-csv", "filter"],
  createLabel: "Novo relacionamento",
  detail: {
    title: (relation) => `Relacionamento · ${relation.name}`,
    fields: [
      { name: "customerName", label: "Cliente", span: "half" },
      { name: "carrierService", label: "Serviço transportadora", span: "half" },
      { name: "deadlineTable", label: "Tabela de prazo" },
      { name: "priceTable", label: "Tabela de preço" },
      { name: "transferTable", label: "Tabela de transferência" },
      { name: "calculatesFreight", label: "Cálculo de frete", kind: "switch", span: "half" },
      { name: "notifiesByEmail", label: "Notificações por e-mail", kind: "switch", span: "half" },
    ],
  },
  form: {
    kind: "drawer",
    createTitle: "Novo relacionamento",
    editTitle: () => "Editar relacionamento",
    defaults: {
      name: "",
      carrierService: "",
      customerName: "",
      deadlineTable: "",
      priceTable: "",
      transferTable: "",
      calculatesFreight: true,
      notifiesByEmail: false,
      active: true,
    },
    fields: [
      { name: "name", label: "Nome", required: true },
      { name: "customerName", label: "Cliente", kind: "select", span: "half", required: true, useOptions: useCustomerNameOptions },
      { name: "carrierService", label: "Serviço transportadora", kind: "select", span: "half", required: true, useOptions: useCarrierServiceNameOptions },
      { name: "deadlineTable", label: "Tabela de prazo", kind: "select", required: true, useOptions: useDeadlineTableNameOptions },
      { name: "priceTable", label: "Tabela de preço", kind: "select", required: true, useOptions: usePriceTableNameOptions },
      { name: "transferTable", label: "Tabela de transferência", kind: "select", useOptions: usePriceTableNameOptions },
      { name: "calculatesFreight", label: "Cálculo de frete", kind: "switch", span: "half" },
      { name: "notifiesByEmail", label: "Notificações por e-mail", kind: "switch", span: "half" },
    ],
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
