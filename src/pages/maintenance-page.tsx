import { confirmAlert } from "@hubble-ds/components/callables/confirm-alert-callable";
import { Button } from "@hubble-ds/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@hubble-ds/components/ui/card";
import { Field, FieldLabel } from "@hubble-ds/components/ui/field";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadDropzoneDescription,
  FileUploadDropzoneMedia,
  FileUploadDropzoneTitle,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from "@hubble-ds/components/ui/file-upload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@hubble-ds/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@hubble-ds/components/ui/tabs";
import { toast } from "@hubble-ds/components/ui/toast";
import {
  ArrowsLeftRightIcon,
  CalendarBlankIcon,
  CoinsIcon,
  type Icon,
  PlusMinusIcon,
  TreeStructureIcon,
  WarningCircleIcon,
  XIcon,
} from "@phosphor-icons/react";
import { type ComponentProps, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { DatePickerField } from "@/components/date-picker-field";
import { PageHeader } from "@/components/page-header";
import { EnumPlatformOptions } from "@/lib/enum/platform";
import { downloadCsv } from "@/lib/resource/format";
import {
  useDeadlineTableNameOptions,
  usePriceTableNameOptions,
} from "@/resources/freight-tables.resource";
import { useCustomerNameOptions } from "@/resources/registrations.resource";

const SYNC_TAB = "sincronizacoes";
const REPORTS_TAB = "relatorios";
const ALL_VALUES = "__all__";
const MAX_DNE_SIZE_BYTES = 200 * 1024 * 1024;

type MaintenanceTableUpdate = {
  key: string;
  title: string;
  icon: Icon;
  source: "price" | "deadline";
};

const tableUpdates: MaintenanceTableUpdate[] = [
  { key: "price-table", title: "Tabela de preços", icon: CoinsIcon, source: "price" },
  { key: "transfer-table", title: "Tabela de transferências", icon: ArrowsLeftRightIcon, source: "price" },
  { key: "intermediation-table", title: "Tabela de intermediação", icon: TreeStructureIcon, source: "price" },
  { key: "deadline-table", title: "Tabela de prazo", icon: CalendarBlankIcon, source: "deadline" },
  { key: "deadline-adjustment", title: "Adicionar/Reduzir prazo", icon: PlusMinusIcon, source: "deadline" },
];

const reportPeriods = ["Últimos 7 dias", "Últimos 30 dias", "Últimos 90 dias"];
const reportFormats = ["CSV", "XLSX"];
const activationTypes = ["Tabelas de preço", "Tabelas de prazo", "Serviços"];

function MaintenanceSelectField({
  id,
  label,
  value,
  onValueChange,
  options,
  placeholder = "Selecionar",
  "data-testid": testId,
  ...props
}: Readonly<
  ComponentProps<typeof Field> & {
    id: string;
    label: string;
    value: string;
    onValueChange: (value: string) => void;
    options: readonly { value: string; label: string }[];
    placeholder?: string;
    "data-testid": string;
  }
>) {
  return (
    <Field {...props}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger id={id} className="w-full" data-testid={testId}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  );
}

const toOptions = (values: readonly string[]) =>
  [...new Set(values)].map((value) => ({ value, label: value }));

function TableUpdateCard({
  update,
}: Readonly<{ update: MaintenanceTableUpdate }>) {
  const priceTables = usePriceTableNameOptions();
  const deadlineTables = useDeadlineTableNameOptions();
  const options = toOptions(
    update.source === "price" ? priceTables : deadlineTables,
  );
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const context = `maintenance-${update.key}`;

  const handleConfirm = async () => {
    if (!from || !to) {
      toast.error("Selecione a tabela de origem e a de destino.");
      return;
    }
    const confirmed = await confirmAlert({
      title: `Confirmar atualização de ${update.title.toLowerCase()}?`,
      description: `Todos os relacionamentos que usam "${from}" passarão a usar "${to}". A alteração é aplicada em cascata.`,
      actionText: "Confirmar atualização",
      ActionProps: { "data-testid": `${context}-confirm-button` },
      PopupProps: { "data-testid": `${context}-alert-dialog` },
    });
    if (!confirmed) return;
    toast.success(`${update.title}: atualização registrada.`);
    setFrom("");
    setTo("");
  };

  return (
    <Card data-testid={`${context}-card`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-xs">
          <update.icon className="size-5" />
          {update.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-md">
        <MaintenanceSelectField
          id={`${context}-from`}
          label="De"
          value={from}
          onValueChange={setFrom}
          options={options}
          data-testid={`${context}-from-select`}
        />
        <MaintenanceSelectField
          id={`${context}-to`}
          label="Para"
          value={to}
          onValueChange={setTo}
          options={options}
          data-testid={`${context}-to-select`}
        />
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={handleConfirm}
          data-testid={`${context}-submit-button`}
        >
          Confirmar atualização
        </Button>
      </CardFooter>
    </Card>
  );
}

function OccurrencesCard() {
  const handleForce = async () => {
    const confirmed = await confirmAlert({
      title: "Forçar atualização de ocorrências?",
      description:
        "As ocorrências de rastreio de todos os envios em aberto serão consultadas novamente nas transportadoras.",
      actionText: "Forçar atualização",
      ActionProps: { "data-testid": "maintenance-occurrences-confirm-button" },
      PopupProps: { "data-testid": "maintenance-occurrences-alert-dialog" },
    });
    if (confirmed) toast.success("Atualização de ocorrências iniciada.");
  };

  return (
    <Card data-testid="maintenance-occurrences-card">
      <CardHeader>
        <CardTitle>Forçar atualização de ocorrências</CardTitle>
        <CardDescription>
          Reprocessa o rastreio dos envios em aberto
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button
          variant="outline"
          className="w-full"
          onClick={handleForce}
          data-testid="maintenance-occurrences-submit-button"
        >
          Forçar atualização
        </Button>
      </CardFooter>
    </Card>
  );
}

function DneCard() {
  const [files, setFiles] = useState<File[]>([]);

  const handleUpdate = () => {
    toast.success(
      `Base DNE ${files[0]?.name} recebida. A atualização será processada em segundo plano.`,
    );
    setFiles([]);
  };

  return (
    <Card data-testid="maintenance-dne-card">
      <CardHeader>
        <CardTitle>Atualização DNE</CardTitle>
        <CardDescription>
          Base de CEPs dos Correios, em arquivo .zip
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FileUpload
          value={files}
          onValueChange={setFiles}
          maxFiles={1}
          maxSize={MAX_DNE_SIZE_BYTES}
          accept=".zip,application/zip"
          label="Arquivo DNE"
        >
          <FileUploadDropzone data-testid="maintenance-dne-dropzone">
            <FileUploadDropzoneMedia />
            <FileUploadDropzoneTitle>
              Arraste o arquivo .zip até aqui
            </FileUploadDropzoneTitle>
            <FileUploadDropzoneDescription>
              Um arquivo .zip de até 200 MB.
            </FileUploadDropzoneDescription>
            <FileUploadTrigger asChild>
              <Button
                variant="outline"
                size="small"
                data-testid="maintenance-dne-select-file-button"
              >
                Selecionar arquivo
              </Button>
            </FileUploadTrigger>
          </FileUploadDropzone>
          <FileUploadList>
            {files.map((file) => (
              <FileUploadItem key={`${file.name}-${file.size}`} value={file}>
                <FileUploadItemPreview />
                <FileUploadItemMetadata />
                <FileUploadItemDelete aria-label="Remover arquivo">
                  <XIcon />
                </FileUploadItemDelete>
              </FileUploadItem>
            ))}
          </FileUploadList>
        </FileUpload>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          disabled={files.length === 0}
          onClick={handleUpdate}
          data-testid="maintenance-dne-submit-button"
        >
          Atualizar DNE
        </Button>
      </CardFooter>
    </Card>
  );
}

function SynchronizationsTab() {
  return (
    <div
      className="flex min-h-0 flex-1 flex-col gap-md overflow-auto p-md"
      data-testid="maintenance-synchronizations"
    >
      <Card
        role="alert"
        className="shrink-0 border-border-destructive bg-destructive-background"
        data-testid="maintenance-warning-alert"
      >
        <CardContent className="flex items-start gap-xs">
          <WarningCircleIcon className="size-5 shrink-0 text-destructive-text" />
          <div className="flex flex-col gap-2xs">
            <CardTitle className="text-sm text-destructive-text">
              Esse ambiente deve ser usado com extremo cuidado.
            </CardTitle>
            <CardDescription className="text-sm text-destructive-text">
              Toda alteração realiza alterações em cascata no sistema, podendo
              quebrar a aplicação. Seus dados e ações serão gravados para
              monitoramento.
            </CardDescription>
          </div>
        </CardContent>
      </Card>
      <div className="grid shrink-0 grid-cols-auto-fit-64 gap-md">
        {tableUpdates.map((update) => (
          <TableUpdateCard key={update.key} update={update} />
        ))}
      </div>
      <div className="grid shrink-0 grid-cols-auto-fit-96 items-start gap-md">
        <OccurrencesCard />
        <DneCard />
      </div>
    </div>
  );
}

function NotificationErrorsCard() {
  const [startDate, setStartDate] = useState<Date | undefined>(
    new Date(2026, 10, 1),
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    new Date(2026, 10, 10),
  );
  const [platform, setPlatform] = useState(ALL_VALUES);
  const [format, setFormat] = useState("CSV");

  const handleGenerate = () => {
    if (!startDate || !endDate || startDate > endDate) {
      toast.error("Informe um período válido.");
      return;
    }
    downloadCsv(
      "erros-de-notificacao.csv",
      '"Data";"Plataforma";"Identificador";"Erro"',
    );
    toast.success(`Relatório de erros de notificação gerado em ${format}.`);
  };

  return (
    <Card data-testid="maintenance-notification-errors-card">
      <CardHeader>
        <CardTitle>Erros de notificação</CardTitle>
        <CardDescription>
          Gera o relatório de notificações com falha no período
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-md">
        <DatePickerField
          id="notification-errors-start-date"
          label="Data inicial"
          value={startDate}
          onValueChange={setStartDate}
          data-testid="maintenance-notification-errors-start-date-button"
        />
        <DatePickerField
          id="notification-errors-end-date"
          label="Data final"
          value={endDate}
          onValueChange={setEndDate}
          data-testid="maintenance-notification-errors-end-date-button"
        />
        <MaintenanceSelectField
          id="notification-errors-platform"
          label="Plataforma"
          value={platform}
          onValueChange={setPlatform}
          options={[
            { value: ALL_VALUES, label: "Todas" },
            ...EnumPlatformOptions.map((option) => ({
              value: option.value,
              label: option.caption,
            })),
          ]}
          data-testid="maintenance-notification-errors-platform-select"
        />
        <MaintenanceSelectField
          id="notification-errors-format"
          label="Formato"
          value={format}
          onValueChange={setFormat}
          options={toOptions(reportFormats)}
          data-testid="maintenance-notification-errors-format-select"
        />
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleGenerate}
          data-testid="maintenance-notification-errors-submit-button"
        >
          Gerar relatório
        </Button>
      </CardFooter>
    </Card>
  );
}

function ActivationCard() {
  const customers = useCustomerNameOptions();
  const [customer, setCustomer] = useState(ALL_VALUES);
  const [period, setPeriod] = useState("Últimos 30 dias");
  const [type, setType] = useState("Tabelas de preço");

  const handleExport = () => {
    downloadCsv(
      "ativacao-desativacao.csv",
      '"Data";"Cliente";"Tipo";"Registro";"Ação";"Usuário"',
    );
    toast.success(`Histórico de ${type.toLowerCase()} exportado.`);
  };

  return (
    <Card data-testid="maintenance-activation-card">
      <CardHeader>
        <CardTitle>Ativação / Desativação</CardTitle>
        <CardDescription>
          Histórico de ativação de tabelas e serviços
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-md">
        <MaintenanceSelectField
          id="activation-customer"
          label="Cliente"
          value={customer}
          onValueChange={setCustomer}
          options={[
            { value: ALL_VALUES, label: "Todos" },
            ...toOptions(customers),
          ]}
          data-testid="maintenance-activation-customer-select"
        />
        <MaintenanceSelectField
          id="activation-period"
          label="Período"
          value={period}
          onValueChange={setPeriod}
          options={toOptions(reportPeriods)}
          data-testid="maintenance-activation-period-select"
        />
        <MaintenanceSelectField
          id="activation-type"
          label="Tipo"
          value={type}
          onValueChange={setType}
          options={toOptions(activationTypes)}
          data-testid="maintenance-activation-type-select"
        />
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          onClick={handleExport}
          data-testid="maintenance-activation-export-button"
        >
          Exportar
        </Button>
      </CardFooter>
    </Card>
  );
}

function ReportsTab() {
  return (
    <div
      className="grid min-h-0 flex-1 grid-cols-auto-fit-96 content-start items-start gap-md overflow-auto p-md"
      data-testid="maintenance-reports"
    >
      <NotificationErrorsCard />
      <ActivationCard />
    </div>
  );
}

function MaintenancePage() {
  const navigate = useNavigate();
  const activeTab = useParams().tab ?? SYNC_TAB;

  return (
    <>
      <PageHeader title="Manutenção">
        <Tabs
          value={activeTab}
          onValueChange={(tab) => navigate(`/ferramentas/manutencao/${tab}`)}
          data-testid="maintenance-tabs"
        >
          <TabsList>
            <TabsTrigger
              value={SYNC_TAB}
              data-testid="maintenance-synchronizations-tab"
            >
              Sincronizações
            </TabsTrigger>
            <TabsTrigger
              value={REPORTS_TAB}
              data-testid="maintenance-reports-tab"
            >
              Relatórios
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </PageHeader>
      {activeTab === REPORTS_TAB ? <ReportsTab /> : <SynchronizationsTab />}
    </>
  );
}

export { MaintenancePage };
