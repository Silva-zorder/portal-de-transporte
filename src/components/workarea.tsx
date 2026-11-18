import { Button } from "@hubble-ds/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@hubble-ds/components/ui/context-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@hubble-ds/components/ui/dropdown-menu";
import { IconButton } from "@hubble-ds/components/ui/icon-button";
import { Tabs, TabsList, TabsTrigger } from "@hubble-ds/components/ui/tabs";
import { CaretDownIcon, type Icon, XIcon } from "@phosphor-icons/react";
import { cn } from "cn";
import {
  Activity,
  createContext,
  type MouseEvent,
  type ReactNode,
  type RefObject,
  use,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  createPath,
  type Location,
  matchRoutes,
  Navigate,
  type Params,
  parsePath,
  type RouteObject,
  useLocation,
  useNavigate,
  useRoutes,
} from "react-router";

const HOME_PATH = "/";
const STORAGE_KEY = "portal-de-transporte:work-tabs";
const MIDDLE_MOUSE_BUTTON = 1;

type WorkTabDescriptor = {
  /** Caminho-raiz da aba: módulo (`/cadastros/clientes`) ou registro (`/cadastros/clientes/1234`). */
  key: string;
  label: ReactNode;
  icon: Icon;
};

type WorkTabHandle = { workTab: (params: Params) => WorkTabDescriptor };

type WorkTabLocation = Pick<Location, "pathname" | "search" | "hash">;

type WorkTab = WorkTabDescriptor & { location: WorkTabLocation };

type WorkareaContextValue = {
  /** Fecha as abas e, se `to` for informado, navega para ele em vez da aba vizinha. */
  closeTabs: (keys: string[], to?: string) => void;
};

const WorkareaContext = createContext<WorkareaContextValue | null>(null);

function resolveWorkTab(
  routes: RouteObject[],
  location: WorkTabLocation,
): WorkTab | undefined {
  const match = matchRoutes(routes, location.pathname)?.findLast(
    (candidate) => (candidate.route.handle as WorkTabHandle | undefined)?.workTab,
  );
  if (!match) return undefined;
  const descriptor = (match.route.handle as WorkTabHandle).workTab(match.params);
  return { ...descriptor, location };
}

function upsertWorkTab(tabs: WorkTab[], tab: WorkTab | undefined) {
  if (!tab) return tabs;
  const index = tabs.findIndex((current) => current.key === tab.key);
  if (index === -1) return [...tabs, tab];
  if (createPath(tabs[index].location) === createPath(tab.location)) return tabs;
  return tabs.with(index, tab);
}

function restoreWorkTabs(routes: RouteObject[]) {
  let paths: unknown = [];
  try {
    paths = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    paths = [];
  }
  return (Array.isArray(paths) ? paths : [])
    .filter((path): path is string => typeof path === "string")
    .map((path) => resolveWorkTab(routes, toWorkTabLocation(path)))
    .reduce<WorkTab[]>(upsertWorkTab, []);
}

function persistWorkTabs(tabs: WorkTab[]) {
  try {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(tabs.map((tab) => createPath(tab.location))),
    );
  } catch {
    // Sem sessionStorage (modo privado ou bloqueado) as abas só não sobrevivem ao reload.
  }
}

function toWorkTabLocation(path: string): WorkTabLocation {
  const { pathname = "/", search = "", hash = "" } = parsePath(path);
  return { pathname, search, hash };
}

function toTestId(key: string) {
  return key.replace(/^\//, "").replaceAll("/", "-");
}

/**
 * Abas que não cabem na barra vão para o menu "+N". As larguras são medidas enquanto a aba está
 * visível e guardadas, porque uma aba escondida (`display: none`) mede zero.
 */
function useOverflowingTabs(
  tabs: WorkTab[],
  activeKey: string | undefined,
  listRef: RefObject<HTMLDivElement | null>,
  overflowRef: RefObject<HTMLButtonElement | null>,
) {
  const itemRefs = useRef(new Map<string, HTMLElement>());
  const widths = useRef(new Map<string, number>());
  const [hiddenKeys, setHiddenKeys] = useState<string[]>([]);

  const measure = () => {
    const list = listRef.current;
    if (!list) return;
    for (const [key, element] of itemRefs.current) {
      if (element.offsetWidth > 0) widths.current.set(key, element.offsetWidth);
    }
    const overflowWidth = overflowRef.current?.offsetWidth ?? 0;
    if (overflowWidth > 0) widths.current.set("overflow", overflowWidth);

    const style = getComputedStyle(list);
    const gap = Number.parseFloat(style.columnGap) || 0;
    const available =
      list.clientWidth -
      Number.parseFloat(style.paddingLeft) -
      Number.parseFloat(style.paddingRight);
    const widthOf = (keys: string[]) =>
      keys.reduce((total, key) => total + (widths.current.get(key) ?? 0), 0) +
      gap * Math.max(keys.length - 1, 0);

    const keys = tabs.map((tab) => tab.key);
    let visible = keys;
    if (widthOf(keys) > available) {
      const budget = available - (widths.current.get("overflow") ?? 0) - gap;
      visible = [];
      for (const key of keys) {
        if (widthOf([...visible, key]) > budget) break;
        visible.push(key);
      }
      if (activeKey && !visible.includes(activeKey)) {
        while (visible.length > 0 && widthOf([...visible, activeKey]) > budget) {
          visible.pop();
        }
        visible.push(activeKey);
      }
    }
    const next = keys.filter((key) => !visible.includes(key));
    setHiddenKeys((current) =>
      current.length === next.length && current.every((key, index) => key === next[index])
        ? current
        : next,
    );
  };

  useLayoutEffect(measure);

  useEffect(() => {
    const observer = new ResizeObserver(() => measure());
    if (listRef.current) observer.observe(listRef.current);
    for (const element of itemRefs.current.values()) observer.observe(element);
    return () => observer.disconnect();
  });

  const registerItem = (key: string) => (element: HTMLElement | null) => {
    if (element) itemRefs.current.set(key, element);
    else itemRefs.current.delete(key);
  };

  return { hiddenKeys, registerItem };
}

function useWorkarea() {
  const context = use(WorkareaContext);
  if (!context) throw new Error("useWorkarea precisa estar dentro de <Workarea>.");
  return context;
}

function WorkTabPanel({
  routes,
  location,
}: Readonly<{ routes: RouteObject[]; location: WorkTabLocation }>) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {useRoutes(routes, location)}
    </div>
  );
}

function WorkTabItem({
  tab,
  isActive,
  isHidden,
  itemRef,
  hasOthers,
  hasTabsToTheRight,
  onClose,
  onCloseOthers,
  onCloseToTheRight,
  onCloseAll,
}: Readonly<{
  tab: WorkTab;
  isActive: boolean;
  isHidden: boolean;
  itemRef: (element: HTMLElement | null) => void;
  hasOthers: boolean;
  hasTabsToTheRight: boolean;
  onClose: () => void;
  onCloseOthers: () => void;
  onCloseToTheRight: () => void;
  onCloseAll: () => void;
}>) {
  const testId = `workarea-${toTestId(tab.key)}`;

  const handleAuxClick = (event: MouseEvent) => {
    if (event.button !== MIDDLE_MOUSE_BUTTON) return;
    event.preventDefault();
    onClose();
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <span
          ref={itemRef}
          className={cn("group/work-tab relative flex shrink-0", isHidden && "hidden")}
        >
          <TabsTrigger
            value={tab.key}
            className={cn(
              "h-9 flex-none justify-start gap-xs! rounded-t-md! rounded-b-none! px-sm! py-xs! leading-5",
              "border border-b-0! border-transparent font-normal! text-muted-text",
              // Mantém o fundo de hover enquanto o cursor está sobre o botão de fechar (irmão do trigger).
              "not-data-active:group-hover/work-tab:bg-accent-2",
              "data-active:border-border-100! data-active:font-medium! data-active:text-text! data-active:shadow-none!",
            )}
            onAuxClick={handleAuxClick}
            data-testid={`${testId}-tab`}
          >
            <tab.icon />
            <span className="max-w-50 truncate">{tab.label}</span>
          </TabsTrigger>
          {/* Degradê com a cor de fundo da aba (ativa ou em hover), para o botão cobrir o fim do texto. */}
          <span
            aria-hidden
            className={cn(
              "pointer-events-none absolute top-1/2 right-px h-6 w-12 -translate-y-1/2 bg-linear-to-r to-30% opacity-0 group-hover/work-tab:opacity-100 group-has-focus-visible/work-tab:opacity-100",
              isActive ? "from-background/0 to-background" : "from-accent-2/0 to-accent-2",
            )}
          />
          <IconButton
            variant="ghost"
            size="mini"
            title="Fechar aba"
            className="absolute top-1/2 right-xs size-6 -translate-y-1/2 opacity-0 group-hover/work-tab:opacity-100 focus-visible:opacity-100"
            onClick={onClose}
            data-testid={`${testId}-close-button`}
          >
            <XIcon className="size-4 fill-text!" />
            <span className="sr-only">Fechar aba</span>
          </IconButton>
        </span>
      </ContextMenuTrigger>
      <ContextMenuContent data-testid={`${testId}-context-menu`}>
        <ContextMenuGroup>
          <ContextMenuItem
            onSelect={onClose}
            data-testid={`${testId}-close-menu-item`}
          >
            Fechar aba
          </ContextMenuItem>
          <ContextMenuItem
            disabled={!hasOthers}
            onSelect={onCloseOthers}
            data-testid={`${testId}-close-others-menu-item`}
          >
            Fechar outras abas
          </ContextMenuItem>
          <ContextMenuItem
            disabled={!hasTabsToTheRight}
            onSelect={onCloseToTheRight}
            data-testid={`${testId}-close-right-menu-item`}
          >
            Fechar abas à direita
          </ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuItem
          onSelect={onCloseAll}
          data-testid={`${testId}-close-all-menu-item`}
        >
          Fechar todas as abas
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

function WorkTabOverflowMenu({
  tabs,
  triggerRef,
  isHidden,
  onSelect,
}: Readonly<{
  tabs: WorkTab[];
  triggerRef: RefObject<HTMLButtonElement | null>;
  isHidden: boolean;
  onSelect: (tab: WorkTab) => void;
}>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          ref={triggerRef}
          variant="ghost"
          className={cn(
            "h-9 shrink-0 gap-2xs! rounded-t-sm! rounded-b-none! border-0! px-xs! py-xs! text-sm leading-5 font-medium text-muted-text",
            isHidden && "invisible absolute",
          )}
          aria-hidden={isHidden || undefined}
          tabIndex={isHidden ? -1 : undefined}
          data-testid="workarea-overflow-button"
        >
          +{tabs.length}
          <CaretDownIcon />
          <span className="sr-only">abas ocultas</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" data-testid="workarea-overflow-menu">
        <DropdownMenuGroup>
          {tabs.map((tab) => (
            <DropdownMenuItem
              key={tab.key}
              onSelect={() => onSelect(tab)}
              data-testid={`workarea-overflow-${toTestId(tab.key)}-menu-item`}
            >
              <tab.icon data-icon="inline-start" />
              {tab.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function Workarea({
  routes,
  home,
}: Readonly<{
  routes: RouteObject[];
  /** Tela mostrada em `/`, sem aba: a carga inicial e o estado depois de fechar todas as abas. */
  home: ReactNode;
}>) {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === HOME_PATH;
  const currentTab = isHome ? undefined : resolveWorkTab(routes, location);

  const [tabs, setTabs] = useState(() =>
    upsertWorkTab(restoreWorkTabs(routes), currentTab),
  );
  const [syncedLocation, setSyncedLocation] = useState(location);
  if (syncedLocation !== location) {
    setSyncedLocation(location);
    setTabs((current) => upsertWorkTab(current, currentTab));
  }

  useEffect(() => persistWorkTabs(tabs), [tabs]);

  const activeKey = currentTab?.key;
  const listRef = useRef<HTMLDivElement>(null);
  const overflowRef = useRef<HTMLButtonElement>(null);
  const { hiddenKeys, registerItem } = useOverflowingTabs(
    tabs,
    activeKey,
    listRef,
    overflowRef,
  );

  const openTab = (tab: WorkTab) => navigate(createPath(tab.location));

  const closeTabs = (keys: string[], to?: string) => {
    const closing = new Set(keys);
    if (to) {
      navigate(to);
    } else if (activeKey && closing.has(activeKey)) {
      const activeIndex = tabs.findIndex((tab) => tab.key === activeKey);
      const isOpen = (tab: WorkTab) => !closing.has(tab.key);
      const neighbor =
        tabs.slice(activeIndex + 1).find(isOpen) ??
        tabs.slice(0, activeIndex).findLast(isOpen);
      navigate(neighbor ? createPath(neighbor.location) : HOME_PATH);
    }
    setTabs((current) => current.filter((tab) => !closing.has(tab.key)));
  };

  const tabKeys = tabs.map((tab) => tab.key);
  const hiddenTabs = tabs.filter((tab) => hiddenKeys.includes(tab.key));

  return (
    <WorkareaContext value={{ closeTabs }}>
      {tabs.length > 0 && (
        <Tabs
          value={activeKey ?? ""}
          onValueChange={(key) => {
            const tab = tabs.find((current) => current.key === key);
            if (tab) openTab(tab);
          }}
          className="shrink-0"
          data-testid="workarea-tab-bar"
        >
          <TabsList
            ref={listRef}
            aria-label="Abas de trabalho"
            className="relative flex w-full items-end justify-start gap-2xs overflow-hidden rounded-none px-md! pt-xs! pb-0!"
            data-testid="workarea-tabs-list"
          >
            {tabs.map((tab, index) => {
              const toTheRight = tabKeys.slice(index + 1);
              return (
                <WorkTabItem
                  key={tab.key}
                  tab={tab}
                  isActive={tab.key === activeKey}
                  isHidden={hiddenKeys.includes(tab.key)}
                  itemRef={registerItem(tab.key)}
                  hasOthers={tabs.length > 1}
                  hasTabsToTheRight={toTheRight.length > 0}
                  onClose={() => closeTabs([tab.key])}
                  onCloseOthers={() =>
                    closeTabs(
                      tabKeys.filter((key) => key !== tab.key),
                      createPath(tab.location),
                    )
                  }
                  onCloseToTheRight={() => closeTabs(toTheRight)}
                  onCloseAll={() => closeTabs(tabKeys)}
                />
              );
            })}
            <WorkTabOverflowMenu
              tabs={hiddenTabs}
              triggerRef={overflowRef}
              isHidden={hiddenTabs.length === 0}
              onSelect={openTab}
            />
          </TabsList>
        </Tabs>
      )}
      {tabs.map((tab) => (
        <Activity key={tab.key} mode={tab.key === activeKey ? "visible" : "hidden"}>
          <WorkTabPanel routes={routes} location={tab.location} />
        </Activity>
      ))}
      {isHome && home}
      {!isHome && !currentTab && <Navigate to={HOME_PATH} replace />}
    </WorkareaContext>
  );
}

export {
  useWorkarea,
  Workarea,
  type WorkTabDescriptor,
  type WorkTabHandle,
};
