// Gera service, query e hooks de cada domínio a partir do manifesto abaixo, no formato
// do AGENTS.md do Hubble ("Padrões para apps que consomem o Hubble").
// Uso: node scripts/generate-data-layer.mjs
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const root = join(import.meta.dirname, "..", "src");

const domains = {
  carrier: {
    path: "/carriers",
    fields: { name: "string", partner: "boolean", active: "boolean" },
  },
  "carrier-service": {
    path: "/carrier-services",
    fields: {
      acronym: "string",
      name: "string",
      carrierName: "string",
      cnpj: "string",
      tarAcronym: "string",
      freightTimeout: "number",
      active: "boolean",
    },
  },
  customer: {
    path: "/customers",
    fields: {
      platform: "string",
      name: "string",
      identifier: "string",
      cnpj: "string",
      token: "string",
      analyst: "string",
      melhorEnvioId: "string",
      melhorEnvioToken: "string",
      melhorEnvioAuthCode: "string",
      active: "boolean",
    },
  },
  "customer-marketplace": {
    path: "/customer-marketplaces",
    fields: {
      identifier: "string",
      customerId: "number",
      customerName: "string",
      marketplace: "string",
      description: "string",
      userId: "string",
      active: "boolean",
    },
  },
  "marketplace-carrier": {
    path: "/marketplace-carriers",
    fields: {
      customerMarketplaceId: "number",
      carrierService: "string",
      marketplaceCode: "string",
      active: "boolean",
    },
  },
  "customer-group": {
    path: "/customer-groups",
    fields: { platform: "string", description: "string", active: "boolean" },
  },
  "customer-group-member": {
    path: "/customer-group-members",
    fields: { customerGroupId: "number", name: "string", identifier: "string" },
  },
  "deadline-table": {
    path: "/deadline-tables",
    fields: {
      platform: "string",
      carrierService: "string",
      name: "string",
      sharedPlatforms: "string",
      active: "boolean",
    },
  },
  "zip-range": {
    path: "/zip-ranges",
    fields: {
      deadlineTableId: "number",
      tariffAcronym: "string",
      zipStart: "string",
      zipEnd: "string",
      days: "number",
      maxDays: "number",
    },
  },
  "price-table": {
    path: "/price-tables",
    fields: {
      name: "string",
      carrierService: "string",
      type: "string",
      platform: "string",
      sharedPlatforms: "string",
      valueLimit: "number",
      minWeight: "number",
      weightLimit: "number",
      heightLimit: "number",
      widthLimit: "number",
      lengthLimit: "number",
      active: "boolean",
    },
  },
  "price-load": {
    path: "/price-loads",
    fields: {
      priceTableId: "number",
      tariffAcronym: "string",
      type: "string",
      calculationBase: "string",
      weightLimit: "number",
      value: "number",
    },
  },
  "price-fee": {
    path: "/price-fees",
    fields: {
      priceTableId: "number",
      tariffAcronym: "string",
      zipStart: "string",
      zipEnd: "string",
      type: "string",
      originUf: "string",
      calculationBase: "string",
      baseValueStart: "number",
      baseValueEnd: "number",
      value: "number",
      minValue: "number",
      order: "number",
    },
  },
  "table-relation": {
    path: "/table-relations",
    fields: {
      name: "string",
      customerId: "number",
      customerName: "string",
      customerToken: "string",
      carrierService: "string",
      deadlineTableId: "number",
      deadlineTable: "string",
      priceTableId: "number",
      priceTable: "string",
      transferTableId: "number",
      transferTable: "string",
      magazordEnvios: "boolean",
      intermediationTableId: "number",
      intermediationTable: "string",
      cubage: "boolean",
      validatesDimensions: "boolean",
      validatesWeight: "boolean",
      freightCalculationType: "string",
      limitsDimensions: "boolean",
      volumeLimit: "number",
      splitsVolumes: "boolean",
      timeout: "number",
      notifiesByEmail: "boolean",
      notificationEmail: "string",
      sendsPdf: "boolean",
      notifiesByFtp: "boolean",
      carrierApiType: "string",
      trackingLink: "string",
      apiToken: "string",
      active: "boolean",
    },
  },
  cte: {
    path: "/ctes",
    fields: {
      number: "string",
      customerIdentifier: "string",
      customerName: "string",
      competence: "string",
      key: "string",
      issuedAt: "string",
      dueDate: "string",
      carrierService: "string",
      storeCnpj: "string",
      issuerCnpj: "string",
      recipientCnpj: "string",
      invoice: "string",
      freightValue: "number",
      reconciled: "boolean",
    },
  },
  reconciliation: {
    path: "/reconciliations",
    fields: {
      date: "string",
      customerName: "string",
      cnpj: "string",
      tolerance: "number",
      cteCount: "number",
      itemCount: "number",
      totalValue: "number",
      calculatedFreight: "number",
      difference: "number",
      reconciledPercent: "number",
      status: "string",
    },
  },
  "reconciliation-cte": {
    path: "/reconciliation-ctes",
    fields: {
      reconciliationId: "number",
      cteId: "number",
      number: "string",
      series: "string",
      key: "string",
      dueDate: "string",
      customerName: "string",
      cteValue: "number",
      intermediationValue: "number",
      freightValue: "number",
      reconciled: "boolean",
    },
  },
  "billing-document": {
    path: "/billing-documents",
    fields: {
      type: "string",
      identifier: "string",
      competence: "string",
      value: "number",
      file: "string",
      status: "string",
      date: "string",
    },
  },
  notification: {
    path: "/notifications",
    fields: {
      identifier: "string",
      trackingCode: "string",
      number: "string",
      key: "string",
      issuedAt: "string",
      carrierService: "string",
      platform: "string",
      status: "string",
    },
  },
  "mongo-sync": {
    path: "/mongo-syncs",
    fields: {
      status: "string",
      requestedAt: "string",
      duration: "string",
      tables: "string",
      filters: "string",
    },
  },
  log: {
    path: "/logs",
    fields: {
      action: "string",
      table: "string",
      user: "string",
      dbUser: "string",
      date: "string",
      data: "string",
      changes: "string",
    },
  },
  user: {
    path: "/users",
    fields: {
      platform: "string",
      name: "string",
      email: "string",
      type: "string",
      active: "boolean",
    },
  },
  "user-group": {
    path: "/user-groups",
    fields: { userId: "number", description: "string", platform: "string" },
  },
  "user-profile": {
    path: "/user-profiles",
    fields: { userId: "number", description: "string", platform: "string" },
  },
  profile: {
    path: "/profiles",
    fields: { platform: "string", name: "string", active: "boolean" },
  },
  "profile-route": {
    path: "/profile-routes",
    fields: { profileId: "number", method: "string", route: "string" },
  },
};

const pascal = (kebab) =>
  kebab
    .split("-")
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join("");

const write = (file, content) => {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content);
};

const serviceTemplate = (domain, Domain, path, fieldLines) => `import { api } from "./api";

type ${Domain} = {
  id: number;
${fieldLines}
};

type ${Domain}FetchAllRequest = { filters?: Partial<${Domain}> };
type ${Domain}FetchAllResponse = ${Domain}[];
type ${Domain}FindByIdRequest = Pick<${Domain}, "id">;
type ${Domain}FindByIdResponse = ${Domain};
type ${Domain}CreateRequest = Omit<${Domain}, "id">;
type ${Domain}CreateResponse = ${Domain};
type ${Domain}UpdateRequest = Pick<${Domain}, "id"> & Partial<${Domain}>;
type ${Domain}UpdateResponse = ${Domain};
type ${Domain}RemoveRequest = Pick<${Domain}, "id">;

const ${Domain}Service = {
  fetchAll: async ({ filters }: ${Domain}FetchAllRequest = {}) => {
    const res = await api.get<${Domain}FetchAllResponse>("${path}", {
      params: filters,
    });
    return res.data;
  },
  findById: async ({ id }: ${Domain}FindByIdRequest) => {
    const res = await api.get<${Domain}FindByIdResponse>(
      "${path}/:id".replace(":id", String(id)),
    );
    return res.data;
  },
  create: async (request: ${Domain}CreateRequest) => {
    const res = await api.post<${Domain}CreateResponse>("${path}", request);
    return res.data;
  },
  update: async ({ id, ...changes }: ${Domain}UpdateRequest) => {
    const res = await api.put<${Domain}UpdateResponse>(
      "${path}/:id".replace(":id", String(id)),
      changes,
    );
    return res.data;
  },
  remove: async ({ id }: ${Domain}RemoveRequest) => {
    await api.delete("${path}/:id".replace(":id", String(id)));
  },
} as const;

export {
  type ${Domain},
  type ${Domain}CreateRequest,
  type ${Domain}CreateResponse,
  type ${Domain}FetchAllRequest,
  type ${Domain}FetchAllResponse,
  type ${Domain}FindByIdRequest,
  type ${Domain}FindByIdResponse,
  type ${Domain}RemoveRequest,
  ${Domain}Service,
  type ${Domain}UpdateRequest,
  type ${Domain}UpdateResponse,
};
`;

const queryTemplate = (domain, Domain) => `import { queryOptions } from "@tanstack/react-query";
import {
  type ${Domain}FetchAllRequest,
  type ${Domain}FindByIdRequest,
  ${Domain}Service,
} from "@/services/portal/v1/${domain}.service";

type ${Domain}FetchAllQueryDeps = ${Domain}FetchAllRequest;
type ${Domain}FindByIdQueryDeps = ${Domain}FindByIdRequest;

const ${Domain}QueryKeys = {
  all: () => ["${domain}"] as const,
  fetchAll: ({ filters }: ${Domain}FetchAllQueryDeps = {}) =>
    ["${domain}", "fetch-all", filters ?? {}] as const,
  findById: ({ id }: ${Domain}FindByIdQueryDeps) =>
    ["${domain}", "find-by-id", id] as const,
} as const;

const ${Domain}QueryOptions = {
  fetchAll: ({ filters }: ${Domain}FetchAllQueryDeps = {}) =>
    queryOptions({
      queryKey: ${Domain}QueryKeys.fetchAll({ filters }),
      queryFn: () => ${Domain}Service.fetchAll({ filters }),
    }),
  findById: ({ id }: ${Domain}FindByIdQueryDeps) =>
    queryOptions({
      queryKey: ${Domain}QueryKeys.findById({ id }),
      queryFn: () => ${Domain}Service.findById({ id }),
    }),
} as const;

export {
  type ${Domain}FetchAllQueryDeps,
  type ${Domain}FindByIdQueryDeps,
  ${Domain}QueryKeys,
  ${Domain}QueryOptions,
};
`;

const fetchAllHookTemplate = (domain, Domain) => `import { useQuery } from "@tanstack/react-query";
import {
  type ${Domain}FetchAllQueryDeps,
  ${Domain}QueryOptions,
} from "@/lib/query/${domain}.query";

function use${Domain}FetchAllQuery({ filters }: ${Domain}FetchAllQueryDeps = {}) {
  return useQuery(${Domain}QueryOptions.fetchAll({ filters }));
}

export { use${Domain}FetchAllQuery };
`;

const findByIdHookTemplate = (domain, Domain) => `import { useQuery } from "@tanstack/react-query";
import {
  type ${Domain}FindByIdQueryDeps,
  ${Domain}QueryOptions,
} from "@/lib/query/${domain}.query";

function use${Domain}FindByIdQuery({ id }: ${Domain}FindByIdQueryDeps) {
  return useQuery(${Domain}QueryOptions.findById({ id }));
}

export { use${Domain}FindByIdQuery };
`;

const mutationHookTemplate = (domain, Domain, operation, Operation) => `import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/client";
import { ${Domain}QueryKeys } from "@/lib/query/${domain}.query";
import {
  type ${Domain}${Operation}Request,
  ${Domain}Service,
} from "@/services/portal/v1/${domain}.service";

function use${Domain}${Operation}Mutation() {
  return useMutation({
    mutationFn: (request: ${Domain}${Operation}Request) =>
      ${Domain}Service.${operation}(request),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ${Domain}QueryKeys.all() }),
  });
}

export { use${Domain}${Operation}Mutation };
`;

for (const [domain, { path, fields }] of Object.entries(domains)) {
  const Domain = pascal(domain);
  const fieldLines = Object.entries(fields)
    .map(([name, type]) => `  ${name}: ${type};`)
    .join("\n");

  write(
    join(root, "services/portal/v1", `${domain}.service.ts`),
    serviceTemplate(domain, Domain, path, fieldLines),
  );
  write(
    join(root, "lib/query", `${domain}.query.ts`),
    queryTemplate(domain, Domain),
  );
  write(
    join(root, "hooks", `use-${domain}-fetch-all-query.ts`),
    fetchAllHookTemplate(domain, Domain),
  );
  write(
    join(root, "hooks", `use-${domain}-find-by-id-query.ts`),
    findByIdHookTemplate(domain, Domain),
  );
  for (const [operation, Operation] of [
    ["create", "Create"],
    ["update", "Update"],
    ["remove", "Remove"],
  ]) {
    write(
      join(root, "hooks", `use-${domain}-${operation}-mutation.ts`),
      mutationHookTemplate(domain, Domain, operation, Operation),
    );
  }
}

console.log(`${Object.keys(domains).length} domínios gerados.`);
