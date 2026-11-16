import { Field, FieldLabel } from "@hubble-ds/components/ui/field";
import { Input } from "@hubble-ds/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@hubble-ds/components/ui/input-group";
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
import { cn } from "cn";
import type { ComponentProps } from "react";
import {
  formatDecimal,
  formatFieldValue,
  parseDecimal,
} from "@/lib/resource/format";
import type {
  ResourceField,
  ResourceFieldSpan,
  ResourceRecord,
} from "@/lib/resource/types";

type ResourceDraft = Record<string, unknown>;

const fieldSpanClassNames: Record<ResourceFieldSpan, string> = {
  full: "col-span-6",
  half: "col-span-3",
  third: "col-span-2",
};

const NO_OPTIONS: readonly string[] = [];

function toDraft(
  values: Record<string, unknown>,
  fields: readonly ResourceField<ResourceRecord>[],
) {
  const draft: ResourceDraft = { ...values };
  for (const field of fields) {
    const value = values[field.name];
    if (field.kind === "decimal") draft[field.name] = formatDecimal(Number(value ?? 0));
    if (field.kind === "integer") draft[field.name] = String(value ?? "");
  }
  return draft;
}

function fromDraft(
  draft: ResourceDraft,
  fields: readonly ResourceField<ResourceRecord>[],
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
  fields: readonly ResourceField<ResourceRecord>[],
) {
  return fields
    .filter((field) => field.required && !field.locked)
    .filter((field) => {
      const value = draft[field.name];
      if (field.kind === "money") return value === undefined || value === null;
      return String(value ?? "").trim() === "";
    })
    .map((field) => field.name);
}

function ResourceSelectControl({
  field,
  value,
  onValueChange,
  ...props
}: Readonly<
  Omit<ComponentProps<typeof SelectTrigger>, "value"> & {
    field: ResourceField<ResourceRecord>;
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

function ResourceFieldControl({
  field,
  value,
  onValueChange,
  invalid,
  id,
  "data-testid": testId,
}: Readonly<{
  field: ResourceField<ResourceRecord>;
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

  if (field.suffix) {
    return (
      <InputGroup>
        <InputGroupInput
          {...inputProps}
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
  className,
  ...props
}: Readonly<
  ComponentProps<"div"> & {
    fields: readonly ResourceField<ResourceRecord>[];
    draft: ResourceDraft;
    onDraftChange: (draft: ResourceDraft) => void;
    invalidFields: readonly string[];
    context: string;
  }
>) {
  return (
    <div className={cn("grid grid-cols-6 gap-md", className)} {...props}>
      {fields.map((field) => {
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
      })}
    </div>
  );
}

function ResourceReadOnlyFields({
  fields,
  record,
  context,
  className,
  ...props
}: Readonly<
  ComponentProps<"div"> & {
    fields: readonly ResourceField<ResourceRecord>[];
    record: Record<string, unknown>;
    context: string;
  }
>) {
  return (
    <div className={cn("grid grid-cols-6 gap-md", className)} {...props}>
      {fields.map((field) => {
        const id = `${context}-${field.name}`;
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
                data-testid={`${context}-${toKebabCase(field.name)}-textarea`}
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
              data-testid={`${context}-${toKebabCase(field.name)}-input`}
            />
            )}
          </Field>
        );
      })}
    </div>
  );
}

function toKebabCase(value: string) {
  return value.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

export {
  findMissingFields,
  fromDraft,
  type ResourceDraft,
  ResourceFormFields,
  ResourceReadOnlyFields,
  toDraft,
  toKebabCase,
};
