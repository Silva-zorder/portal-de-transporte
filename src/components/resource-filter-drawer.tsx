import { Button } from "@hubble-ds/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@hubble-ds/components/ui/select";
import { XIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { formatColumnValue } from "@/lib/resource/format";
import type {
  AnyResourceDefinition,
  ResourceRecord,
} from "@/lib/resource/types";
import { toKebabCase } from "./resource-fields";

type ResourceFilters = Record<string, string>;

const ALL_VALUES = "__all__";

function ResourceFilterDrawer({
  definition,
  records,
  open,
  onOpenChange,
  filters,
  onFiltersChange,
}: Readonly<{
  definition: AnyResourceDefinition;
  records: readonly ResourceRecord[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: ResourceFilters;
  onFiltersChange: (filters: ResourceFilters) => void;
}>) {
  const context = `${definition.key}-filters`;
  const [draft, setDraft] = useState<ResourceFilters>(filters);

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) setDraft(filters);
    onOpenChange(nextOpen);
  };

  const filterFields = [
    ...(definition.statusSwitch
      ? [
          {
            key: "active",
            label: "Status",
            options: [
              { value: "true", label: `Ativ${definition.article}s` },
              { value: "false", label: `Inativ${definition.article}s` },
            ],
          },
        ]
      : []),
    ...definition.columns
      .filter((column) => column.filterable)
      .map((column) => ({
        key: column.key,
        label: column.header,
        options: [...new Set(records.map((record) => String(record[column.key])))]
          .sort((one, other) => one.localeCompare(other, "pt-BR"))
          .map((value) => ({
            value,
            label: formatColumnValue(
              value === "true" ? true : value === "false" ? false : value,
              column.kind,
            ),
          })),
      })),
  ];

  const apply = (next: ResourceFilters) => {
    onFiltersChange(next);
    onOpenChange(false);
  };

  return (
    <Drawer direction="right" open={open} onOpenChange={handleOpenChange}>
      <DrawerContent data-testid={`${context}-drawer`}>
        <DrawerHeader>
          <DrawerTitle>Filtrar {definition.title.toLowerCase()}</DrawerTitle>
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
          {filterFields.length === 0 && (
            <p className="typo-paragraph-2 text-muted-text">
              Esta listagem não tem filtros além da pesquisa.
            </p>
          )}
          {filterFields.map((field) => {
            const id = `${context}-${field.key}`;
            return (
              <Field key={field.key}>
                <FieldLabel htmlFor={id}>{field.label}</FieldLabel>
                <Select
                  value={draft[field.key] || ALL_VALUES}
                  onValueChange={(value) =>
                    setDraft({
                      ...draft,
                      [field.key]: value === ALL_VALUES ? "" : value,
                    })
                  }
                >
                  <SelectTrigger
                    id={id}
                    className="w-full"
                    data-testid={`${context}-${toKebabCase(field.key)}-select`}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL_VALUES}>Todos</SelectItem>
                    {field.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            );
          })}
        </div>
        <DrawerFooter>
          <Button
            variant="outline"
            onClick={() => apply({})}
            data-testid={`${context}-clear-button`}
          >
            Limpar filtros
          </Button>
          <Button
            onClick={() => apply(draft)}
            data-testid={`${context}-apply-button`}
          >
            Aplicar filtros
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export { ResourceFilterDrawer, type ResourceFilters };
