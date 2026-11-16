import type { Icon } from "@phosphor-icons/react";
import type {
  UseMutationResult,
  UseQueryResult,
} from "@tanstack/react-query";

type ResourceRecord = { id: number } & Record<string, unknown>;

type ResourceColumnKind =
  | "text"
  | "money"
  | "decimal"
  | "percent"
  | "status-text"
  | "badge";

type ResourceBadgeVariant = "primary" | "secondary" | "destructive" | "outline";

type ResourceColumn<TRecord> = {
  key: keyof TRecord & string;
  header: string;
  kind?: ResourceColumnKind;
  size?: number;
  sortable?: boolean;
  filterable?: boolean;
  badgeVariants?: Record<string, ResourceBadgeVariant>;
};

type ResourceFieldKind =
  | "text"
  | "select"
  | "money"
  | "decimal"
  | "integer"
  | "switch"
  | "cep"
  | "cnpj"
  | "code"
  | "status"
  | "status-feminine";

type ResourceFieldSpan = "full" | "half" | "third";

type ResourceField<TRecord> = {
  name: keyof TRecord & string;
  label: string;
  kind?: ResourceFieldKind;
  span?: ResourceFieldSpan;
  required?: boolean;
  /** Campo exibido mas nunca editável (ex.: tabela pai de uma carga). */
  locked?: boolean;
  suffix?: string;
  placeholder?: string;
  options?: readonly string[];
  useOptions?: () => readonly string[];
};

type ResourceToolbarAction =
  | "export"
  | "download-csv"
  | "import"
  | "refresh"
  | "filter";

type ResourceHooks<TRecord> = {
  useFetchAll: (deps?: {
    filters?: Partial<TRecord>;
  }) => UseQueryResult<TRecord[]>;
  useCreate?: () => UseMutationResult<TRecord, Error, Omit<TRecord, "id">>;
  useUpdate?: () => UseMutationResult<
    TRecord,
    Error,
    Pick<ResourceRecord, "id"> & Partial<TRecord>
  >;
  useRemove?: () => UseMutationResult<
    void,
    Error,
    Pick<ResourceRecord, "id">
  >;
};

type ResourceForm<TRecord> = {
  kind: "drawer" | "dialog";
  createTitle: string;
  editTitle: (record: TRecord) => string;
  fields: ResourceField<TRecord>[];
  defaults: Omit<TRecord, "id">;
  /** Hook que devolve o ajuste final dos valores antes de salvar (ex.: resolver o id de um vínculo escolhido por nome). */
  usePrepare?: () => (
    values: Record<string, unknown>,
  ) => Record<string, unknown>;
};

type ResourceRowLink<TRecord> = {
  key: string;
  label: string;
  icon: Icon;
  to: (record: TRecord) => string;
};

type ResourceRowAction<TRecord> = {
  key: string;
  label: string;
  icon: Icon;
  run: (record: TRecord) => void;
};

type ResourceDetail<TRecord> = {
  title: (record: TRecord) => string;
  fields: ResourceField<TRecord>[];
};

type ResourceDefinition<TRecord> = {
  /** Contexto dos `data-testid`, em inglês e kebab-case (ex.: `carriers`). */
  key: string;
  title: string;
  /** Substantivo usado nas mensagens ("transportadora"), com o artigo correspondente. */
  noun: string;
  article: "a" | "o";
  describe: (record: TRecord) => string;
  hooks: ResourceHooks<TRecord>;
  columns: ResourceColumn<TRecord>[];
  searchKeys: (keyof TRecord & string)[];
  searchPlaceholder: string;
  toolbar: ResourceToolbarAction[];
  statusSwitch?: boolean;
  selectable?: boolean;
  createLabel?: string;
  createIcon?: Icon;
  form?: ResourceForm<TRecord>;
  detail?: ResourceDetail<TRecord>;
  recordPath?: (record: TRecord) => string;
  rowLinks?: ResourceRowLink<TRecord>[];
  rowActions?: ResourceRowAction<TRecord>[];
};

type AnyResourceDefinition = ResourceDefinition<ResourceRecord>;

/**
 * Os componentes genéricos trabalham com `ResourceRecord`; a definição é escrita com o tipo
 * do domínio para checar colunas e campos, e só aqui perde o tipo específico.
 */
function defineResource<TRecord extends { id: number }>(
  definition: ResourceDefinition<TRecord>,
) {
  return definition as unknown as AnyResourceDefinition;
}

export {
  type AnyResourceDefinition,
  defineResource,
  type ResourceBadgeVariant,
  type ResourceColumn,
  type ResourceColumnKind,
  type ResourceDefinition,
  type ResourceDetail,
  type ResourceField,
  type ResourceFieldKind,
  type ResourceFieldSpan,
  type ResourceForm,
  type ResourceHooks,
  type ResourceRecord,
  type ResourceRowAction,
  type ResourceRowLink,
  type ResourceToolbarAction,
};
