import { Button } from "@hubble-ds/components/ui/button";
import { Calendar } from "@hubble-ds/components/ui/calendar";
import {
  Combobox,
  ComboboxAnchor,
  ComboboxBadgeItem,
  ComboboxBadgeList,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxTrigger,
} from "@hubble-ds/components/ui/combobox";
import {
  Field,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@hubble-ds/components/ui/field";
import { Input } from "@hubble-ds/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@hubble-ds/components/ui/input-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@hubble-ds/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@hubble-ds/components/ui/select";
import { Switch } from "@hubble-ds/components/ui/switch";
import { Textarea } from "@hubble-ds/components/ui/textarea";
import { maskCep } from "@hubble-ds/utils/cep";
import { maskCnpj } from "@hubble-ds/utils/cnpj";
import { maskMonetary, unmaskMonetaryInput } from "@hubble-ds/utils/monetary";
import { CalendarBlankIcon } from "@phosphor-icons/react";
import { cn } from "cn";
import { ptBR } from "date-fns/locale";
import { type ComponentProps, type ReactNode, useState } from "react";
import {
  formatDate,
  formatDecimal,
  formatFieldValue,
  parseDate,
  parseDecimal,
} from "@/lib/resource/format";
import type {
  ResourceField,
  ResourceFieldSpan,
  ResourceRecord,
} from "@/lib/resource/types";

type ResourceDraft = Record<string, unknown>;
type AnyResourceField = ResourceField<ResourceRecord>;

const fieldSpanClassNames: Record<ResourceFieldSpan, string> = {
  full: "col-span-6",
  half: "col-span-3",
  third: "col-span-2",
};

const NO_OPTIONS: readonly string[] = [];

function isFieldVisible(field: AnyResourceField, values: Record<string, unknown>) {
  return field.visibleWhen?.(values) ?? true;
}

function toDraft(
  values: Record<string, unknown>,
  fields: readonly AnyResourceField[],
) {
  const draft: ResourceDraft = { ...values };
  for (const field of fields) {
    const value = values[field.name];
    if (field.kind === "decimal") draft[field.name] = formatDecimal(Number(value ?? 0));
    if (field.kind === "integer") draft[field.name] = String(value ?? "");
    if (field.kind === "multiselect") draft[field.name] = Array.isArray(value) ? value : [];
  }
  return draft;
}

function fromDraft(
  draft: ResourceDraft,
  fields: readonly AnyResourceField[],
) {
  const values: Record<string, unknown> = { ...draft };
  for (const field of fields) {
    const value = draft[field.name];
    if (field.kind === "decimal") values[field.name] = parseDecimal(String(value ?? ""));
    if (field.kind === "integer") values[field.name] = Number(value) || 0;
  }
  return values;
}

function findMissingFields(
  draft: ResourceDraft,
  fields: readonly AnyResourceField[],
) {
  return fields
    .filter((field) => field.required && !field.locked)
    .filter((field) => isFieldVisible(field, draft))
    .filter((field) => {
      const value = draft[field.name];
      if (field.kind === "money") return value === undefined || value === null;
      if (field.kind === "multiselect") return !Array.isArray(value) || value.length === 0;
      return String(value ?? "").trim() === "";
    })
    .map((field) => field.name);
}

/** Agrupa campos seguidos com o mesmo `group`; campos sem grupo formam blocos sem título. */
function groupFields(fields: readonly AnyResourceField[]) {
  const groups: { title?: string; fields: AnyResourceField[] }[] = [];
  for (const field of fields) {
    const last = groups.at(-1);
    if (last && last.title === field.group) last.fields.push(field);
    else groups.push({ title: field.group, fields: [field] });
  }
  return groups;
}

function ResourceFieldGrid({
  fields,
  className,
  renderField,
  ...props
}: Readonly<
  ComponentProps<"div"> & {
    fields: readonly AnyResourceField[];
    renderField: (field: AnyResourceField) => ReactNode;
  }
>) {
  return (
    <div className={cn("grid grid-cols-6 gap-md", className)} {...props}>
      {groupFields(fields).map((group, index) =>
        group.title ? (
          <FieldSet key={group.title} className="col-span-6">
            <FieldLegend>{group.title}</FieldLegend>
            <div className="grid grid-cols-6 gap-md">
              {group.fields.map(renderField)}
            </div>
          </FieldSet>
        ) : (
          // biome-ignore lint/suspicious/noArrayIndexKey: blocos sem título não têm outra identidade estável.
          <div key={index} className="contents">
            {group.fields.map(renderField)}
          </div>
        ),
      )}
    </div>
  );
}

function ResourceSelectControl({
  field,
  value,
  onValueChange,
  ...props
}: Readonly<
  Omit<ComponentProps<typeof SelectTrigger>, "value"> & {
    field: AnyResourceField;
    value: string;
    onValueChange: (value: string) => void;
  }
>) {
  const dynamicOptions = (field.useOptions ?? (() => NO_OPTIONS))();
  const options = [...new Set(field.options ?? dynamicOptions)];
  const knownOptions =
    value && !options.includes(value) ? [value, ...options] : options;

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full" {...props}>
        <SelectValue placeholder={field.placeholder ?? "Selecionar"} />
      </SelectTrigger>
      <SelectContent>
        {knownOptions.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function ResourceMultiSelectControl({
  field,
  value,
  onValueChange,
  "data-testid": testId,
}: Readonly<{
  field: AnyResourceField;
  value: readonly string[];
  onValueChange: (value: string[]) => void;
  "data-testid": string;
}>) {
  const dynamicOptions = (field.useOptions ?? (() => NO_OPTIONS))();
  const options = [...new Set(field.options ?? dynamicOptions)];

  return (
    <Combobox multiple value={[...value]} onValueChange={onValueChange}>
      <ComboboxAnchor data-testid={testId}>
        <ComboboxBadgeList>
          {value.map((option) => (
            <ComboboxBadgeItem key={option} value={option}>
              {option}
            </ComboboxBadgeItem>
          ))}
        </ComboboxBadgeList>
        <ComboboxInput placeholder={field.placeholder ?? "Selecionar"} />
        <ComboboxTrigger />
      </ComboboxAnchor>
      <ComboboxContent>
        <ComboboxEmpty>Nenhuma opção encontrada.</ComboboxEmpty>
        {options.map((option) => (
          <ComboboxItem key={option} value={option}>
            {option}
          </ComboboxItem>
        ))}
      </ComboboxContent>
    </Combobox>
  );
}

function ResourceDateControl({
  id,
  value,
  onValueChange,
  placeholder = "Selecionar data",
  ...props
}: Readonly<
  Omit<ComponentProps<typeof Button>, "value"> & {
    value: string;
    onValueChange: (value: string) => void;
    placeholder?: string;
  }
>) {
  const [open, setOpen] = useState(false);
  const selected = parseDate(value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          className="w-full justify-between font-normal"
          {...props}
        >
          {value || placeholder}
          <CalendarBlankIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          mode="single"
          selected={selected}
          defaultMonth={selected}
          onSelect={(date) => {
            onValueChange(date ? formatDate(date) : "");
            setOpen(false);
          }}
          locale={ptBR}
        />
      </PopoverContent>
    </Popover>
  );
}

function ResourceFieldControl({
  field,
  value,
  onValueChange,
  invalid,
  id,
  "data-testid": testId,
}: Readonly<{
  field: AnyResourceField;
  value: unknown;
  onValueChange: (value: unknown) => void;
  invalid: boolean;
  id: string;
  "data-testid": string;
}>) {
  const kind = field.kind ?? "text";

  if (kind === "select") {
    return (
      <ResourceSelectControl
        id={id}
        field={field}
        value={String(value ?? "")}
        onValueChange={onValueChange}
        disabled={field.locked}
        aria-invalid={invalid || undefined}
        data-testid={`${testId}-select`}
      />
    );
  }

  if (kind === "multiselect") {
    return (
      <ResourceMultiSelectControl
        field={field}
        value={Array.isArray(value) ? value : []}
        onValueChange={onValueChange}
        data-testid={`${testId}-combobox`}
      />
    );
  }

  if (kind === "date") {
    return (
      <ResourceDateControl
        id={id}
        value={String(value ?? "")}
        onValueChange={onValueChange}
        placeholder={field.placeholder}
        disabled={field.locked}
        aria-invalid={invalid || undefined}
        data-testid={`${testId}-button`}
      />
    );
  }

  if (kind === "switch") {
    return (
      <Switch
        id={id}
        checked={Boolean(value)}
        onCheckedChange={onValueChange}
        disabled={field.locked}
        data-testid={`${testId}-switch`}
      />
    );
  }

  const inputProps = {
    id,
    disabled: field.locked,
    placeholder: field.placeholder,
    "aria-invalid": invalid || undefined,
    "data-testid": `${testId}-input`,
  };

  if (kind === "money") {
    return (
      <Input
        {...inputProps}
        inputMode="decimal"
        value={maskMonetary(Number(value ?? 0))}
        onChange={(event) =>
          onValueChange(unmaskMonetaryInput(event.target.value))
        }
      />
    );
  }

  const mask = { cep: maskCep, cnpj: maskCnpj }[kind as string];
  const textValue = String(value ?? "");
  const handleChange: ComponentProps<"input">["onChange"] = (event) =>
    onValueChange(mask ? mask(event.target.value) : event.target.value);
  const inputMode = kind === "decimal" || kind === "integer" ? "decimal" : undefined;
  const type = kind === "email" ? "email" : undefined;

  if (field.suffix) {
    return (
      <InputGroup>
        <InputGroupInput
          {...inputProps}
          type={type}
          inputMode={inputMode}
          value={textValue}
          onChange={handleChange}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupText>{field.suffix}</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    );
  }

  return (
    <Input
      {...inputProps}
      type={type}
      inputMode={inputMode}
      value={textValue}
      onChange={handleChange}
    />
  );
}

function ResourceFormFields({
  fields,
  draft,
  onDraftChange,
  invalidFields,
  context,
  ...props
}: Readonly<
  ComponentProps<"div"> & {
    fields: readonly AnyResourceField[];
    draft: ResourceDraft;
    onDraftChange: (draft: ResourceDraft) => void;
    invalidFields: readonly string[];
    context: string;
  }
>) {
  const visibleFields = fields.filter((field) => isFieldVisible(field, draft));
  return (
    <ResourceFieldGrid
      fields={visibleFields}
      renderField={(field) => {
        const id = `${context}-${field.name}`;
        const testId = `${context}-${toKebabCase(field.name)}`;
        const isSwitch = field.kind === "switch";
        return (
          <Field
            key={field.name}
            orientation={isSwitch ? "horizontal" : "vertical"}
            className={fieldSpanClassNames[field.span ?? "full"]}
          >
            <FieldLabel
              htmlFor={id}
              aria-required={field.required || undefined}
            >
              {field.label}
            </FieldLabel>
            <ResourceFieldControl
              id={id}
              field={field}
              value={draft[field.name]}
              invalid={invalidFields.includes(field.name)}
              onValueChange={(value) =>
                onDraftChange({ ...draft, [field.name]: value })
              }
              data-testid={testId}
            />
          </Field>
        );
      }}
      {...props}
    />
  );
}

function ResourceReadOnlyFields({
  fields,
  record,
  context,
  ...props
}: Readonly<
  ComponentProps<"div"> & {
    fields: readonly AnyResourceField[];
    record: Record<string, unknown>;
    context: string;
  }
>) {
  const visibleFields = fields.filter((field) => isFieldVisible(field, record));
  return (
    <ResourceFieldGrid
      fields={visibleFields}
      renderField={(field) => {
        const id = `${context}-${field.name}`;
        const testId = `${context}-${toKebabCase(field.name)}`;
        if (field.kind === "switch") {
          return (
            <Field
              key={field.name}
              orientation="horizontal"
              className={fieldSpanClassNames[field.span ?? "full"]}
            >
              <FieldLabel htmlFor={id}>{field.label}</FieldLabel>
              <Switch
                id={id}
                checked={Boolean(record[field.name])}
                disabled
                data-testid={`${testId}-switch`}
              />
            </Field>
          );
        }
        return (
          <Field
            key={field.name}
            className={fieldSpanClassNames[field.span ?? "full"]}
          >
            <FieldLabel htmlFor={id}>{field.label}</FieldLabel>
            {field.kind === "code" ? (
              <Textarea
                id={id}
                disabled
                readOnly
                rows={6}
                className="typo-monospaced"
                value={String(record[field.name] ?? "")}
                data-testid={`${testId}-textarea`}
              />
            ) : (
              <Input
                id={id}
                disabled
                readOnly
                value={formatFieldValue(
                  record[field.name],
                  field.kind,
                  field.suffix,
                )}
                data-testid={`${testId}-input`}
              />
            )}
          </Field>
        );
      }}
      {...props}
    />
  );
}

function toKebabCase(value: string) {
  return value.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

export {
  findMissingFields,
  fromDraft,
  ResourceDateControl,
  type ResourceDraft,
  ResourceFormFields,
  ResourceReadOnlyFields,
  toDraft,
  toKebabCase,
};
