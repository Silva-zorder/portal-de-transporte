import { maskMonetary } from "@hubble-ds/utils/monetary";
import type {
  ResourceColumnKind,
  ResourceFieldKind,
  ResourceRecord,
} from "./types";

const decimalFormatter = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 3,
  maximumFractionDigits: 3,
});

const integerFormatter = new Intl.NumberFormat("pt-BR");

function formatDecimal(value: number) {
  return decimalFormatter.format(value);
}

function formatInteger(value: number) {
  return integerFormatter.format(value);
}

function parseDecimal(input: string) {
  const parsed = Number(input.replace(/\./g, "").replace(",", "."));
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatStatus(active: unknown, article: "a" | "o" = "o") {
  return active ? `Ativ${article}` : `Inativ${article}`;
}

function formatColumnValue(
  value: unknown,
  kind: ResourceColumnKind = "text",
  valueLabels?: Record<string, string>,
) {
  if (valueLabels && String(value) in valueLabels) return valueLabels[String(value)];
  if (value === null || value === undefined || value === "") return "—";
  if (kind === "money") return maskMonetary(Number(value));
  if (kind === "decimal") return formatDecimal(Number(value));
  if (kind === "percent") return `${value}%`;
  if (kind === "status-text") return formatStatus(value);
  if (typeof value === "boolean") return value ? "Sim" : "Não";
  return String(value);
}

function formatFieldValue(
  value: unknown,
  kind: ResourceFieldKind = "text",
  suffix?: string,
) {
  if (kind === "switch") return value ? "Sim" : "Não";
  if (kind === "status") return formatStatus(value, "o");
  if (kind === "status-feminine") return formatStatus(value, "a");
  if (Array.isArray(value)) return value.length > 0 ? value.join(", ") : "—";
  if (value === null || value === undefined || value === "") return "—";
  if (kind === "money") return maskMonetary(Number(value));
  if (kind === "decimal") {
    return [formatDecimal(Number(value)), suffix].filter(Boolean).join(" ");
  }
  return [String(value), suffix].filter(Boolean).join(" ");
}

function normalizeSearch(value: unknown) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

function matchesSearch(
  record: ResourceRecord,
  keys: readonly string[],
  search: string,
) {
  const term = normalizeSearch(search).trim();
  if (!term) return true;
  return keys.some((key) => normalizeSearch(record[key]).includes(term));
}

function toCsv(
  records: readonly ResourceRecord[],
  columns: readonly { key: string; header: string }[],
) {
  const escape = (value: unknown) =>
    `"${String(value ?? "").replace(/"/g, '""')}"`;
  return [
    columns.map((column) => escape(column.header)).join(";"),
    ...records.map((record) =>
      columns.map((column) => escape(record[column.key])).join(";"),
    ),
  ].join("\r\n");
}

function downloadCsv(filename: string, content: string) {
  const url = URL.createObjectURL(
    new Blob([`﻿${content}`], { type: "text/csv;charset=utf-8" }),
  );
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function formatDate(date: Date) {
  return date.toLocaleDateString("pt-BR");
}

function formatMonth(date: Date) {
  return `${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
}

/** Lê `dd/mm/aaaa` (o formato dos dados do portal). */
function parseDate(value: unknown) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(String(value ?? ""));
  if (!match) return undefined;
  return new Date(Number(match[3]), Number(match[2]) - 1, Number(match[1]));
}

export {
  downloadCsv,
  formatColumnValue,
  formatDate,
  formatDecimal,
  formatFieldValue,
  formatInteger,
  formatMonth,
  formatStatus,
  matchesSearch,
  normalizeSearch,
  parseDate,
  parseDecimal,
  toCsv,
};
