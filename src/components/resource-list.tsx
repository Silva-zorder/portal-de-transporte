import { confirmAlert } from "@hubble-ds/components/callables/confirm-alert-callable";
import { Badge } from "@hubble-ds/components/ui/badge";
import { Button } from "@hubble-ds/components/ui/button";
import { Checkbox } from "@hubble-ds/components/ui/checkbox";
import {
  createDataTableColumnHelper,
  createDataTableCoreOptions,
  createDataTableRowSelectionColumnDef,
  DataTable,
  DataTableCell,
  DataTableColumn,
  DataTableColumnSortingIndicator,
  DataTableFooter,
  DataTableGrid,
  DataTableGridScrollArea,
  DataTablePagination,
} from "@hubble-ds/components/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@hubble-ds/components/ui/dropdown-menu";
import { IconButton } from "@hubble-ds/components/ui/icon-button";
import { Input } from "@hubble-ds/components/ui/input";
import { Switch } from "@hubble-ds/components/ui/switch";
import { toast } from "@hubble-ds/components/ui/toast";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@hubble-ds/components/ui/tooltip";
import {
  ArrowSquareOutIcon,
  ArrowsClockwiseIcon,
  DotsThreeVerticalIcon,
  DownloadSimpleIcon,
  EyeIcon,
  FloppyDiskIcon,
  FunnelIcon,
  PencilSimpleIcon,
  TrashIcon,
  UploadSimpleIcon,
  XSquareIcon,
} from "@phosphor-icons/react";
import { useTable } from "@tanstack/react-table";
import { cn } from "cn";
import { type ComponentProps, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  downloadCsv,
  formatColumnValue,
  matchesSearch,
  toCsv,
} from "@/lib/resource/format";
import type {
  AnyResourceDefinition,
  ResourceRecord,
  ResourceToolbarAction,
} from "@/lib/resource/types";
import {
  ResourceFilterDrawer,
  type ResourceFilters,
} from "./resource-filter-drawer";
import {
  ResourceDetailDialog,
  type ResourceFormController,
  ResourceFormOverlay,
} from "./resource-form";
import { ResourceImportDialog } from "./resource-import-dialog";

const resourceTableFeatures = {};
const NO_RECORDS: ResourceRecord[] = [];
const useNoMutation = () => undefined;

const toolbarLabels: Record<
  Exclude<ResourceToolbarAction, "filter">,
  string
> = {
  export: "Exportar",
  "download-csv": "Baixar CSV",
  import: "Importar",
  refresh: "Atualizar",
};

const toolbarIcons: Record<Exclude<ResourceToolbarAction, "filter">, typeof FunnelIcon> = {
  export: DownloadSimpleIcon,
  "download-csv": DownloadSimpleIcon,
  import: UploadSimpleIcon,
  refresh: ArrowsClockwiseIcon,
};

function ResourceList({
  definition,
  controller,
  parentFilters,
  parentValues,
  className,
  ...props
}: Readonly<
  ComponentProps<"section"> & {
    definition: AnyResourceDefinition;
    controller: ResourceFormController;
    /** Restringe a listagem aos registros de um pai e pré-preenche o vínculo na criação. */
    parentFilters?: Record<string, unknown>;
    parentValues?: Record<string, unknown>;
  }
>) {
  /**
   * Problema do @tanstack/table com React Compiler.
   * @see https://github.com/shadcn-ui/ui/issues/3905
   */
  "use no memo";

  const navigate = useNavigate();
  const context = definition.key;
  const query = definition.hooks.useFetchAll({ filters: parentFilters });
  const updateMutation = (definition.hooks.useUpdate ?? useNoMutation)();
  const removeMutation = (definition.hooks.useRemove ?? useNoMutation)();

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<ResourceFilters>({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);

  const allRecords = query.data ?? NO_RECORDS;
  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  const records = useMemo(
    () =>
      allRecords.filter(
        (record) =>
          matchesSearch(record, definition.searchKeys, search) &&
          Object.entries(filters).every(
            ([key, value]) => !value || String(record[key]) === value,
          ),
      ),
    [allRecords, definition.searchKeys, search, filters],
  );

  const handleToggleStatus = async (record: ResourceRecord, active: boolean) => {
    try {
      await updateMutation?.mutateAsync({ id: record.id, active });
      toast.success(
        `${definition.describe(record)} ${active ? "ativad" : "desativad"}${definition.article}.`,
      );
    } catch {
      toast.error("Não foi possível alterar o status.");
    }
  };

  const handleRemove = async (record: ResourceRecord) => {
    const confirmed = await confirmAlert({
      title: `Excluir ${definition.noun}?`,
      description: `${definition.describe(record)} será removid${definition.article}. Essa ação não pode ser desfeita.`,
      actionText: "Excluir",
      ActionProps: {
        variant: "destructive",
        "data-testid": `${context}-remove-confirm-button`,
      },
      PopupProps: { "data-testid": `${context}-remove-alert-dialog` },
    });
    if (!confirmed) return;
    try {
      await removeMutation?.mutateAsync({ id: record.id });
      toast.success(`${definition.describe(record)} excluíd${definition.article}.`);
    } catch {
      toast.error("Não foi possível excluir. Tente novamente.");
    }
  };

  const columns = useMemo(() => {
    const column = createDataTableColumnHelper<
      ResourceRecord,
      typeof resourceTableFeatures
    >();

    const dataColumns = definition.columns.map((config) =>
      column.accessor((record) => record[config.key], {
        id: config.key,
        size: config.size,
        enableSorting: config.sortable ?? true,
        meta: { title: config.header },
        header: ({ column: tableColumn }) => (
          <DataTableColumn column={tableColumn}>
            {config.header}
            <DataTableColumnSortingIndicator column={tableColumn} />
          </DataTableColumn>
        ),
        cell: (cell) => {
          const value = cell.getValue();
          const text = formatColumnValue(value, config.kind);
          if (config.kind === "badge") {
            return (
              <DataTableCell cell={cell} title={text}>
                <Badge
                  variant={config.badgeVariants?.[text] ?? "secondary"}
                  data-testid={`${context}-row-${toTestId(config.key)}-badge-${cell.row.original.id}`}
                >
                  {text}
                </Badge>
              </DataTableCell>
            );
          }
          return (
            <DataTableCell cell={cell} title={text} className="truncate">
              {text}
            </DataTableCell>
          );
        },
      }),
    );

    const statusColumn = column.display({
      id: "status",
      size: 72,
      enableSorting: false,
      enableHiding: false,
      header: () => "Status",
      cell: ({ row }) => (
        <Switch
          checked={Boolean(row.original.active)}
          onCheckedChange={(active) => handleToggleStatus(row.original, active)}
          aria-label={`Status de ${definition.describe(row.original)}`}
          data-testid={`${context}-row-status-switch-${row.original.id}`}
        />
      ),
    });

    const hasLinks = (definition.rowLinks?.length ?? 0) > 0;
    const actionsColumn = column.display({
      id: "actions",
      size: hasLinks ? 56 + (definition.rowLinks?.length ?? 0) * 88 : 64,
      enableSorting: false,
      enableHiding: false,
      header: ({ column: tableColumn }) => (
        <DataTableColumn column={tableColumn} className="justify-end">
          Ações
        </DataTableColumn>
      ),
      cell: ({ row }) => {
        const record = row.original;
        return (
          <span
            className="flex items-center justify-end gap-2xs"
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => event.stopPropagation()}
          >
            {definition.rowLinks?.map((link) => (
              <Button
                key={link.key}
                asChild
                variant="ghost"
                size="mini"
                data-testid={`${context}-row-${link.key}-link-${record.id}`}
              >
                <Link to={link.to(record)}>
                  <link.icon />
                  {link.label}
                </Link>
              </Button>
            ))}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <IconButton
                  variant="ghost"
                  size="mini"
                  title="Ações"
                  data-testid={`${context}-row-actions-button-${record.id}`}
                >
                  <DotsThreeVerticalIcon />
                  <span className="sr-only">Ações</span>
                </IconButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                  {definition.recordPath && (
                    <DropdownMenuItem
                      onSelect={() => navigate(definition.recordPath?.(record) ?? "")}
                      data-testid={`${context}-row-view-menu-item-${record.id}`}
                    >
                      <EyeIcon data-icon="inline-start" />
                      Visualizar
                    </DropdownMenuItem>
                  )}
                  {definition.detail && (
                    <DropdownMenuItem
                      onSelect={() => controller.openView(record)}
                      data-testid={`${context}-row-detail-menu-item-${record.id}`}
                    >
                      <EyeIcon data-icon="inline-start" />
                      Visualizar
                    </DropdownMenuItem>
                  )}
                  {definition.form && definition.hooks.useUpdate && (
                    <DropdownMenuItem
                      onSelect={() => controller.openEdit(record)}
                      data-testid={`${context}-row-edit-menu-item-${record.id}`}
                    >
                      <PencilSimpleIcon data-icon="inline-start" />
                      Editar
                    </DropdownMenuItem>
                  )}
                  {definition.rowActions?.map((action) => (
                    <DropdownMenuItem
                      key={action.key}
                      onSelect={() => action.run(record)}
                      data-testid={`${context}-row-${action.key}-menu-item-${record.id}`}
                    >
                      <action.icon data-icon="inline-start" />
                      {action.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
                {definition.hooks.useRemove && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      variant="destructive"
                      onSelect={() => handleRemove(record)}
                      data-testid={`${context}-row-remove-menu-item-${record.id}`}
                    >
                      <TrashIcon data-icon="inline-start" />
                      Excluir
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </span>
        );
      },
    });

    return column.columns([
      ...(definition.selectable
        ? [
            createDataTableRowSelectionColumnDef(column, {
              // O DataTable do Hubble também alterna a seleção no clique da linha; sem interromper
              // a propagação, o clique direto no checkbox alterna duas vezes e se anula.
              cell: ({ row }) => (
                <Checkbox
                  checked={row.getIsSelected()}
                  onCheckedChange={(value) => row.toggleSelected(!!value)}
                  onClick={(event) => event.stopPropagation()}
                  aria-label="Selecionar linha"
                  title="Selecionar linha"
                  data-testid={`${context}-row-select-checkbox-${row.original.id}`}
                />
              ),
            }),
          ]
        : []),
      ...(definition.statusSwitch ? [statusColumn] : []),
      ...dataColumns,
      actionsColumn,
    ]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: os handlers dependem só da definição, que é estável.
  }, [definition]);

  const table = useTable(
    createDataTableCoreOptions({
      features: resourceTableFeatures,
      records,
      columns,
      enableRowSelection: Boolean(definition.selectable),
      getRowId: (record) => String(record.id),
      initialState: { pagination: { pageIndex: 0, pageSize: 25 } },
    }),
  );

  const handleExport = () => {
    downloadCsv(
      `${definition.key}.csv`,
      toCsv(records, [{ key: "id", header: "ID" }, ...definition.columns]),
    );
    toast.success(`${records.length} registros exportados em CSV.`);
  };

  const handleRefresh = async () => {
    await query.refetch();
    toast.success("Lista atualizada.");
  };

  const handleResetView = () => {
    setSearch("");
    setFilters({});
    table.resetSorting();
    table.resetColumnVisibility();
    table.resetRowSelection();
    toast.success("Visualização restaurada.");
  };

  const toolbarHandlers: Record<
    Exclude<ResourceToolbarAction, "filter">,
    () => void
  > = {
    export: handleExport,
    "download-csv": handleExport,
    import: () => setIsImportOpen(true),
    refresh: handleRefresh,
  };

  const selectedCount = definition.selectable
    ? table.getSelectedRowModel().rows.length
    : 0;

  return (
    <section
      className={cn("flex min-h-0 flex-1 flex-col", className)}
      data-testid={`${context}-list`}
      {...props}
    >
      <div className="flex items-center gap-xs border-b border-border-100 bg-background px-md py-xs">
        <Input
          className="max-w-(--container-xs)"
          placeholder={definition.searchPlaceholder}
          aria-label={definition.searchPlaceholder}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          data-testid={`${context}-search-input`}
        />
        {selectedCount > 0 && (
          <span className="typo-caption-1 text-muted-text">
            {selectedCount} selecionado(s)
          </span>
        )}
        <div className="ml-auto flex items-center gap-xs">
          {definition.toolbar.map((action) => {
            if (action === "filter") {
              return (
                <Button
                  key={action}
                  variant="outline"
                  onClick={() => setIsFilterOpen(true)}
                  data-testid={`${context}-filter-button`}
                >
                  <FunnelIcon />
                  Filtrar
                  {activeFilterCount > 0 && (
                    <Badge data-testid={`${context}-filter-count-badge`}>
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>
              );
            }
            const ActionIcon = toolbarIcons[action];
            return (
              <Button
                key={action}
                variant="outline"
                onClick={toolbarHandlers[action]}
                data-testid={`${context}-${action}-button`}
              >
                <ActionIcon />
                {toolbarLabels[action]}
              </Button>
            );
          })}
        </div>
      </div>

      <DataTable
        core={table}
        isLoading={query.isLoading}
        className="min-h-0 flex-1 gap-0"
        data-testid={`${context}-table`}
      >
        <DataTableGridScrollArea className="flex-1 p-md">
          <DataTableGrid />
        </DataTableGridScrollArea>
        <DataTableFooter className="flex items-center gap-xs border-t border-border-100 bg-background px-md py-xs">
          <span className="text-sm text-text">Resultados por página</span>
          <DataTablePagination
            className="flex-1"
            data-testid={`${context}-pagination`}
          />
          <div className="flex items-center gap-2xs">
            <Tooltip>
              <TooltipTrigger asChild>
                <IconButton
                  variant="outline"
                  size="small"
                  onClick={() => window.open(window.location.href, "_blank")}
                  data-testid={`${context}-open-new-tab-button`}
                >
                  <ArrowSquareOutIcon />
                  <span className="sr-only">Abrir em nova aba</span>
                </IconButton>
              </TooltipTrigger>
              <TooltipContent>Abrir em nova aba</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <IconButton
                  variant="outline"
                  size="small"
                  onClick={() => toast.success("Visualização salva.")}
                  data-testid={`${context}-save-view-button`}
                >
                  <FloppyDiskIcon />
                  <span className="sr-only">Salvar visualização</span>
                </IconButton>
              </TooltipTrigger>
              <TooltipContent>Salvar visualização</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <IconButton
                  variant="outline"
                  size="small"
                  onClick={handleResetView}
                  data-testid={`${context}-reset-view-button`}
                >
                  <XSquareIcon />
                  <span className="sr-only">Restaurar visualização</span>
                </IconButton>
              </TooltipTrigger>
              <TooltipContent>Restaurar visualização</TooltipContent>
            </Tooltip>
          </div>
        </DataTableFooter>
      </DataTable>

      <ResourceFormOverlay
        definition={definition}
        controller={controller}
        parentValues={{ ...parentFilters, ...parentValues }}
      />
      <ResourceDetailDialog definition={definition} controller={controller} />
      <ResourceFilterDrawer
        definition={definition}
        records={allRecords}
        open={isFilterOpen}
        onOpenChange={setIsFilterOpen}
        filters={filters}
        onFiltersChange={setFilters}
      />
      <ResourceImportDialog
        definition={definition}
        open={isImportOpen}
        onOpenChange={setIsImportOpen}
      />
    </section>
  );
}

function toTestId(value: string) {
  return value.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

export { ResourceList };
