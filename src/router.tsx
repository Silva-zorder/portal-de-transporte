import { SquaresFourIcon } from "@phosphor-icons/react";
import {
  createBrowserRouter,
  Navigate,
  type RouteObject,
} from "react-router";
import { AppShell } from "@/components/app-shell";
import { RecordPage, RecordWorkTabLabel } from "@/components/record-page";
import { ResourceListPage } from "@/components/resource-list-page";
import type { WorkTabHandle } from "@/components/workarea";
import { findNavigationItem } from "@/lib/navigation";
import type { AnyRecordDefinition } from "@/lib/resource/record";
import type { AnyResourceDefinition } from "@/lib/resource/types";
import { DashboardPage } from "@/pages/dashboard-page";
import { MaintenancePage } from "@/pages/maintenance-page";
import {
  profileRecord,
  profileResource,
  userRecord,
  userResource,
} from "@/resources/access.resource";
import {
  deadlineTableRecord,
  deadlineTableResource,
  priceTableRecord,
  priceTableResource,
  tableRelationResource,
} from "@/resources/freight-tables.resource";
import {
  billingDocumentResource,
  cteResource,
  reconciliationRecord,
  reconciliationResource,
} from "@/resources/magazord-envios.resource";
import {
  logResource,
  mongoSyncResource,
  notificationResource,
} from "@/resources/monitoring.resource";
import {
  carrierResource,
  carrierServiceResource,
  customerGroupRecord,
  customerGroupResource,
  customerMarketplaceRecord,
  customerMarketplaceResource,
  customerResource,
} from "@/resources/registrations.resource";

const listRoutes: { path: string; definition: AnyResourceDefinition }[] = [
  { path: "cadastros/transportadoras", definition: carrierResource },
  { path: "cadastros/transportadora-servico", definition: carrierServiceResource },
  { path: "cadastros/clientes", definition: customerResource },
  { path: "cadastros/marketplace", definition: customerMarketplaceResource },
  { path: "cadastros/grupos-de-clientes", definition: customerGroupResource },
  { path: "tabelas-de-frete/prazos", definition: deadlineTableResource },
  { path: "tabelas-de-frete/precos", definition: priceTableResource },
  { path: "tabelas-de-frete/relacionamento-de-tabelas", definition: tableRelationResource },
  { path: "magazord-envios/ctes", definition: cteResource },
  { path: "magazord-envios/conciliacoes-de-frete", definition: reconciliationResource },
  { path: "magazord-envios/documentos-de-cobranca", definition: billingDocumentResource },
  { path: "monitoramento/notificacoes", definition: notificationResource },
  { path: "monitoramento/sincronizacao-mongo-db", definition: mongoSyncResource },
  { path: "monitoramento/historico-de-registros", definition: logResource },
  { path: "acesso/usuarios", definition: userResource },
  { path: "acesso/perfis", definition: profileResource },
];

const recordRoutes: AnyRecordDefinition[] = [
  customerMarketplaceRecord,
  customerGroupRecord,
  deadlineTableRecord,
  priceTableRecord,
  reconciliationRecord,
  userRecord,
  profileRecord,
];

const navigationIcon = (path: string) =>
  findNavigationItem(path)?.icon ?? SquaresFourIcon;

const workTab = (workTabHandle: WorkTabHandle["workTab"]): WorkTabHandle => ({
  workTab: workTabHandle,
});

const workareaRoutes: RouteObject[] = [
  ...listRoutes.map(({ path, definition }) => ({
    path,
    element: <ResourceListPage key={definition.key} definition={definition} />,
    handle: workTab(() => ({
      key: `/${path}`,
      label: definition.title,
      icon: navigationIcon(`/${path}`),
    })),
  })),
  ...recordRoutes.map((record) => ({
    path: `${record.listPath.slice(1)}/:id/:tab?`,
    element: <RecordPage key={record.definition.key} record={record} />,
    handle: workTab((params) => ({
      key: `${record.listPath}/${params.id}`,
      label: <RecordWorkTabLabel record={record} id={Number(params.id)} />,
      icon: navigationIcon(record.listPath),
    })),
  })),
  {
    path: "ferramentas/manutencao/:tab?",
    element: <MaintenancePage />,
    handle: workTab(() => ({
      key: "/ferramentas/manutencao",
      label: "Manutenção",
      icon: navigationIcon("/ferramentas/manutencao"),
    })),
  },
  { path: "*", element: <Navigate to="/" replace /> },
];

const router = createBrowserRouter([
  {
    path: "/*",
    element: <AppShell routes={workareaRoutes} home={<DashboardPage />} />,
  },
]);

export { router };
