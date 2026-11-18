import { PackageIcon } from "@phosphor-icons/react";
import { useCarrierCreateMutation } from "@/hooks/use-carrier-create-mutation";
import { useCarrierFetchAllQuery } from "@/hooks/use-carrier-fetch-all-query";
import { useCarrierRemoveMutation } from "@/hooks/use-carrier-remove-mutation";
import { useCarrierServiceCreateMutation } from "@/hooks/use-carrier-service-create-mutation";
import { useCarrierServiceFetchAllQuery } from "@/hooks/use-carrier-service-fetch-all-query";
import { useCarrierServiceRemoveMutation } from "@/hooks/use-carrier-service-remove-mutation";
import { useCarrierServiceUpdateMutation } from "@/hooks/use-carrier-service-update-mutation";
import { useCarrierUpdateMutation } from "@/hooks/use-carrier-update-mutation";
import { useCustomerCreateMutation } from "@/hooks/use-customer-create-mutation";
import { useCustomerFetchAllQuery } from "@/hooks/use-customer-fetch-all-query";
import { useCustomerGroupCreateMutation } from "@/hooks/use-customer-group-create-mutation";
import { useCustomerGroupFetchAllQuery } from "@/hooks/use-customer-group-fetch-all-query";
import { useCustomerGroupFindByIdQuery } from "@/hooks/use-customer-group-find-by-id-query";
import { useCustomerGroupMemberCreateMutation } from "@/hooks/use-customer-group-member-create-mutation";
import { useCustomerGroupMemberFetchAllQuery } from "@/hooks/use-customer-group-member-fetch-all-query";
import { useCustomerGroupMemberRemoveMutation } from "@/hooks/use-customer-group-member-remove-mutation";
import { useCustomerGroupRemoveMutation } from "@/hooks/use-customer-group-remove-mutation";
import { useCustomerGroupUpdateMutation } from "@/hooks/use-customer-group-update-mutation";
import { useCustomerMarketplaceCreateMutation } from "@/hooks/use-customer-marketplace-create-mutation";
import { useCustomerMarketplaceFetchAllQuery } from "@/hooks/use-customer-marketplace-fetch-all-query";
import { useCustomerMarketplaceFindByIdQuery } from "@/hooks/use-customer-marketplace-find-by-id-query";
import { useCustomerMarketplaceRemoveMutation } from "@/hooks/use-customer-marketplace-remove-mutation";
import { useCustomerMarketplaceUpdateMutation } from "@/hooks/use-customer-marketplace-update-mutation";
import { useCustomerRemoveMutation } from "@/hooks/use-customer-remove-mutation";
import { useCustomerUpdateMutation } from "@/hooks/use-customer-update-mutation";
import { useMarketplaceCarrierCreateMutation } from "@/hooks/use-marketplace-carrier-create-mutation";
import { useMarketplaceCarrierFetchAllQuery } from "@/hooks/use-marketplace-carrier-fetch-all-query";
import { useMarketplaceCarrierRemoveMutation } from "@/hooks/use-marketplace-carrier-remove-mutation";
import { useMarketplaceCarrierUpdateMutation } from "@/hooks/use-marketplace-carrier-update-mutation";
import { EnumMarketplaceOptions } from "@/lib/enum/marketplace";
import { EnumPlatformOptions } from "@/lib/enum/platform";
import { formatInteger, formatStatus } from "@/lib/resource/format";
import { defineRecord } from "@/lib/resource/record";
import { defineResource } from "@/lib/resource/types";
import type { Carrier } from "@/services/portal/v1/carrier.service";
import type { CarrierService } from "@/services/portal/v1/carrier-service.service";
import type { Customer } from "@/services/portal/v1/customer.service";
import type { CustomerGroup } from "@/services/portal/v1/customer-group.service";
import type { CustomerGroupMember } from "@/services/portal/v1/customer-group-member.service";
import type { CustomerMarketplace } from "@/services/portal/v1/customer-marketplace.service";
import type { MarketplaceCarrier } from "@/services/portal/v1/marketplace-carrier.service";

const platformOptions = EnumPlatformOptions.map((option) => option.value);
const marketplaceOptions = EnumMarketplaceOptions.map((option) => option.value);

const NO_OPTIONS: readonly string[] = [];

function useCarrierNameOptions() {
  return useCarrierFetchAllQuery().data?.map((carrier) => carrier.name) ?? NO_OPTIONS;
}

function useCustomerNameOptions() {
  return useCustomerFetchAllQuery().data?.map((customer) => customer.name) ?? NO_OPTIONS;
}

function useCarrierServiceNameOptions() {
  return (
    useCarrierServiceFetchAllQuery().data?.map((service) => service.name) ?? NO_OPTIONS
  );
}

const carrierResource = defineResource<Carrier>({
  key: "carriers",
  title: "Transportadoras",
  noun: "transportadora",
  article: "a",
  describe: (carrier) => carrier.name,
  hooks: {
    useFetchAll: useCarrierFetchAllQuery,
    useCreate: useCarrierCreateMutation,
    useUpdate: useCarrierUpdateMutation,
    useRemove: useCarrierRemoveMutation,
  },
  statusSwitch: true,
  columns: [
    { key: "id", header: "ID", size: 96 },
    { key: "name", header: "Transportadora" },
    {
      key: "partner",
      header: "Parceria",
      kind: "badge",
      size: 160,
      filterable: true,
      valueLabels: { true: "Parceira", false: "Não parceira" },
      badgeVariants: { Parceira: "primary", "Não parceira": "outline" },
    },
  ],
  searchKeys: ["id", "name"],
  searchPlaceholder: "Pesquisar transportadora...",
  toolbar: [],
  createLabel: "Nova transportadora",
  form: {
    kind: "drawer",
    createTitle: "Nova transportadora",
    editTitle: () => "Editar transportadora",
    defaults: { name: "", partner: false, active: true },
    fields: [
      { name: "name", label: "Nome", required: true },
      { name: "partner", label: "Parceiro", kind: "switch" },
    ],
  },
});

const carrierServiceResource = defineResource<CarrierService>({
  key: "carrier-services",
  title: "Transportadora Serviço",
  noun: "serviço",
  article: "o",
  describe: (service) => service.name,
  hooks: {
    useFetchAll: useCarrierServiceFetchAllQuery,
    useCreate: useCarrierServiceCreateMutation,
    useUpdate: useCarrierServiceUpdateMutation,
    useRemove: useCarrierServiceRemoveMutation,
  },
  statusSwitch: true,
  columns: [
    { key: "id", header: "ID", size: 96 },
    { key: "acronym", header: "Sigla", size: 96 },
    { key: "carrierName", header: "Transportadora", filterable: true },
    { key: "name", header: "Nome" },
  ],
  searchKeys: ["id", "acronym", "carrierName", "name"],
  searchPlaceholder: "Pesquisar serviço...",
  toolbar: [],
  createLabel: "Novo serviço",
  form: {
    kind: "drawer",
    createTitle: "Novo serviço",
    editTitle: () => "Editar transportadora serviço",
    defaults: {
      acronym: "",
      name: "",
      carrierName: "",
      cnpj: "",
      tarAcronym: "",
      freightTimeout: 3000,
      active: true,
    },
    fields: [
      {
        name: "carrierName",
        label: "Transportadora",
        kind: "select",
        required: true,
        useOptions: useCarrierNameOptions,
      },
      { name: "name", label: "Nome", required: true },
      { name: "cnpj", label: "CNPJ", kind: "cnpj", placeholder: "00.000.000/0000-00" },
      { name: "acronym", label: "Sigla", span: "half", required: true },
      { name: "tarAcronym", label: "Sigla TAR", span: "half" },
      {
        name: "freightTimeout",
        label: "Timeout do cálculo de frete",
        kind: "integer",
        suffix: "ms",
      },
    ],
  },
});

function useCustomerLinkPrepare() {
  const customers = useCustomerFetchAllQuery().data;
  return (values: Record<string, unknown>) => {
    const customer = customers?.find(
      (candidate) => candidate.name === values.customerName,
    );
    return customer ? { ...values, customerId: customer.id } : values;
  };
}

function useGroupMemberPrepare() {
  const customers = useCustomerFetchAllQuery().data;
  return (values: Record<string, unknown>) => {
    const customer = customers?.find(
      (candidate) => candidate.name === values.name,
    );
    return { ...values, identifier: customer?.identifier ?? "" };
  };
}

const customerMarketplaceFields = [
  { name: "marketplace", label: "Marketplace", kind: "select", options: marketplaceOptions, required: true, span: "half" },
  { name: "description", label: "Descrição", span: "half" },
  { name: "userId", label: "Identificador do vendedor", required: true },
] as const;

const customerMarketplaceDefaults = {
  identifier: "",
  customerId: 0,
  customerName: "",
  marketplace: "Mercado Livre",
  description: "",
  userId: "",
  active: true,
};

const marketplaceCarrierResource = defineResource<MarketplaceCarrier>({
  key: "marketplace-carriers",
  title: "Transportadoras",
  noun: "transportadora",
  article: "a",
  describe: (carrier) => carrier.carrierService,
  hooks: {
    useFetchAll: useMarketplaceCarrierFetchAllQuery,
    useCreate: useMarketplaceCarrierCreateMutation,
    useUpdate: useMarketplaceCarrierUpdateMutation,
    useRemove: useMarketplaceCarrierRemoveMutation,
  },
  columns: [
    { key: "carrierService", header: "Serviço transportadora" },
    { key: "marketplaceCode", header: "Cód. no marketplace" },
    { key: "active", header: "Status", kind: "status-text", size: 120, filterable: true },
  ],
  searchKeys: ["carrierService", "marketplaceCode"],
  searchPlaceholder: "Pesquisar serviço de transportadora...",
  toolbar: ["export", "import"],
  createLabel: "Nova transportadora",
  form: {
    kind: "dialog",
    createTitle: "Nova transportadora do marketplace",
    editTitle: (carrier) => `Editar transportadora · ${carrier.carrierService}`,
    defaults: {
      customerMarketplaceId: 0,
      carrierService: "",
      marketplaceCode: "",
      active: true,
    },
    fields: [
      {
        name: "carrierService",
        label: "Serviço transportadora",
        kind: "select",
        required: true,
        useOptions: useCarrierServiceNameOptions,
      },
      { name: "marketplaceCode", label: "Cód. no marketplace", required: true },
      { name: "active", label: "Ativo", kind: "switch" },
    ],
  },
});

const customerMarketplaceResource = defineResource<CustomerMarketplace>({
  key: "customer-marketplaces",
  title: "Marketplace",
  noun: "marketplace",
  article: "o",
  describe: (market) => `${market.customerName} · ${market.marketplace}`,
  hooks: {
    useFetchAll: useCustomerMarketplaceFetchAllQuery,
    useCreate: useCustomerMarketplaceCreateMutation,
    useUpdate: useCustomerMarketplaceUpdateMutation,
    useRemove: useCustomerMarketplaceRemoveMutation,
  },
  statusSwitch: true,
  columns: [
    { key: "identifier", header: "Identificador", size: 120 },
    { key: "customerId", header: "ID cliente", size: 110 },
    { key: "customerName", header: "Cliente" },
    { key: "marketplace", header: "Marketplace", size: 140 },
    { key: "description", header: "Descrição" },
    { key: "userId", header: "Identificador do vendedor", size: 200 },
  ],
  searchKeys: ["identifier", "customerId", "customerName", "description"],
  searchPlaceholder: "Pesquisar por cliente ou marketplace...",
  filters: [
    { key: "identifier", label: "Identificador", kind: "search" },
    { key: "customerId", label: "ID cliente", kind: "search" },
    { key: "customerName", label: "Nome cliente", kind: "search" },
    { key: "description", label: "Descrição", kind: "search" },
    { key: "active", label: "Ativo", kind: "select", valueLabels: { true: "Ativo", false: "Inativo" } },
  ],
  toolbar: ["download-csv"],
  createLabel: "Novo marketplace",
  recordPath: (market) => `/cadastros/marketplace/${market.id}`,
  rowLinks: [
    {
      key: "carriers",
      label: "Transportadoras",
      to: (market) => `/cadastros/marketplace/${market.id}/transportadoras`,
    },
  ],
  form: {
    kind: "drawer",
    createTitle: "Novo marketplace do cliente",
    editTitle: () => "Editar marketplace do cliente",
    defaults: customerMarketplaceDefaults,
    usePrepare: useCustomerLinkPrepare,
    fields: [
      {
        name: "customerName",
        label: "Cliente",
        kind: "select",
        required: true,
        useOptions: useCustomerNameOptions,
      },
      ...customerMarketplaceFields,
    ],
  },
});

const customerResource = defineResource<Customer>({
  key: "customers",
  title: "Clientes",
  noun: "cliente",
  article: "o",
  describe: (customer) => customer.name,
  hooks: {
    useFetchAll: useCustomerFetchAllQuery,
    useCreate: useCustomerCreateMutation,
    useUpdate: useCustomerUpdateMutation,
    useRemove: useCustomerRemoveMutation,
  },
  statusSwitch: true,
  columns: [
    { key: "id", header: "ID", size: 96 },
    { key: "platform", header: "Plataforma", size: 120, filterable: true },
    { key: "name", header: "Nome" },
    { key: "identifier", header: "Identificador" },
  ],
  searchKeys: ["id", "name", "identifier"],
  searchPlaceholder: "Pesquisar cliente...",
  toolbar: ["download-csv"],
  createLabel: "Novo cliente",
  detail: {
    kind: "drawer",
    title: (customer) => customer.name,
    fields: [
      { name: "name", label: "Nome" },
      { name: "identifier", label: "Identificador", span: "half" },
      { name: "platform", label: "Plataforma", span: "half" },
      { name: "cnpj", label: "CNPJ", span: "half" },
      { name: "active", label: "Status", kind: "status", span: "half" },
      { name: "token", label: "Token", span: "half" },
      { name: "analyst", label: "Analista responsável", span: "half" },
    ],
  },
  views: [
    {
      key: "melhor-envio",
      label: "Visualizar Melhor Envio",
      icon: PackageIcon,
      kind: "drawer",
      title: (customer) => `Melhor Envio · ${customer.name}`,
      fields: [
        { name: "melhorEnvioId", label: "Id cliente" },
        { name: "melhorEnvioToken", label: "Token cliente" },
        { name: "melhorEnvioAuthCode", label: "Código de autorização" },
      ],
    },
  ],
  form: {
    kind: "drawer",
    createTitle: "Novo cliente",
    editTitle: () => "Editar cliente",
    defaults: {
      platform: "MZ",
      name: "",
      identifier: "",
      cnpj: "",
      token: "",
      analyst: "",
      melhorEnvioId: "",
      melhorEnvioToken: "",
      melhorEnvioAuthCode: "",
      active: true,
    },
    fields: [
      { name: "name", label: "Nome", required: true },
      { name: "identifier", label: "Identificador", span: "half", required: true },
      { name: "platform", label: "Plataforma", kind: "select", options: platformOptions, span: "half", required: true },
      { name: "cnpj", label: "CNPJ", kind: "cnpj", placeholder: "00.000.000/0000-00" },
      { name: "token", label: "Token", span: "half" },
      { name: "analyst", label: "Analista responsável", span: "half" },
      { name: "melhorEnvioId", label: "Id cliente no Melhor Envio" },
    ],
  },
});

const customerMarketplaceRecord = defineRecord<CustomerMarketplace>({
  definition: customerMarketplaceResource,
  listPath: "/cadastros/marketplace",
  useFindById: useCustomerMarketplaceFindByIdQuery,
  title: (market) => `${market.customerName} · ${market.marketplace}`,
  workTabTitle: (market) => `${market.customerName} · ${market.marketplace}`,
  status: (market) => formatStatus(market.active),
  editLabel: "Editar marketplace",
  cards: [
    {
      key: "identification",
      title: "Identificação",
      description: "Vínculo do cliente com o marketplace",
      span: "full",
      fields: [
        { name: "customerName", label: "Cliente" },
        { name: "marketplace", label: "Marketplace", span: "half" },
        { name: "description", label: "Descrição", span: "half" },
        { name: "userId", label: "Identificador do vendedor", span: "half" },
        { name: "active", label: "Status", kind: "status", span: "half" },
      ],
    },
  ],
  tabs: [
    {
      key: "transportadoras",
      label: "Transportadoras",
      definition: marketplaceCarrierResource,
      parentKey: "customerMarketplaceId",
      summary: (count) =>
        `${formatInteger(count)} serviços de transportadora mapeados para este marketplace`,
      linkLabel: "Ver transportadoras",
    },
  ],
});

const customerGroupMemberResource = defineResource<CustomerGroupMember>({
  key: "customer-group-members",
  title: "Clientes",
  noun: "cliente",
  article: "o",
  describe: (member) => member.name,
  hooks: {
    useFetchAll: useCustomerGroupMemberFetchAllQuery,
    useCreate: useCustomerGroupMemberCreateMutation,
    useRemove: useCustomerGroupMemberRemoveMutation,
  },
  exposeRemove: true,
  columns: [
    { key: "id", header: "ID", size: 96 },
    { key: "name", header: "Nome" },
    { key: "identifier", header: "Identificador" },
  ],
  searchKeys: ["id", "name", "identifier"],
  searchPlaceholder: "Pesquisar cliente...",
  toolbar: ["export", "import"],
  createLabel: "Adicionar cliente",
  form: {
    kind: "dialog",
    createTitle: "Adicionar cliente ao grupo",
    editTitle: (member) => `Editar cliente · ${member.name}`,
    defaults: { customerGroupId: 0, name: "", identifier: "" },
    usePrepare: useGroupMemberPrepare,
    fields: [
      {
        name: "name",
        label: "Cliente",
        kind: "select",
        required: true,
        useOptions: useCustomerNameOptions,
      },
    ],
  },
});

const customerGroupResource = defineResource<CustomerGroup>({
  key: "customer-groups",
  title: "Grupos de clientes",
  noun: "grupo",
  article: "o",
  describe: (group) => group.description,
  hooks: {
    useFetchAll: useCustomerGroupFetchAllQuery,
    useCreate: useCustomerGroupCreateMutation,
    useUpdate: useCustomerGroupUpdateMutation,
    useRemove: useCustomerGroupRemoveMutation,
  },
  statusSwitch: true,
  columns: [
    { key: "id", header: "ID", size: 96 },
    { key: "platform", header: "Plataforma", size: 120, filterable: true },
    { key: "description", header: "Nome" },
  ],
  searchKeys: ["id", "description"],
  searchPlaceholder: "Pesquisar grupo...",
  toolbar: ["refresh"],
  createLabel: "Novo grupo",
  recordPath: (group) => `/cadastros/grupos-de-clientes/${group.id}`,
  rowLinks: [
    {
      key: "members",
      label: "Clientes do grupo",
      to: (group) => `/cadastros/grupos-de-clientes/${group.id}/clientes`,
    },
  ],
  form: {
    kind: "drawer",
    createTitle: "Novo grupo",
    editTitle: () => "Editar grupo",
    defaults: { platform: "MZ", description: "", active: true },
    fields: [
      { name: "platform", label: "Plataforma", kind: "select", options: platformOptions, required: true },
      { name: "description", label: "Descrição", required: true },
    ],
  },
});

const customerGroupRecord = defineRecord<CustomerGroup>({
  definition: customerGroupResource,
  listPath: "/cadastros/grupos-de-clientes",
  useFindById: useCustomerGroupFindByIdQuery,
  title: (group) => group.description,
  status: (group) => formatStatus(group.active),
  editLabel: "Editar grupo",
  cards: [
    {
      key: "identification",
      title: "Identificação",
      description: "Dados gerais do grupo",
      span: "full",
      fields: [
        { name: "description", label: "Descrição" },
        { name: "platform", label: "Plataforma", span: "half" },
        { name: "active", label: "Status", kind: "status", span: "half" },
      ],
    },
  ],
  tabs: [
    {
      key: "clientes",
      label: "Clientes",
      definition: customerGroupMemberResource,
      parentKey: "customerGroupId",
      summary: (count) =>
        `${formatInteger(count)} clientes fazem parte deste grupo`,
      linkLabel: "Ver clientes",
    },
  ],
});

export {
  carrierResource,
  carrierServiceResource,
  customerGroupRecord,
  customerGroupResource,
  customerMarketplaceRecord,
  customerMarketplaceResource,
  customerResource,
  useCarrierServiceNameOptions,
  useCustomerNameOptions,
};
