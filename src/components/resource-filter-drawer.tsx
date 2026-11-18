import { Badge } from "@hubble-ds/components/ui/badge";
import { Button } from "@hubble-ds/components/ui/button";
import { ButtonGroup } from "@hubble-ds/components/ui/button-group";
import { Calendar } from "@hubble-ds/components/ui/calendar";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@hubble-ds/components/ui/drawer";
import { Field, FieldLabel } from "@hubble-ds/components/ui/field";
import { IconButton } from "@hubble-ds/components/ui/icon-button";
import { Input } from "@hubble-ds/components/ui/input";
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
import { CalendarBlankIcon, FunnelIcon, XIcon } from "@phosphor-icons/react";
import { cn } from "cn";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import {
  type AnyResourceFilter,
  filterOptions,
  type ResourceFilterValues,
} from "@/lib/resource/filters";
import { formatDate, formatMonth, parseDate } from "@/lib/resource/format";
import type { ResourceRecord } from "@/lib/resource/types";
import { toKebabCase } from "./resource-fields";

const ALL_VALUES = "__all__";

/** Campo de busca composto: seletor do campo pesquisado + texto. */
function ResourceSearchField({
  context,
  filters,
  placeholder,
  field,
  onFieldChange,
  term,
  onTermChange,
}: Readonly<{
  context: string;
  filters: readonly AnyResourceFilter[];
  placeholder: string;
  field: string;
  onFieldChange: (field: string) => void;
  term: string;
  onTermChange: (term: string) => void;
}>) {
  const selected = filters.find((filter) => filter.key === field);
  const inputPlaceholder = selected
    ? `Pesquisar por ${selected.label.toLowerCase()}...`
    : placeholder;
  const input = (
    <Input
      placeholder={inputPlaceholder}
      aria-label={inputPlaceholder}
      value={term}
      onChange={(event) => onTermChange(event.target.value)}
      data-testid={`${context}-search-input`}
    />
  );

  if (filters.length <= 1) {
    return <div className="w-full max-w-(--container-xs)">{input}</div>;
  }

  return (
    <ButtonGroup className="w-full max-w-(--container-md)">
      <Select
        value={field || ALL_VALUES}
        onValueChange={(value) => onFieldChange(value === ALL_VALUES ? "" : value)}
      >
        <SelectTrigger
          className="w-auto shrink-0"
          aria-label="Campo da pesquisa"
          data-testid={`${context}-search-field-select`}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_VALUES}>Todos os campos</SelectItem>
          {filters.map((filter) => (
            <SelectItem key={filter.key} value={filter.key}>
              {filter.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {input}
    </ButtonGroup>
  );
}

function ResourceFilterSelect({
  filter,
  records,
  value,
  onValueChange,
  id,
  className,
  "data-testid": testId,
}: Readonly<{
  filter: AnyResourceFilter;
  records: readonly ResourceRecord[];
  value: string;
  onValueChange: (value: string) => void;
  id?: string;
  className?: string;
  "data-testid": string;
}>) {
  return (
    <Select
      value={value || ALL_VALUES}
      onValueChange={(next) => onValueChange(next === ALL_VALUES ? "" : next)}
    >
      <SelectTrigger
        id={id}
        className={className}
        aria-label={filter.label}
        data-testid={testId}
      >
        {value ? <SelectValue /> : <span className="text-muted-text">{filter.label}</span>}
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL_VALUES}>Todos</SelectItem>
        {filterOptions(filter, records).map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function ResourceFilterDate({
  filter,
  value,
  onValueChange,
  id,
  className,
  "data-testid": testId,
}: Readonly<{
  filter: AnyResourceFilter;
  value: string;
  onValueChange: (value: string) => void;
  id?: string;
  className?: string;
  "data-testid": string;
}>) {
  const [open, setOpen] = useState(false);
  const isMonth = filter.kind === "month";
  const selected = isMonth ? parseDate(`01/${value}`) : parseDate(value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          className={cn("justify-between font-normal", !value && "text-muted-text", className)}
          aria-label={filter.label}
          data-testid={testId}
        >
          {value || filter.label}
          <CalendarBlankIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="flex w-auto flex-col gap-xs p-xs">
        <Calendar
          mode="single"
          selected={selected}
          defaultMonth={selected}
          onSelect={(date) => {
            onValueChange(date ? (isMonth ? formatMonth(date) : formatDate(date)) : "");
            setOpen(false);
          }}
          locale={ptBR}
        />
        <Button
          variant="outline"
          size="small"
          disabled={!value}
          onClick={() => {
            onValueChange("");
            setOpen(false);
          }}
          data-testid={`${testId}-clear-button`}
        >
          Limpar data
        </Button>
      </PopoverContent>
    </Popover>
  );
}

/** Filtros de seleção, de data e campos digitáveis que ficam à direita do cabeçalho. */
function ResourceHeaderFilters({
  context,
  inputs,
  selects,
  records,
  values,
  onValueChange,
}: Readonly<{
  context: string;
  inputs: readonly AnyResourceFilter[];
  selects: readonly AnyResourceFilter[];
  records: readonly ResourceRecord[];
  values: ResourceFilterValues;
  onValueChange: (key: string, value: string) => void;
}>) {
  return (
    <>
      {inputs.map((filter) => (
        <Input
          key={filter.key}
          className="w-(--container-3xs)"
          placeholder={filter.label}
          aria-label={filter.label}
          value={values[filter.key] ?? ""}
          onChange={(event) => onValueChange(filter.key, event.target.value)}
          data-testid={`${context}-${toKebabCase(filter.key)}-input`}
        />
      ))}
      {selects.map((filter) =>
        filter.kind === "select" ? (
          <ResourceFilterSelect
            key={filter.key}
            filter={filter}
            records={records}
            value={values[filter.key] ?? ""}
            onValueChange={(value) => onValueChange(filter.key, value)}
            className="w-auto"
            data-testid={`${context}-${toKebabCase(filter.key)}-select`}
          />
        ) : (
          <ResourceFilterDate
            key={filter.key}
            filter={filter}
            value={values[filter.key] ?? ""}
            onValueChange={(value) => onValueChange(filter.key, value)}
            data-testid={`${context}-${toKebabCase(filter.key)}-button`}
          />
        ),
      )}
    </>
  );
}

/** Drawer "Filtrar" com os filtros de seleção que não couberam no cabeçalho. */
function ResourceFilterDrawer({
  context: listContext,
  title,
  filters,
  records,
  values,
  onValuesChange,
}: Readonly<{
  context: string;
  title: string;
  filters: readonly AnyResourceFilter[];
  records: readonly ResourceRecord[];
  values: ResourceFilterValues;
  onValuesChange: (values: ResourceFilterValues) => void;
}>) {
  const context = `${listContext}-filters`;
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<ResourceFilterValues>(values);
  const activeCount = filters.filter((filter) => values[filter.key]).length;

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) setDraft(values);
    setOpen(nextOpen);
  };

  const apply = (next: ResourceFilterValues) => {
    onValuesChange(next);
    setOpen(false);
  };

  const cleared = Object.fromEntries(filters.map((filter) => [filter.key, ""]));

  return (
    <>
      <Button
        variant="outline"
        onClick={() => handleOpenChange(true)}
        data-testid={`${listContext}-filter-button`}
      >
        <FunnelIcon />
        Filtrar
        {activeCount > 0 && (
          <Badge data-testid={`${listContext}-filter-count-badge`}>{activeCount}</Badge>
        )}
      </Button>
      <Drawer direction="right" open={open} onOpenChange={handleOpenChange}>
        <DrawerContent data-testid={`${context}-drawer`}>
          <DrawerHeader>
            <DrawerTitle>Filtrar {title.toLowerCase()}</DrawerTitle>
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
          <div className="flex flex-1 flex-col gap-md overflow-auto p-md">
            {filters.map((filter) => {
              const id = `${context}-${filter.key}`;
              const update = (value: string) => setDraft({ ...draft, [filter.key]: value });
              return (
                <Field key={filter.key}>
                  <FieldLabel htmlFor={id}>{filter.label}</FieldLabel>
                  {filter.kind === "select" ? (
                    <ResourceFilterSelect
                      id={id}
                      filter={filter}
                      records={records}
                      value={draft[filter.key] ?? ""}
                      onValueChange={update}
                      className="w-full"
                      data-testid={`${context}-${toKebabCase(filter.key)}-select`}
                    />
                  ) : (
                    <ResourceFilterDate
                      id={id}
                      filter={filter}
                      value={draft[filter.key] ?? ""}
                      onValueChange={update}
                      className="w-full"
                      data-testid={`${context}-${toKebabCase(filter.key)}-button`}
                    />
                  )}
                </Field>
              );
            })}
          </div>
          <DrawerFooter>
            <Button
              variant="outline"
              onClick={() => apply({ ...values, ...cleared })}
              data-testid={`${context}-clear-button`}
            >
              Limpar filtros
            </Button>
            <Button
              onClick={() => apply({ ...values, ...draft })}
              data-testid={`${context}-apply-button`}
            >
              Aplicar filtros
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export { ResourceFilterDrawer, ResourceHeaderFilters, ResourceSearchField };
