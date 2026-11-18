import { formatColumnValue, normalizeSearch } from "./format";
import type {
  AnyResourceDefinition,
  ResourceFilter,
  ResourceRecord,
} from "./types";

type AnyResourceFilter = ResourceFilter<ResourceRecord>;

/** Valor escolhido por filtro, pela `key` do filtro. Vazio = sem filtro. */
type ResourceFilterValues = Record<string, string>;

/** Acima disso, só os 3 primeiros filtros de seleção ficam no cabeçalho; o resto vai para o drawer. */
const MAX_HEADER_SELECTS = 5;
const HEADER_SELECTS_WHEN_OVERFLOWING = 3;

const SELECT_LIKE_KINDS = new Set(["select", "date", "month"]);

function resolveFilters(definition: AnyResourceDefinition): AnyResourceFilter[] {
  if (definition.filters) return definition.filters;
  const headerOf = (key: string) =>
    definition.columns.find((column) => column.key === key)?.header ?? key;
  return [
    ...definition.searchKeys.map((key) => ({
      key,
      label: headerOf(key),
      kind: "search" as const,
    })),
    ...(definition.statusSwitch
      ? [
          {
            key: "active",
            label: "Status",
            kind: "select" as const,
            valueLabels: {
              true: `Ativ${definition.article}s`,
              false: `Inativ${definition.article}s`,
            },
          },
        ]
      : []),
    ...definition.columns
      .filter((column) => column.filterable)
      .map((column) => ({
        key: column.key,
        label: column.header,
        kind: "select" as const,
        format: column.kind,
        valueLabels: column.valueLabels,
      })),
  ];
}

function splitFilters(filters: readonly AnyResourceFilter[]) {
  const search = filters.filter((filter) => filter.kind === "search");
  const inputs = filters.filter((filter) => filter.kind === "input");
  const selects = filters.filter((filter) => SELECT_LIKE_KINDS.has(filter.kind));
  const overflows = selects.length > MAX_HEADER_SELECTS;
  return {
    search,
    inputs,
    headerSelects: overflows
      ? selects.slice(0, HEADER_SELECTS_WHEN_OVERFLOWING)
      : selects,
    drawerSelects: overflows ? selects.slice(HEADER_SELECTS_WHEN_OVERFLOWING) : [],
  };
}

function filterOptions(
  filter: AnyResourceFilter,
  records: readonly ResourceRecord[],
) {
  return [...new Set(records.map((record) => String(record[filter.key])))]
    .sort((one, other) => one.localeCompare(other, "pt-BR", { numeric: true }))
    .map((value) => ({
      value,
      label: formatColumnValue(
        value === "true" ? true : value === "false" ? false : value,
        filter.format,
        filter.valueLabels,
      ),
    }));
}

function containsTerm(
  record: ResourceRecord,
  filter: AnyResourceFilter,
  term: string,
) {
  const normalizedTerm = normalizeSearch(term).trim();
  if (!normalizedTerm) return true;
  const digits = normalizedTerm.replace(/\D/g, "");
  const onlyDigits = digits.length > 0 && /^[\d\s.\-/]+$/.test(normalizedTerm);
  return (filter.keys ?? [filter.key]).some((key) => {
    const value = record[key];
    const formatted = formatColumnValue(value, filter.format, filter.valueLabels);
    if (onlyDigits && String(value ?? "").replace(/\D/g, "").includes(digits)) {
      return true;
    }
    return (
      normalizeSearch(value).includes(normalizedTerm) ||
      normalizeSearch(formatted).includes(normalizedTerm)
    );
  });
}

function matchesFilter(
  record: ResourceRecord,
  filter: AnyResourceFilter,
  value: string,
) {
  if (!value) return true;
  if (filter.kind === "search" || filter.kind === "input") {
    return containsTerm(record, filter, value);
  }
  if (filter.kind === "date") {
    // Datas com horário ("26/03/2026 09h30m12s") também casam com o dia escolhido.
    return String(record[filter.key] ?? "").startsWith(value);
  }
  return String(record[filter.key]) === value;
}

/** Busca do campo composto: `field` vazio procura em todos os filtros de pesquisa. */
function matchesSearchField(
  record: ResourceRecord,
  searchFilters: readonly AnyResourceFilter[],
  field: string,
  term: string,
) {
  if (!term.trim()) return true;
  const targets = field
    ? searchFilters.filter((filter) => filter.key === field)
    : searchFilters;
  return targets.some((filter) => containsTerm(record, filter, term));
}

export {
  type AnyResourceFilter,
  filterOptions,
  matchesFilter,
  matchesSearchField,
  type ResourceFilterValues,
  resolveFilters,
  splitFilters,
};
