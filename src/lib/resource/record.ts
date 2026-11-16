import type { Icon } from "@phosphor-icons/react";
import type { UseQueryResult } from "@tanstack/react-query";
import type {
  AnyResourceDefinition,
  ResourceField,
  ResourceRecord,
} from "./types";

type RecordCard<TRecord> = {
  key: string;
  title: string;
  description: string;
  span: "full" | "half";
  fields: ResourceField<TRecord>[];
};

type RecordTab = {
  /** Segmento da URL e contexto dos `data-testid` (ex.: `cargas`). */
  key: string;
  label: string;
  definition: AnyResourceDefinition;
  parentKey: string;
  /** Valores do registro pai copiados para o filho na criação, além do vínculo por `parentKey`. */
  parentValues?: (parent: ResourceRecord) => Record<string, unknown>;
  summary: (count: number) => string;
  linkLabel: string;
};

type RecordAction<TRecord> = {
  key: string;
  label: string;
  icon: Icon;
  run: (record: TRecord) => void;
};

type RecordDefinition<TRecord> = {
  definition: AnyResourceDefinition;
  listPath: string;
  useFindById: (deps: { id: number }) => UseQueryResult<TRecord>;
  title: (record: TRecord) => string;
  /** Rótulo da aba de trabalho; o padrão é `<título da listagem> · <título do registro>`. */
  workTabTitle?: (record: TRecord) => string;
  status: (record: TRecord) => string;
  editLabel: string;
  /** Substitui "Editar" como ação principal do registro (ex.: "Recalcular fatura"). */
  primaryAction?: RecordAction<TRecord>;
  cards: RecordCard<TRecord>[];
  tabs: RecordTab[];
};

type AnyRecordDefinition = RecordDefinition<ResourceRecord>;

function defineRecord<TRecord extends { id: number }>(
  definition: RecordDefinition<TRecord>,
) {
  return definition as unknown as AnyRecordDefinition;
}

export {
  type AnyRecordDefinition,
  defineRecord,
  type RecordAction,
  type RecordCard,
  type RecordDefinition,
  type RecordTab,
};
