// Gera os enums de `src/lib/enum` no formato do AGENTS.md do Hubble (objeto `as const`,
// Caption, Options, Key e Value). O valor é o texto que a API legada devolve.
// Uso: node scripts/generate-enums.mjs
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const dir = join(import.meta.dirname, "..", "src", "lib", "enum");

const enums = {
  platform: { MAGAZORD: "MZ", TRAY: "Tray", NUVEMSHOP: "Nuvemshop" },
  "shared-platform": { MAGAZORD: "Magazord", MZ_TRAY: "MZ, Tray", MZ: "MZ" },
  marketplace: {
    MERCADO_LIVRE: "Mercado Livre",
    SHOPEE: "Shopee",
    AMAZON: "Amazon",
    MAGALU: "Magalu",
  },
  "price-table-type": {
    PRICE: "Preço",
    TRANSFER: "Transferência",
    INTERMEDIATION: "Intermediação",
  },
  "fee-type": {
    TOLL: "2 - Pedágio",
    GRIS: "3 - Gris",
    ADVALOREM: "4 - Advalorem",
    ICMS: "8 - ICMS",
  },
  "calculation-base": {
    INVOICE_PERCENT: "1 - % da nota",
    FREIGHT_PERCENT: "2 - % do frete",
    FIXED_VALUE: "3 - Valor fixo",
  },
  "cte-status": {
    RECONCILED: "Conciliado",
    DIVERGENT: "Divergente",
    PENDING: "Pendente",
  },
  "reconciliation-status": { IN_REVIEW: "Em análise", DONE: "Concluída" },
  "billing-document-type": { NFSE: "NFS-e", BOLETO: "Boleto" },
  "billing-document-status": {
    SENT: "Enviado",
    PAID: "Pago",
    PENDING: "Pendente",
  },
  "notification-status": { SENT: "Enviado", FAILED: "Falha" },
  "mongo-sync-status": {
    DONE: "Concluída",
    RUNNING: "Em andamento",
    FAILED: "Falhou",
  },
  "mongo-sync-table": {
    CLIENT_SERVICE: "VW_Client_Service",
    PRICE_TABLE: "VW_Price_Table",
  },
  "log-action": { CREATE: "Nova", UPDATE: "Alteração", REMOVE: "Exclusão" },
  "user-type": { COGNITO: "Cognito", MASTER: "Master" },
  "tariff-acronym": {
    AC_CAP: "AC-CAP",
    SC_CAP: "SC-CAP",
    SC_INT: "SC-INT",
    PR_CAP: "PR-CAP",
    PR_INT: "PR-INT",
    RS_CAP: "RS-CAP",
    RS_INT: "RS-INT",
    SP_CAP: "SP-CAP",
    SP_INT: "SP-INT",
    RJ_CAP: "RJ-CAP",
    RJ_INT: "RJ-INT",
  },
};

const pascal = (kebab) =>
  kebab
    .split("-")
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join("");

mkdirSync(dir, { recursive: true });

for (const [domain, entries] of Object.entries(enums)) {
  const Name = `Enum${pascal(domain)}`;
  const members = Object.entries(entries)
    .map(([key, value]) => `  ${key}: ${JSON.stringify(value)},`)
    .join("\n");
  const captions = Object.entries(entries)
    .map(([key, value]) => `  [${Name}.${key}]: ${JSON.stringify(value)},`)
    .join("\n");

  writeFileSync(
    join(dir, `${domain}.ts`),
    `const ${Name} = {
${members}
} as const;

const ${Name}Caption = {
${captions}
} as const satisfies Record<${Name}Value, string>;

const ${Name}Options = Object.values(${Name}).map((value) => ({
  value,
  caption: ${Name}Caption[value],
}));

type ${Name}Key = keyof typeof ${Name};
type ${Name}Value = (typeof ${Name})[${Name}Key];

export {
  ${Name},
  ${Name}Caption,
  type ${Name}Key,
  ${Name}Options,
  type ${Name}Value,
};
`,
  );
}

console.log(`${Object.keys(enums).length} enums gerados.`);
