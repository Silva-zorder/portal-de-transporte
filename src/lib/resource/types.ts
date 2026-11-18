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
  | "badge"
  | "switch";

/**
 * `success` e `warning` não são variantes do Badge do Hubble: viram o Badge `secondary` com os
 * tokens `badge-bg-*` / `badge-text-*` do DS (ver `resource-badge.tsx`).
 */
type ResourceBadgeVariant =
  | "primary"
  | "secondary"
  | "destructive"
  | "outline"
  | "success"
  | "warning";

type ResourceColumn<TRecord> = {
  key: keyof TRecord & string;
  header: string;
  kind?: ResourceColumnKind;
  size?: number;
  sortable?: boolean;
  /** Vira um filtro de seleção quando a definição não declara `filters`. */
  filterable?: boolean;
  badgeVariants?: Record<string, ResourceBadgeVariant>;
  /** Texto exibido para cada valor (ex.: `{ true: "Parceira", false: "Não parceira" }`). */
  valueLabels?: Record<string, string>;
};

type ResourceFieldKind =
  | "text"
  | "select"
  | "multiselect"
  | "date"
  | "money"
  | "decimal"
  | "integer"
  | "switch"
  | "cep"
  | "cnpj"
  | "email"
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
  /** Título do bloco a que o campo pertence; campos seguidos com o mesmo título ficam agrupados. */
  group?: string;
  /** O campo só aparece (e só é validado) quando a condição vale para os valores atuais. */
  visibleWhen?: (values: Record<string, unknown>) => boolean;
};

/**
 * Onde o filtro aparece no cabeçalho da listagem:
 * - `search`: opção do seletor do campo de busca (pesquisa digitável);
 * - `select`, `date`, `month`: controles de seleção à direita (com mais de 5, os 3 primeiros ficam
 *   fora e o resto vai para o drawer "Filtrar");
 * - `input`: campo digitável à direita, fora do campo de busca.
 */
type ResourceFilterKind = "search" | "select" | "date" | "month" | "input";

type ResourceFilter<TRecord> = {
  key: keyof TRecord & string;
  label: string;
  kind: ResourceFilterKind;
  /** Chaves comparadas no lugar de `key` (ex.: CEP inicial e CEP final). */
  keys?: (keyof TRecord & string)[];
  /** Formato do valor nas opções e na comparação. */
  format?: ResourceColumnKind;
  valueLabels?: Record<string, string>;
};

type ResourceToolbarAction = "export" | "download-csv" | "import" | "refresh";

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
  /** Campos da edição, quando diferentes dos da criação. */
  editFields?: ResourceField<TRecord>[];
  defaults: Omit<TRecord, "id">;
  /** Hook que devolve o ajuste final dos valores antes de salvar (ex.: resolver o id de um vínculo escolhido por nome). */
  usePrepare?: () => (
    values: Record<string, unknown>,
  ) => Record<string, unknown>;
};

/** Ação exposta na célula "Ações" (botão secondary, sem ícone) que navega para outra tela. */
type ResourceRowLink<TRecord> = {
  key: string;
  label: string;
  to: (record: TRecord) => string;
};

type ResourceRowAction<TRecord> = {
  key: string;
  label: string;
  icon: Icon;
  run: (record: TRecord) => void;
  /** Mostra a ação como botão secondary na célula "Ações", fora do menu. */
  exposed?: boolean;
};

/** Visualização somente leitura de um registro, aberta pelo menu da linha. */
type ResourceView<TRecord> = {
  key: string;
  label: string;
  icon: Icon;
  kind: "drawer" | "dialog";
  title: (record: TRecord) => string;
  fields: ResourceField<TRecord>[];
};

/** Edição parcial de um registro com campos próprios (ex.: "Configuração de integração"). */
type ResourceActionForm<TRecord> = {
  key: string;
  label: string;
  icon: Icon;
  kind: "drawer" | "dialog";
  title: (record: TRecord) => string;
  fields: ResourceField<TRecord>[];
};

type ResourceDetail<TRecord> = {
  kind?: "drawer" | "dialog";
  title: (record: TRecord) => string;
  fields: ResourceField<TRecord>[];
};

type ResourcePageActionForm = {
  kind: "drawer" | "dialog";
  title: string;
  submitLabel: string;
  fields: ResourceField<ResourceRecord>[];
  defaults: Record<string, unknown>;
  /** Devolve a mensagem de sucesso. */
  submit: (values: Record<string, unknown>) => string;
};

type ResourcePageActionSummary<TRecord> = {
  title: string;
  fields: ResourceField<ResourceRecord>[];
  compute: (records: readonly TRecord[]) => Record<string, unknown>;
};

/** Botão do cabeçalho da página (a ação principal é `primary`; as demais, secondary). */
type ResourcePageAction<TRecord> = {
  key: string;
  label: string;
  icon?: Icon;
  primary?: boolean;
  form?: ResourcePageActionForm;
  summary?: ResourcePageActionSummary<TRecord>;
  /** Recebe os registros marcados na coluna de seleção (vazio quando a listagem não é `selectable`). */
  run?: (selected: TRecord[]) => void;
  /** O botão só habilita com um ou mais registros marcados. */
  requiresSelection?: boolean;
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
  /** Filtros do cabeçalho. Sem eles, saem das `searchKeys`, das colunas `filterable` e do status. */
  filters?: ResourceFilter<TRecord>[];
  toolbar: ResourceToolbarAction[];
  statusSwitch?: boolean;
  /** Coluna de checkbox; a seleção alimenta as `pageActions` com `requiresSelection`. */
  selectable?: boolean;
  createLabel?: string;
  createIcon?: Icon;
  pageActions?: ResourcePageAction<TRecord>[];
  form?: ResourceForm<TRecord>;
  detail?: ResourceDetail<TRecord>;
  views?: ResourceView<TRecord>[];
  actionForms?: ResourceActionForm<TRecord>[];
  recordPath?: (record: TRecord) => string;
  rowLinks?: ResourceRowLink<TRecord>[];
  rowActions?: ResourceRowAction<TRecord>[];
  /** Mostra "Remover" como botão exposto na linha em vez de "Excluir" no menu. */
  exposeRemove?: boolean;
  /**
   * Ordem dos itens do menu da linha, por chave: as das `views`, `actionForms` e `rowActions`,
   * mais `record` (Visualizar a página do registro), `detail` e `edit`. "Excluir" fica sempre por último.
   */
  menuOrder?: string[];
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
  type ResourceActionForm,
  type ResourceBadgeVariant,
  type ResourceColumn,
  type ResourceColumnKind,
  type ResourceDefinition,
  type ResourceDetail,
  type ResourceField,
  type ResourceFieldKind,
  type ResourceFieldSpan,
  type ResourceFilter,
  type ResourceFilterKind,
  type ResourceForm,
  type ResourceHooks,
  type ResourcePageAction,
  type ResourcePageActionForm,
  type ResourcePageActionSummary,
  type ResourceRecord,
  type ResourceRowAction,
  type ResourceRowLink,
  type ResourceToolbarAction,
  type ResourceView,
};
