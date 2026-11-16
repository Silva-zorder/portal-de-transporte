import { Badge } from "@hubble-ds/components/ui/badge";
import { Button } from "@hubble-ds/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@hubble-ds/components/ui/card";
import {
  createDataTableColumnHelper,
  createDataTableCoreOptions,
  DataTable,
  DataTableCell,
  DataTableColumn,
  DataTableColumnSortingIndicator,
  DataTableGrid,
  DataTableGridBody,
  DataTableGridEmpty,
  DataTableGridHeader,
  DataTableGridScrollArea,
} from "@hubble-ds/components/ui/data-table";
import { Field, FieldLabel } from "@hubble-ds/components/ui/field";
import { IconButton } from "@hubble-ds/components/ui/icon-button";
import { Input } from "@hubble-ds/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@hubble-ds/components/ui/input-group";
import { TableCell, TableRow } from "@hubble-ds/components/ui/table";
import { toast } from "@hubble-ds/components/ui/toast";
import { isValidCep, maskCep } from "@hubble-ds/utils/cep";
import { maskMonetary, unmaskMonetaryInput } from "@hubble-ds/utils/monetary";
import {
  CalculatorIcon,
  CaretDownIcon,
  CaretUpIcon,
  PlusIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import { flexRender, useTable } from "@tanstack/react-table";
import { type FormEvent, Fragment, useMemo, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { ResourceReadOnlyFields } from "@/components/resource-fields";
import { useFreightSimulationSimulateMutation } from "@/hooks/use-freight-simulation-simulate-mutation";
import { parseDecimal } from "@/lib/resource/format";
import type { ResourceField, ResourceRecord } from "@/lib/resource/types";
import type { FreightSimulationQuote } from "@/services/portal/v1/freight-simulation.service";

type VolumeDraft = {
  key: number;
  length: string;
  width: string;
  height: string;
  weight: string;
  value: number;
};

type VolumeDimension = "length" | "width" | "height" | "weight";

const volumeDimensions: {
  name: VolumeDimension;
  label: string;
  suffix: string;
}[] = [
  { name: "length", label: "Comprimento", suffix: "cm" },
  { name: "width", label: "Largura", suffix: "cm" },
  { name: "height", label: "Altura", suffix: "cm" },
  { name: "weight", label: "Peso (kg)", suffix: "kg" },
];

const quoteDetailFields: ResourceField<ResourceRecord>[] = [
  { name: "toll", label: "Pedágio", kind: "money", span: "third" },
  { name: "emex", label: "EMEX", kind: "money", span: "third" },
  { name: "gris", label: "Gris", kind: "money", span: "third" },
  { name: "icms", label: "ICMS padrão", kind: "money", span: "half" },
  { name: "advalorem", label: "Advalorem", kind: "money", span: "half" },
];

const quoteTableFeatures = {};
const COMPARISON_COLUMN = "comparison";
const DETAILS_COLUMN = "details";
const NO_QUOTES: FreightSimulationQuote[] = [];

const createVolume = (key: number): VolumeDraft => ({
  key,
  length: "",
  width: "",
  height: "",
  weight: "",
  value: 0,
});

function FreightCalculatorPage() {
  /**
   * Problema do @tanstack/table com React Compiler.
   * @see https://github.com/shadcn-ui/ui/issues/3905
   */
  "use no memo";

  const simulation = useFreightSimulationSimulateMutation();
  const [originZip, setOriginZip] = useState("89120-000");
  const [destinationZip, setDestinationZip] = useState("89165-063");
  const [volumes, setVolumes] = useState<VolumeDraft[]>([
    { key: 1, length: "20", width: "60", height: "60", weight: "0,5", value: 90 },
  ]);
  const [nextVolumeKey, setNextVolumeKey] = useState(2);
  const [invalidFields, setInvalidFields] = useState<string[]>([]);
  const [expandedQuotes, setExpandedQuotes] = useState<number[]>([]);

  const quotes = simulation.data ?? NO_QUOTES;
  const cheapest = Math.min(...quotes.map((quote) => quote.freightValue));
  const fastest = Math.min(...quotes.map((quote) => quote.deliveryDays));

  const updateVolume = (key: number, changes: Partial<VolumeDraft>) =>
    setVolumes((current) =>
      current.map((volume) =>
        volume.key === key ? { ...volume, ...changes } : volume,
      ),
    );

  const handleAddVolume = () => {
    setVolumes((current) => [...current, createVolume(nextVolumeKey)]);
    setNextVolumeKey((key) => key + 1);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const invalid = [
      ...(isValidCep(originZip) ? [] : ["origin-zip"]),
      ...(isValidCep(destinationZip) ? [] : ["destination-zip"]),
      ...volumes.flatMap((volume) => [
        ...volumeDimensions
          .filter((dimension) => parseDecimal(volume[dimension.name]) <= 0)
          .map((dimension) => `${volume.key}-${dimension.name}`),
        ...(volume.value > 0 ? [] : [`${volume.key}-value`]),
      ]),
    ];
    setInvalidFields(invalid);
    if (invalid.length > 0) {
      toast.error("Revise os campos destacados antes de simular.");
      return;
    }

    try {
      const result = await simulation.mutateAsync({
        originZip,
        destinationZip,
        volumes: volumes.map((volume) => ({
          length: parseDecimal(volume.length),
          width: parseDecimal(volume.width),
          height: parseDecimal(volume.height),
          weight: parseDecimal(volume.weight),
          value: volume.value,
        })),
      });
      setExpandedQuotes([]);
      toast.success(`${result.length} cotações calculadas.`);
    } catch {
      toast.error("Não foi possível simular o frete. Tente novamente.");
    }
  };

  const toggleQuote = (id: number) =>
    setExpandedQuotes((current) =>
      current.includes(id)
        ? current.filter((expanded) => expanded !== id)
        : [...current, id],
    );

  const columns = useMemo(() => {
    const column = createDataTableColumnHelper<
      FreightSimulationQuote,
      typeof quoteTableFeatures
    >();

    return column.columns([
      column.accessor("carrierName", {
        id: "transportadora",
        header: ({ column: tableColumn }) => (
          <DataTableColumn column={tableColumn}>
            Transportadora
            <DataTableColumnSortingIndicator column={tableColumn} />
          </DataTableColumn>
        ),
        cell: (cell) => <DataTableCell cell={cell} className="truncate" />,
      }),
      column.accessor("service", {
        id: "serviço",
        size: 110,
        header: ({ column: tableColumn }) => (
          <DataTableColumn column={tableColumn}>
            Serviço
            <DataTableColumnSortingIndicator column={tableColumn} />
          </DataTableColumn>
        ),
        cell: (cell) => <DataTableCell cell={cell} />,
      }),
      column.accessor("freightValue", {
        id: "valor do frete",
        size: 140,
        header: ({ column: tableColumn }) => (
          <DataTableColumn column={tableColumn}>
            Valor do frete
            <DataTableColumnSortingIndicator column={tableColumn} />
          </DataTableColumn>
        ),
        cell: (cell) => (
          <DataTableCell cell={cell}>
            {maskMonetary(cell.getValue())}
          </DataTableCell>
        ),
      }),
      column.accessor("deliveryDays", {
        id: "prazo de entrega",
        size: 160,
        header: ({ column: tableColumn }) => (
          <DataTableColumn column={tableColumn}>
            Prazo de entrega
            <DataTableColumnSortingIndicator column={tableColumn} />
          </DataTableColumn>
        ),
        cell: (cell) => (
          <DataTableCell cell={cell}>
            {cell.getValue()} dias úteis
          </DataTableCell>
        ),
      }),
      column.display({
        id: COMPARISON_COLUMN,
        size: 150,
        enableSorting: false,
        enableHiding: false,
        header: () => "Comparativo",
        cell: () => null,
      }),
      column.display({
        id: DETAILS_COLUMN,
        size: 90,
        enableSorting: false,
        enableHiding: false,
        header: ({ column: tableColumn }) => (
          <DataTableColumn column={tableColumn} className="justify-end">
            Detalhes
          </DataTableColumn>
        ),
        cell: () => null,
      }),
    ]);
  }, []);

  const table = useTable(
    createDataTableCoreOptions({
      features: quoteTableFeatures,
      records: quotes,
      columns,
      enableRowSelection: false,
      getRowId: (quote) => String(quote.id),
      initialState: { pagination: { pageIndex: 0, pageSize: 50 } },
    }),
  );

  return (
    <>
      <PageHeader title="Calculadora de frete" />
      <div className="grid min-h-0 flex-1 grid-cols-5 gap-md overflow-hidden p-md">
        <Card className="col-span-2 min-h-0" data-testid="freight-calculator-card">
          <form
            className="flex min-h-0 flex-1 flex-col"
            onSubmit={handleSubmit}
            noValidate
            data-testid="freight-calculator-form"
          >
            <CardHeader>
              <CardTitle>Dados do envio</CardTitle>
            </CardHeader>
            <CardContent className="flex min-h-0 flex-1 flex-col gap-md overflow-auto">
              <span className="text-sm font-medium text-text">Localização</span>
              <div className="grid grid-cols-2 gap-md">
                <Field>
                  <FieldLabel htmlFor="freight-origin-zip" aria-required>
                    CEP origem
                  </FieldLabel>
                  <Input
                    id="freight-origin-zip"
                    inputMode="numeric"
                    placeholder="00000-000"
                    value={originZip}
                    onChange={(event) => setOriginZip(maskCep(event.target.value))}
                    aria-invalid={invalidFields.includes("origin-zip") || undefined}
                    data-testid="freight-calculator-origin-zip-input"
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="freight-destination-zip" aria-required>
                    CEP destino
                  </FieldLabel>
                  <Input
                    id="freight-destination-zip"
                    inputMode="numeric"
                    placeholder="00000-000"
                    value={destinationZip}
                    onChange={(event) =>
                      setDestinationZip(maskCep(event.target.value))
                    }
                    aria-invalid={
                      invalidFields.includes("destination-zip") || undefined
                    }
                    data-testid="freight-calculator-destination-zip-input"
                  />
                </Field>
              </div>
              <div className="flex items-center justify-between gap-xs">
                <span className="text-sm font-medium text-text">Volumes</span>
                <Button
                  variant="outline"
                  size="small"
                  onClick={handleAddVolume}
                  data-testid="freight-calculator-add-volume-button"
                >
                  <PlusIcon />
                  Adicionar volume
                </Button>
              </div>
              {volumes.map((volume, position) => (
                <Card
                  key={volume.key}
                  className="shrink-0"
                  data-testid={`freight-calculator-volume-card-${volume.key}`}
                >
                  <CardHeader>
                    <CardTitle className="text-sm">
                      Volume {position + 1}
                    </CardTitle>
                    <CardAction>
                      <IconButton
                        variant="ghost"
                        size="small"
                        disabled={volumes.length === 1}
                        title="Remover volume"
                        onClick={() =>
                          setVolumes((current) =>
                            current.filter((item) => item.key !== volume.key),
                          )
                        }
                        data-testid={`freight-calculator-remove-volume-button-${volume.key}`}
                      >
                        <TrashIcon />
                        <span className="sr-only">Remover volume</span>
                      </IconButton>
                    </CardAction>
                  </CardHeader>
                  <CardContent className="grid grid-cols-4 gap-xs">
                    {volumeDimensions.map((dimension) => {
                      const id = `freight-volume-${volume.key}-${dimension.name}`;
                      return (
                        <Field key={dimension.name}>
                          <FieldLabel htmlFor={id} aria-required>
                            {dimension.label}
                          </FieldLabel>
                          <InputGroup>
                            <InputGroupInput
                              id={id}
                              inputMode="decimal"
                              placeholder="0"
                              value={volume[dimension.name]}
                              onChange={(event) =>
                                updateVolume(volume.key, {
                                  [dimension.name]: event.target.value.replace(
                                    /[^\d,]/g,
                                    "",
                                  ),
                                })
                              }
                              aria-invalid={
                                invalidFields.includes(
                                  `${volume.key}-${dimension.name}`,
                                ) || undefined
                              }
                              data-testid={`freight-calculator-volume-${dimension.name}-input-${volume.key}`}
                            />
                            <InputGroupAddon align="inline-end">
                              <InputGroupText>{dimension.suffix}</InputGroupText>
                            </InputGroupAddon>
                          </InputGroup>
                        </Field>
                      );
                    })}
                    <Field className="col-span-4">
                      <FieldLabel
                        htmlFor={`freight-volume-${volume.key}-value`}
                        aria-required
                      >
                        Valor total da mercadoria
                      </FieldLabel>
                      <Input
                        id={`freight-volume-${volume.key}-value`}
                        inputMode="decimal"
                        value={maskMonetary(volume.value)}
                        onChange={(event) =>
                          updateVolume(volume.key, {
                            value: unmaskMonetaryInput(event.target.value),
                          })
                        }
                        aria-invalid={
                          invalidFields.includes(`${volume.key}-value`) ||
                          undefined
                        }
                        data-testid={`freight-calculator-volume-value-input-${volume.key}`}
                      />
                    </Field>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full"
                disabled={simulation.isPending}
                data-testid="freight-calculator-submit-button"
              >
                <CalculatorIcon />
                Simular frete
              </Button>
            </CardFooter>
          </form>
        </Card>

        <section
          className="col-span-3 flex min-h-0 flex-col gap-xs"
          data-testid="freight-calculator-results"
        >
          <h2 className="px-xs text-base font-medium text-text">Resultados</h2>
          <DataTable
            core={table}
            isLoading={simulation.isPending}
            className="min-h-0 flex-1"
            data-testid="freight-calculator-results-table"
          >
            <DataTableGridScrollArea className="flex-1">
              <DataTableGrid>
                <DataTableGridHeader />
                <DataTableGridBody>
                  {quotes.length === 0 && !simulation.isPending && (
                    <DataTableGridEmpty
                      title="Nenhuma simulação ainda."
                      description="Preencha os dados do envio e clique em Simular frete."
                    />
                  )}
                  {table.getRowModel().rows.map((row) => {
                    const quote = row.original;
                    const isExpanded = expandedQuotes.includes(quote.id);
                    const ToggleIcon = isExpanded ? CaretUpIcon : CaretDownIcon;
                    return (
                      <Fragment key={row.id}>
                        <TableRow
                          data-testid={`freight-calculator-results-row-${quote.id}`}
                        >
                          {row.getVisibleCells().map((cell) => {
                            if (cell.column.id === COMPARISON_COLUMN) {
                              return (
                                <TableCell key={cell.id}>
                                  <span className="flex items-center gap-2xs">
                                    {quote.freightValue === cheapest && (
                                      <Badge
                                        variant="outline"
                                        data-testid={`freight-calculator-results-cheapest-badge-${quote.id}`}
                                      >
                                        Mais barato
                                      </Badge>
                                    )}
                                    {quote.deliveryDays === fastest && (
                                      <Badge
                                        variant="outline"
                                        data-testid={`freight-calculator-results-fastest-badge-${quote.id}`}
                                      >
                                        Mais rápido
                                      </Badge>
                                    )}
                                  </span>
                                </TableCell>
                              );
                            }
                            if (cell.column.id === DETAILS_COLUMN) {
                              return (
                                <TableCell key={cell.id}>
                                  <span className="flex justify-end">
                                    <IconButton
                                      variant="ghost"
                                      size="mini"
                                      aria-expanded={isExpanded}
                                      title={
                                        isExpanded
                                          ? "Ocultar detalhes"
                                          : "Ver detalhes"
                                      }
                                      onClick={() => toggleQuote(quote.id)}
                                      data-testid={`freight-calculator-results-details-button-${quote.id}`}
                                    >
                                      <ToggleIcon />
                                      <span className="sr-only">Detalhes</span>
                                    </IconButton>
                                  </span>
                                </TableCell>
                              );
                            }
                            return (
                              <TableCell key={cell.id}>
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext(),
                                )}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                        {isExpanded && (
                          <TableRow
                            className="hover:bg-transparent"
                            data-testid={`freight-calculator-results-detail-row-${quote.id}`}
                          >
                            <TableCell colSpan={row.getVisibleCells().length}>
                              <ResourceReadOnlyFields
                                className="p-xs"
                                fields={quoteDetailFields}
                                record={quote}
                                context={`freight-calculator-quote-${quote.id}`}
                              />
                            </TableCell>
                          </TableRow>
                        )}
                      </Fragment>
                    );
                  })}
                </DataTableGridBody>
              </DataTableGrid>
            </DataTableGridScrollArea>
          </DataTable>
        </section>
      </div>
    </>
  );
}

export { FreightCalculatorPage };
