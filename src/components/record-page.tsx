import { confirmAlert } from "@hubble-ds/components/callables/confirm-alert-callable";
import { Badge } from "@hubble-ds/components/ui/badge";
import { Button } from "@hubble-ds/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@hubble-ds/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@hubble-ds/components/ui/empty";
import { Skeleton } from "@hubble-ds/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@hubble-ds/components/ui/tabs";
import { toast } from "@hubble-ds/components/ui/toast";
import {
  ArrowRightIcon,
  PencilSimpleIcon,
  PlusCircleIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import type { ReactNode } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { formatInteger } from "@/lib/resource/format";
import type { AnyRecordDefinition, RecordTab } from "@/lib/resource/record";
import type { ResourceRecord } from "@/lib/resource/types";
import { PageHeader } from "./page-header";
import { ResourceReadOnlyFields } from "./resource-fields";
import {
  ResourceFormOverlay,
  useResourceFormController,
} from "./resource-form";
import { ResourceList } from "./resource-list";
import { useWorkarea } from "./workarea";

const OVERVIEW_TAB = "visao-geral";
const useNoMutation = () => undefined;

const cardSpanClassNames: Record<"full" | "half", string> = {
  full: "col-span-2",
  half: "col-span-2 xl:col-span-1",
};

function useRecordTabCount(tab: RecordTab, parentId: number) {
  const query = tab.definition.hooks.useFetchAll({
    filters: { [tab.parentKey]: parentId },
  });
  return query.data?.length;
}

function RecordTabTrigger({
  tab,
  parentId,
  context,
}: Readonly<{ tab: RecordTab; parentId: number; context: string }>) {
  const count = useRecordTabCount(tab, parentId);
  return (
    <TabsTrigger value={tab.key} data-testid={`${context}-${tab.key}-tab`}>
      {tab.label}
      {count !== undefined && (
        <Badge
          variant="secondary"
          data-testid={`${context}-${tab.key}-count-badge`}
        >
          {formatInteger(count)}
        </Badge>
      )}
    </TabsTrigger>
  );
}

function RecordSummaryCard({
  tab,
  parentId,
  to,
  context,
}: Readonly<{
  tab: RecordTab;
  parentId: number;
  to: string;
  context: string;
}>) {
  const count = useRecordTabCount(tab, parentId);
  return (
    <Card data-testid={`${context}-${tab.key}-summary-card`}>
      <CardHeader>
        <CardTitle>{tab.label}</CardTitle>
        <CardDescription>
          {count === undefined ? "Carregando…" : tab.summary(count)}
        </CardDescription>
        <CardAction>
          <Button
            asChild
            variant="outline"
            size="small"
            data-testid={`${context}-${tab.key}-summary-link`}
          >
            <Link to={to}>
              {tab.linkLabel}
              <ArrowRightIcon />
            </Link>
          </Button>
        </CardAction>
      </CardHeader>
    </Card>
  );
}

function RecordChildTab({
  tab,
  parentId,
  parent,
  renderHeader,
}: Readonly<{
  tab: RecordTab;
  parentId: number;
  parent: ResourceRecord | undefined;
  renderHeader: (actions: ReactNode) => ReactNode;
}>) {
  const controller = useResourceFormController();
  const CreateIcon = tab.definition.createIcon ?? PlusCircleIcon;

  return (
    <>
      {renderHeader(
        tab.definition.createLabel && (
          <Button
            onClick={controller.openCreate}
            data-testid={`${tab.definition.key}-create-button`}
          >
            <CreateIcon />
            {tab.definition.createLabel}
          </Button>
        ),
      )}
      <ResourceList
        definition={tab.definition}
        controller={controller}
        parentFilters={{ [tab.parentKey]: parentId }}
        parentValues={parent && tab.parentValues?.(parent)}
      />
    </>
  );
}

function RecordPage({
  record: recordDefinition,
}: Readonly<{ record: AnyRecordDefinition }>) {
  const { definition, listPath } = recordDefinition;
  const params = useParams();
  const navigate = useNavigate();
  const workarea = useWorkarea();
  const id = Number(params.id);
  const activeTab = params.tab ?? OVERVIEW_TAB;
  const context = `${definition.key}-record`;
  const recordPath = `${listPath}/${id}`;

  const query = recordDefinition.useFindById({ id });
  const removeMutation = (definition.hooks.useRemove ?? useNoMutation)();
  const controller = useResourceFormController();
  const record = query.data;

  const handleRemove = async (current: ResourceRecord) => {
    const confirmed = await confirmAlert({
      title: `Excluir ${definition.noun}?`,
      description: `${definition.describe(current)} será removid${definition.article}. Essa ação não pode ser desfeita.`,
      actionText: "Excluir",
      ActionProps: {
        variant: "destructive",
        "data-testid": `${context}-remove-confirm-button`,
      },
      PopupProps: { "data-testid": `${context}-remove-alert-dialog` },
    });
    if (!confirmed) return;
    try {
      await removeMutation?.mutateAsync({ id: current.id });
      toast.success(`${definition.describe(current)} excluíd${definition.article}.`);
      workarea.closeTabs([recordPath], listPath);
    } catch {
      toast.error("Não foi possível excluir. Tente novamente.");
    }
  };

  if (query.isError) {
    return (
      <>
        <PageHeader title={definition.title} />
        <Empty data-testid={`${context}-not-found`}>
          <EmptyHeader>
            <EmptyTitle>Registro não encontrado.</EmptyTitle>
          </EmptyHeader>
          <EmptyContent>
            <EmptyDescription>
              {capitalizeFirst(definition.noun)} {id} não existe ou foi excluíd
              {definition.article}.
            </EmptyDescription>
            <Button asChild variant="outline">
              <Link to={listPath}>Voltar para {definition.title}</Link>
            </Button>
          </EmptyContent>
        </Empty>
      </>
    );
  }

  const childTab = recordDefinition.tabs.find((tab) => tab.key === activeTab);
  const primaryAction = recordDefinition.primaryAction;

  const renderHeader = (actions: ReactNode) => (
    <PageHeader
      title={
        record ? (
          recordDefinition.title(record)
        ) : (
          <Skeleton className="h-xl w-10xl" />
        )
      }
      badge={
        record && (
          <Badge variant="secondary" data-testid={`${context}-status-badge`}>
            {recordDefinition.status(record)}
          </Badge>
        )
      }
      actions={record && actions}
    >
      <Tabs
        value={activeTab}
        onValueChange={(tab) =>
          navigate(tab === OVERVIEW_TAB ? recordPath : `${recordPath}/${tab}`)
        }
        data-testid={`${context}-tabs`}
      >
        <TabsList>
          <TabsTrigger
            value={OVERVIEW_TAB}
            data-testid={`${context}-overview-tab`}
          >
            Visão geral
          </TabsTrigger>
          {recordDefinition.tabs.map((tab) => (
            <RecordTabTrigger
              key={tab.key}
              tab={tab}
              parentId={id}
              context={context}
            />
          ))}
        </TabsList>
      </Tabs>
    </PageHeader>
  );

  if (childTab) {
    return (
      <RecordChildTab
        key={childTab.key}
        tab={childTab}
        parentId={id}
        parent={record}
        renderHeader={renderHeader}
      />
    );
  }

  return (
    <>
      {renderHeader(
        record && (
          <>
            {definition.hooks.useRemove && (
              <Button
                variant="outline"
                onClick={() => handleRemove(record)}
                data-testid={`${context}-remove-button`}
              >
                <TrashIcon />
                Excluir
              </Button>
            )}
            {primaryAction ? (
              <Button
                onClick={() => primaryAction.run(record)}
                data-testid={`${context}-${primaryAction.key}-button`}
              >
                <primaryAction.icon />
                {primaryAction.label}
              </Button>
            ) : (
              <Button
                onClick={() => controller.openEdit(record)}
                data-testid={`${context}-edit-button`}
              >
                <PencilSimpleIcon />
                {recordDefinition.editLabel}
              </Button>
            )}
          </>
        ),
      )}
      <div
        className="flex min-h-0 flex-1 flex-col gap-md overflow-auto p-md"
        data-testid={`${context}-overview`}
      >
        {recordDefinition.tabs.length > 0 && (
          <div className="grid shrink-0 grid-cols-auto-fit-96 gap-md">
            {recordDefinition.tabs.map((tab) => (
              <RecordSummaryCard
                key={tab.key}
                tab={tab}
                parentId={id}
                to={`${recordPath}/${tab.key}`}
                context={context}
              />
            ))}
          </div>
        )}
        <div className="grid shrink-0 grid-cols-2 items-start gap-md">
          {recordDefinition.cards.map((card) => (
            <Card
              key={card.key}
              className={cardSpanClassNames[card.span]}
              data-testid={`${context}-${card.key}-card`}
            >
              <CardHeader>
                <CardTitle>{card.title}</CardTitle>
                <CardDescription>{card.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {record ? (
                  <ResourceReadOnlyFields
                    fields={card.fields}
                    record={record}
                    context={`${context}-${card.key}`}
                  />
                ) : (
                  <Skeleton className="h-7xl w-full" />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <ResourceFormOverlay definition={definition} controller={controller} />
    </>
  );
}

function RecordWorkTabLabel({
  record: recordDefinition,
  id,
}: Readonly<{ record: AnyRecordDefinition; id: number }>) {
  const { data } = recordDefinition.useFindById({ id });
  if (data) {
    return (
      recordDefinition.workTabTitle?.(data) ??
      `${recordDefinition.definition.title} · ${recordDefinition.title(data)}`
    );
  }
  return `${capitalizeFirst(recordDefinition.definition.noun)} ${id}`;
}

function capitalizeFirst(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export { RecordPage, RecordWorkTabLabel };
