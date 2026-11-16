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
import { XIcon } from "@phosphor-icons/react";
import { type FormEvent, useState } from "react";
import type {
  AnyResourceDefinition,
  ResourceRecord,
} from "@/lib/resource/types";
import {
  findMissingFields,
  fromDraft,
  type ResourceDraft,
  ResourceFormFields,
  ResourceReadOnlyFields,
  toDraft,
} from "./resource-fields";

type ResourceFormState =
  | { mode: "closed" }
  | { mode: "create" }
  | { mode: "edit"; record: ResourceRecord }
  | { mode: "view"; record: ResourceRecord };

type ResourceFormController = {
  state: ResourceFormState;
  openCreate: () => void;
  openEdit: (record: ResourceRecord) => void;
  openView: (record: ResourceRecord) => void;
  close: () => void;
};

function useResourceFormController(): ResourceFormController {
  const [state, setState] = useState<ResourceFormState>({ mode: "closed" });
  return {
    state,
    openCreate: () => setState({ mode: "create" }),
    openEdit: (record) => setState({ mode: "edit", record }),
    openView: (record) => setState({ mode: "view", record }),
    close: () => setState({ mode: "closed" }),
  };
}

const useNoMutation = () => undefined;
const useNoPrepare = () => (values: Record<string, unknown>) => values;

function ResourceFormBody({
  definition,
  state,
  parentValues,
  onClose,
}: Readonly<{
  definition: AnyResourceDefinition;
  state: Exclude<ResourceFormState, { mode: "closed" | "view" }>;
  parentValues: Record<string, unknown>;
  onClose: () => void;
}>) {
  const form = definition.form;
  const fields = form?.fields ?? [];
  const createMutation = (definition.hooks.useCreate ?? useNoMutation)();
  const updateMutation = (definition.hooks.useUpdate ?? useNoMutation)();
  const prepare = (form?.usePrepare ?? useNoPrepare)();
  const [draft, setDraft] = useState<ResourceDraft>(() =>
    toDraft(
      state.mode === "edit"
        ? state.record
        : { ...form?.defaults, ...parentValues },
      fields,
    ),
  );
  const [invalidFields, setInvalidFields] = useState<string[]>([]);
  const context = `${definition.key}-form`;
  const isDrawer = form?.kind === "drawer";
  const isSaving = Boolean(createMutation?.isPending || updateMutation?.isPending);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const missing = findMissingFields(draft, fields);
    setInvalidFields(missing);
    if (missing.length > 0) {
      toast.error("Preencha os campos obrigatórios.");
      return;
    }

    const values = prepare(fromDraft(draft, fields));
    try {
      if (state.mode === "edit") {
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

  const submitLabel = isDrawer && state.mode === "edit" ? "Salvar alterações" : "Salvar";

  return (
    <form
      className="flex min-h-0 flex-1 flex-col"
      onSubmit={handleSubmit}
      noValidate
      data-testid={context}
    >
      <ResourceFormFields
        className={isDrawer ? "flex-1 content-start overflow-auto p-md" : "py-md"}
        fields={fields}
        draft={draft}
        onDraftChange={setDraft}
        invalidFields={invalidFields}
        context={context}
      />
      {isDrawer ? (
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline" data-testid={`${context}-cancel-button`}>
              Cancelar
            </Button>
          </DrawerClose>
          <Button
            type="submit"
            disabled={isSaving}
            data-testid={`${context}-submit-button`}
          >
            {submitLabel}
          </Button>
        </DrawerFooter>
      ) : (
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" data-testid={`${context}-cancel-button`}>
              Cancelar
            </Button>
          </DialogClose>
          <Button
            type="submit"
            disabled={isSaving}
            data-testid={`${context}-submit-button`}
          >
            {submitLabel}
          </Button>
        </DialogFooter>
      )}
    </form>
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
  const isFormOpen = state.mode === "create" || state.mode === "edit";
  const handleOpenChange = (open: boolean) => {
    if (!open) close();
  };

  if (!form) return null;

  const title =
    state.mode === "edit" ? form.editTitle(state.record) : form.createTitle;

  if (form.kind === "drawer") {
    return (
      <Drawer
        direction="right"
        open={isFormOpen}
        onOpenChange={handleOpenChange}
      >
        <DrawerContent data-testid={`${definition.key}-form-drawer`}>
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerClose asChild>
              <IconButton
                variant="ghost"
                size="small"
                data-testid={`${definition.key}-form-close-button`}
              >
                <XIcon />
                <span className="sr-only">Fechar</span>
              </IconButton>
            </DrawerClose>
          </DrawerHeader>
          {isFormOpen && (
            <ResourceFormBody
              definition={definition}
              state={state}
              parentValues={parentValues}
              onClose={close}
            />
          )}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isFormOpen} onOpenChange={handleOpenChange}>
      <DialogContent data-testid={`${definition.key}-form-dialog`}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogCloseButton
            data-testid={`${definition.key}-form-close-button`}
          />
        </DialogHeader>
        {isFormOpen && (
          <ResourceFormBody
            definition={definition}
            state={state}
            parentValues={parentValues}
            onClose={close}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function ResourceDetailDialog({
  definition,
  controller,
}: Readonly<{
  definition: AnyResourceDefinition;
  controller: ResourceFormController;
}>) {
  const { state, close } = controller;
  const detail = definition.detail;
  if (!detail) return null;

  return (
    <Dialog
      open={state.mode === "view"}
      onOpenChange={(open) => {
        if (!open) close();
      }}
    >
      <DialogContent data-testid={`${definition.key}-detail-dialog`}>
        <DialogHeader>
          <DialogTitle>
            {state.mode === "view" ? detail.title(state.record) : ""}
          </DialogTitle>
          <DialogCloseButton
            data-testid={`${definition.key}-detail-close-button`}
          />
        </DialogHeader>
        {state.mode === "view" && (
          <ResourceReadOnlyFields
            className="py-md"
            fields={detail.fields}
            record={state.record}
            context={`${definition.key}-detail`}
          />
        )}
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="outline"
              data-testid={`${definition.key}-detail-dismiss-button`}
            >
              Fechar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export {
  capitalize,
  ResourceDetailDialog,
  type ResourceFormController,
  ResourceFormOverlay,
  type ResourceFormState,
  useResourceFormController,
};
