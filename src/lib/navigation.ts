import {
  BellIcon,
  CalculatorIcon,
  CalendarBlankIcon,
  ClockCounterClockwiseIcon,
  DatabaseIcon,
  FileTextIcon,
  FolderSimpleIcon,
  IdentificationCardIcon,
  LinkSimpleIcon,
  LockKeyIcon,
  PaperPlaneTiltIcon,
  PulseIcon,
  ReceiptIcon,
  ScalesIcon,
  StorefrontIcon,
  TableIcon,
  TruckIcon,
  TruckTrailerIcon,
  UserIcon,
  UsersIcon,
  UsersThreeIcon,
  WrenchIcon,
  type Icon,
} from "@phosphor-icons/react";

type NavigationItem = { key: string; label: string; path: string; icon: Icon };
type NavigationGroup = {
  key: string;
  label: string;
  icon: Icon;
  items: NavigationItem[];
};

const navigationGroups: NavigationGroup[] = [
  {
    key: "registrations",
    label: "Cadastros",
    icon: FolderSimpleIcon,
    items: [
      { key: "carriers", label: "Transportadoras", path: "/cadastros/transportadoras", icon: TruckIcon },
      { key: "carrier-services", label: "Transportadora serviço", path: "/cadastros/transportadora-servico", icon: TruckTrailerIcon },
      { key: "customers", label: "Clientes", path: "/cadastros/clientes", icon: UsersIcon },
      { key: "marketplaces", label: "Marketplace", path: "/cadastros/marketplace", icon: StorefrontIcon },
      { key: "customer-groups", label: "Grupos de clientes", path: "/cadastros/grupos-de-clientes", icon: UsersThreeIcon },
    ],
  },
  {
    key: "freight-tables",
    label: "Tabelas de frete",
    icon: TableIcon,
    items: [
      { key: "deadline-tables", label: "Prazos", path: "/tabelas-de-frete/prazos", icon: CalendarBlankIcon },
      { key: "price-tables", label: "Preços", path: "/tabelas-de-frete/precos", icon: TableIcon },
      { key: "table-relations", label: "Relacionamento de tabelas", path: "/tabelas-de-frete/relacionamento-de-tabelas", icon: LinkSimpleIcon },
    ],
  },
  {
    key: "magazord-envios",
    label: "Magazord Envios",
    icon: PaperPlaneTiltIcon,
    items: [
      { key: "ctes", label: "CTEs", path: "/magazord-envios/ctes", icon: FileTextIcon },
      { key: "reconciliations", label: "Conciliações de frete", path: "/magazord-envios/conciliacoes-de-frete", icon: ScalesIcon },
      { key: "billing-documents", label: "Documentos de cobrança", path: "/magazord-envios/documentos-de-cobranca", icon: ReceiptIcon },
    ],
  },
  {
    key: "monitoring",
    label: "Monitoramento",
    icon: PulseIcon,
    items: [
      { key: "notifications", label: "Notificações", path: "/monitoramento/notificacoes", icon: BellIcon },
      { key: "mongo-syncs", label: "Sincronização Mongo DB", path: "/monitoramento/sincronizacao-mongo-db", icon: DatabaseIcon },
      { key: "logs", label: "Logs", path: "/monitoramento/logs", icon: ClockCounterClockwiseIcon },
    ],
  },
  {
    key: "access",
    label: "Acesso",
    icon: LockKeyIcon,
    items: [
      { key: "users", label: "Usuários", path: "/acesso/usuarios", icon: UserIcon },
      { key: "profiles", label: "Perfis", path: "/acesso/perfis", icon: IdentificationCardIcon },
    ],
  },
  {
    key: "tools",
    label: "Ferramentas",
    icon: WrenchIcon,
    items: [
      { key: "maintenance", label: "Manutenção", path: "/ferramentas/manutencao", icon: WrenchIcon },
      { key: "freight-calculator", label: "Calculadora de frete", path: "/ferramentas/calculadora-de-frete", icon: CalculatorIcon },
    ],
  },
];

const navigationItems = navigationGroups.flatMap((group) => group.items);

function findNavigationItem(path: string) {
  return navigationItems.find((item) => item.path === path);
}

export {
  findNavigationItem,
  type NavigationGroup,
  type NavigationItem,
  navigationGroups,
};
