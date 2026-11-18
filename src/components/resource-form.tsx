import { Button } from "@hubble-ds/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogCloseButton,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@hubble-ds/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@hubble-ds/components/ui/drawer";
import { IconButton } from "@hubble-ds/components/ui/icon-button";
import { toast } from "@hubble-ds/components/ui/toast";
import { EyeIcon, XIcon } from "@phosphor-icons/react";
import type { OnChangeFn, RowSelectionState } from "@tanstack/react-table";
import { type FormEvent, type ReactNode, useState } from "react";
import type {
  AnyResourceDefinition,
  ResourceField,
  ResourcePageAction,
  ResourceRecord,
  ResourceView,
} from "@/lib/resource/types";
import {
  findMissingFields,
  fromDraft,
  type ResourceDraft,
  ResourceFormFields,
  ResourceReadOnlyFields,
  toDraft,
} from "./resource-fields";

type OverlayKind = "drawer" | "dialog";
type AnyResourceField = ResourceField<ResourceRecord>;

type ResourceFormState =
  | { mode: "closed" }
  | { mode: "create" }
  | { mode: "edit"; record: ResourceRecord }
  | { mode: "view"; record: ResourceRecord; viewKey: string }
  | { mode: "action"; record: ResourceRecord; formKey: string };

type ResourceFormController = {
  state: ResourceFormState;
  openCreate: () => void;
  openEdit: (record: ResourceRecord) => void;
  openView: (record: ResourceRecord, viewKey?: string) => void;
  openActionForm: (record: ResourceRecord, formKey: string) => void;
  close: () => void;
  /** Linhas marcadas na coluna de seleção, por id. */
  selection: RowSelectionState;
  setSelection: OnChangeFn<RowSelectionState>;
};

const DETAIL_VIEW_KEY = "detail";

function useResourceFormController(): ResourceFormController {
  const [state, setState] = useState<ResourceFormState>({ mode: "closed" });
  const [selection, setSelection] = useState<RowSelectionState>({});
  return {
    state,
    selection,
    setSelection,
    openCreate: () => setState({ mode: "create" }),
    openEdit: (record) => setState({ mode: "edit", record }),
    openView: (record, viewKey = DETAIL_VIEW_KEY) =>
      setState({ mode: "view", record, viewKey }),
    openActionForm: (record, formKey) =>
      setState({ mode: "action", record, formKey }),
    close: () => setState({ mode: "closed" }),
  };
}

/** `detail` (o "Visualizar" padrão) seguido das `views` extras da definição. */
function resolveViews(definition: AnyResourceDefinition): ResourceView<ResourceRecord>[] {
  return [
    ...(definition.detail
      ? [
          {
            key: DETAIL_VIEW_KEY,
            label: "Visualizar",
            icon: EyeIcon,
            kind: definition.detail.kind ?? "dialog",
            title: definition.detail.title,
            fields: definition.detail.fields,
          },
        ]
      : []),
    ...(definition.views ?? []),
  ];
}

const useNoMutation = () => undefined;
const useNoPrepare = () => (values: Record<string, unknown>) => values;

/** Drawer à direita ou dialog, com título e botão de fechar. */
function ResourceOverlay({
  kind,
  open,
  onClose,
  title,
  context,
  children,
}: Readonly<{
  kind: OverlayKind;
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  context: string;
  children: ReactNode;
}>) {
  const handleOpenChange = (next: boolean) => {
    if (!next) onClose();
  };

  if (kind === "drawer") {
    return (
      <Drawer direction="right" open={open} onOpenChange={handleOpenChange}>
        <DrawerContent data-testid={`${context}-drawer`}>
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerClose asChild>
              <IconButton
                variant="ghost"
                size="small"
                data-testid={`${context}-close-button`}
              >
                <XIcon />
                <span className="sr-only">Fechar</span>
              </IconButton>
            </DrawerClose>
          </DrawerHeader>
          {children}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent data-testid={`${context}-dialog`}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogCloseButton data-testid={`${context}-close-button`} />
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}

function ResourceOverlayFooter({
  kind,
  children,
}: Readonly<{ kind: OverlayKind; children: ReactNode }>) {
  return kind === "drawer" ? (
    <DrawerFooter>{children}</DrawerFooter>
  ) : (
    <DialogFooter>{children}</DialogFooter>
  );
}

function ResourceOverlayDismiss({
  kind,
  children,
}: Readonly<{ kind: OverlayKind; children: ReactNode }>) {
  return kind === "drawer" ? (
    <DrawerClose asChild>{children}</DrawerClose>
  ) : (
    <DialogClose asChild>{children}</DialogClose>
  );
}

/** Formulário genérico: rascunho, validação dos obrigatórios visíveis e rodapé Cancelar/Salvar. */
function ResourceFieldsForm({
  kind,
  context,
  fields,
  initialValues,
  submitLabel,
  isSaving = false,
  onSubmit,
}: Readonly<{
  kind: OverlayKind;
  context: string;
  fields: readonly AnyResourceField[];
  initialValues: Record<string, unknown>;
  submitLabel: string;
  isSaving?: boolean;
  onSubmit: (values: Record<string, unknown>) => Promise<void> | void;
}>) {
  const [draft, setDraft] = useState<ResourceDraft>(() =>
    toDraft(initialValues, fields),
  );
  const [invalidFields, setInvalidFields] = useState<string[]>([]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const missing = findMissingFields(draft, fields);
    setInvalidFields(missing);
    if (missing.length > 0) {
      toast.error("Preencha os campos obrigatórios.");
      return;
    }
    await onSubmit(fromDraft(draft, fields));
  };

  return (
    <form
      className="flex min-h-0 flex-1 flex-col"
      onSubmit={handleSubmit}
      noValidate
      data-testid={context}
    >
      <ResourceFormFields
        className={kind === "drawer" ? "flex-1 content-start overflow-auto p-md" : "py-md"}
        fields={fields}
        draft={draft}
        onDraftChange={setDraft}
        invalidFields={invalidFields}
        context={context}
      />
      <ResourceOverlayFooter kind={kind}>
        <ResourceOverlayDismiss kind={kind}>
          <Button variant="outline" data-testid={`${context}-cancel-button`}>
            Cancelar
          </Button>
        </ResourceOverlayDismiss>
        <Button
          type="submit"
          disabled={isSaving}
          data-testid={`${context}-submit-button`}
        >
          {submitLabel}
        </Button>
      </ResourceOverlayFooter>
    </form>
  );
}

function ResourceRecordForm({
  definition,
  state,
  parentValues,
  onClose,
}: Readonly<{
  definition: AnyResourceDefinition;
  state: Extract<ResourceFormState, { mode: "create" | "edit" }>;
  parentValues: Record<string, unknown>;
  onClose: () => void;
}>) {
  const form = definition.form;
  const createMutation = (definition.hooks.useCreate ?? useNoMutation)();
  const updateMutation = (definition.hooks.useUpdate ?? useNoMutation)();
  const prepare = (form?.usePrepare ?? useNoPrepare)();
  if (!form) return null;

  const isEdit = state.mode === "edit";
  const fields = (isEdit && form.editFields) || form.fields;

  const handleSubmit = async (draftValues: Record<string, unknown>) => {
    const values = prepare(draftValues);
    try {
      if (isEdit) {
        await updateMutation?.mutateAsync({ ...values, id: state.record.id });
        toast.success(`${capitalize(definition.noun)} atualizad${definition.article}.`);
      } else {
        await createMutation?.mutateAsync(values);
        toast.success(`${capitalize(definition.noun)} criad${definition.article}.`);
      }
      onClose();
    } catch {
      toast.error("Não foi possível salvar. Tente novamente.");
    }
  };

  return (
    <ResourceFieldsForm
      kind={form.kind}
      context={`${definition.key}-form`}
      fields={fields}
      initialValues={isEdit ? state.record : { ...form.defaults, ...parentValues }}
      submitLabel={form.kind === "drawer" && isEdit ? "Salvar alterações" : "Salvar"}
      isSaving={Boolean(createMutation?.isPending || updateMutation?.isPending)}
      onSubmit={handleSubmit}
    />
  );
}

function ResourceFormOverlay({
  definition,
  controller,
  parentValues = {},
}: Readonly<{
  definition: AnyResourceDefinition;
  controller: ResourceFormController;
  parentValues?: Record<string, unknown>;
}>) {
  const { state, close } = controller;
  const form = definition.form;
  if (!form) return null;

  const isFormOpen = state.mode === "create" || state.mode === "edit";
  return (
    <ResourceOverlay
      kind={form.kind}
      open={isFormOpen}
      onClose={close}
      title={state.mode === "edit" ? form.editTitle(state.record) : form.createTitle}
      context={`${definition.key}-form`}
    >
      {isFormOpen && (
        <ResourceRecordForm
          definition={definition}
          state={state}
          parentValues={parentValues}
          onClose={close}
        />
      )}
    </ResourceOverlay>
  );
}

/** Todas as visualizações somente leitura da definição ("Visualizar" e as extras). */
function ResourceViewOverlays({
  definition,
  controller,
}: Readonly<{
  definition: AnyResourceDefinition;
  controller: ResourceFormController;
}>) {
  const { state, close } = controller;
  return resolveViews(definition).map((view) => {
    const isOpen = state.mode === "view" && state.viewKey === view.key;
    const context = `${definition.key}-${view.key}-view`;
    return (
      <ResourceOverlay
        key={view.key}
        kind={view.kind}
        open={isOpen}
        onClose={close}
        title={isOpen ? view.title(state.record) : ""}
        context={context}
      >
        {isOpen && (
          <ResourceReadOnlyFields
            className={view.kind === "drawer" ? "flex-1 content-start overflow-auto p-md" : "py-md"}
            fields={view.fields}
            record={state.record}
            context={context}
          />
        )}
        <ResourceOverlayFooter kind={view.kind}>
          <ResourceOverlayDismiss kind={view.kind}>
            <Button variant="outline" data-testid={`${context}-dismiss-button`}>
              Fechar
            </Button>
          </ResourceOverlayDismiss>
        </ResourceOverlayFooter>
      </ResourceOverlay>
    );
  });
}

/** Formulários de ação da linha (edição parcial com campos próprios). */
function ResourceActionFormOverlays({
  definition,
  controller,
}: Readonly<{
  definition: AnyResourceDefinition;
  controller: ResourceFormController;
}>) {
  const { state, close } = controller;
  const updateMutation = (definition.hooks.useUpdate ?? useNoMutation)();

  return (definition.actionForms ?? []).map((actionForm) => {
    const isOpen = state.mode === "action" && state.formKey === actionForm.key;
    const context = `${definition.key}-${actionForm.key}-form`;
    return (
      <ResourceOverlay
        key={actionForm.key}
        kind={actionForm.kind}
        open={isOpen}
        onClose={close}
        title={isOpen ? actionForm.title(state.record) : ""}
        context={context}
      >
        {isOpen && (
          <ResourceFieldsForm
            kind={actionForm.kind}
            context={context}
            fields={actionForm.fields}
            initialValues={state.record}
            submitLabel="Salvar alterações"
            isSaving={Boolean(updateMutation?.isPending)}
            onSubmit={async (values) => {
              try {
                await updateMutation?.mutateAsync({ ...values, id: state.record.id });
                toast.success(`${actionForm.label} salva.`);
                close();
              } catch {
                toast.error("Não foi possível salvar. Tente novamente.");
              }
            }}
          />
        )}
      </ResourceOverlay>
    );
  });
}

/** Botões de ação do cabeçalho da página e os overlays que eles abrem. */
function ResourcePageActions({
  definition,
  controller,
}: Readonly<{
  definition: AnyResourceDefinition;
  /** Fonte da seleção das ações com `requiresSelection`. */
  controller?: ResourceFormController;
}>) {
  const [openKey, setOpenKey] = useState<string>();
  const actions = definition.pageActions ?? [];
  const close = () => setOpenKey(undefined);
  const context = `${definition.key}-page`;
  const records = definition.hooks.useFetchAll().data;
  const selection = controller?.selection ?? {};
  const selectedRecords = (records ?? []).filter((record) => selection[String(record.id)]);

  const handleClick = (action: ResourcePageAction<ResourceRecord>) => {
    if (action.form || action.summary) {
      setOpenKey(action.key);
      return;
    }
    action.run?.(selectedRecords);
    if (action.requiresSelection) controller?.setSelection({});
  };

  return (
    <>
      {[...actions]
        .sort((one, other) => Number(Boolean(one.primary)) - Number(Boolean(other.primary)))
        .map((action) => (
          <Button
            key={action.key}
            variant={action.primary ? "primary" : "secondary"}
            disabled={action.requiresSelection && selectedRecords.length === 0}
            onClick={() => handleClick(action)}
            data-testid={`${context}-${action.key}-button`}
          >
            {action.icon && <action.icon />}
            {action.label}
          </Button>
        ))}
      {actions.map((action) => {
        const isOpen = openKey === action.key;
        const actionContext = `${context}-${action.key}`;
        if (action.form) {
          const form = action.form;
          return (
            <ResourceOverlay
              key={action.key}
              kind={form.kind}
              open={isOpen}
              onClose={close}
              title={form.title}
              context={actionContext}
            >
              {isOpen && (
                <ResourceFieldsForm
                  kind={form.kind}
                  context={`${actionContext}-form`}
                  fields={form.fields}
                  initialValues={form.defaults}
                  submitLabel={form.submitLabel}
                  onSubmit={(values) => {
                    toast.success(form.submit(values));
                    close();
                  }}
                />
              )}
            </ResourceOverlay>
          );
        }
        if (action.summary) {
          return (
            <ResourcePageSummary
              key={action.key}
              definition={definition}
              summary={action.summary}
              open={isOpen}
              onClose={close}
              context={actionContext}
            />
          );
        }
        return null;
      })}
    </>
  );
}

function ResourcePageSummary({
  definition,
  summary,
  open,
  onClose,
  context,
}: Readonly<{
  definition: AnyResourceDefinition;
  summary: NonNullable<ResourcePageAction<ResourceRecord>["summary"]>;
  open: boolean;
  onClose: () => void;
  context: string;
}>) {
  const records = definition.hooks.useFetchAll().data ?? [];
  return (
    <ResourceOverlay
      kind="dialog"
      open={open}
      onClose={onClose}
      title={summary.title}
      context={context}
    >
      {open && (
        <ResourceReadOnlyFields
          className="py-md"
          fields={summary.fields}
          record={summary.compute(records)}
          context={context}
        />
      )}
      <ResourceOverlayFooter kind="dialog">
        <ResourceOverlayDismiss kind="dialog">
          <Button variant="outline" data-testid={`${context}-dismiss-button`}>
            Fechar
          </Button>
        </ResourceOverlayDismiss>
      </ResourceOverlayFooter>
    </ResourceOverlay>
  );
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export {
  capitalize,
  DETAIL_VIEW_KEY,
  ResourceActionFormOverlays,
  type ResourceFormController,
  ResourceFormOverlay,
  type ResourceFormState,
  ResourcePageActions,
  ResourceViewOverlays,
  resolveViews,
  useResourceFormController,
};
