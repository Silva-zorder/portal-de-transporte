import magazordIcon from "@hubble-ds/assets/magazord-icon.svg";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@hubble-ds/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@hubble-ds/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from "@hubble-ds/components/ui/sidebar";
import { Switch } from "@hubble-ds/components/ui/switch";
import { toast } from "@hubble-ds/components/ui/toast";
import { useLocalStorage } from "@hubble-ds/hooks/use-local-storage";
import { CaretRightIcon, MoonIcon, SignOutIcon } from "@phosphor-icons/react";
import { type ReactNode, useEffect } from "react";
import { Link, type RouteObject, useLocation } from "react-router";
import { type NavigationGroup, navigationGroups } from "@/lib/navigation";
import { Workarea } from "./workarea";

function AppSidebarGroup({
  group,
  pathname,
}: Readonly<{ group: NavigationGroup; pathname: string }>) {
  const isGroupActive = group.items.some((item) =>
    pathname.startsWith(item.path),
  );

  return (
    <Collapsible
      asChild
      defaultOpen={isGroupActive}
      className="group/collapsible"
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            tooltip={group.label}
            data-testid={`sidebar-${group.key}-button`}
          >
            <group.icon />
            <span>{group.label}</span>
            <CaretRightIcon className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {group.items.map((item) => (
              <SidebarMenuSubItem key={item.key}>
                <SidebarMenuSubButton
                  asChild
                  isActive={pathname.startsWith(item.path)}
                >
                  <Link to={item.path} data-testid={`sidebar-${item.key}-link`}>
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

/** Usuário da sessão (mock até a integração com o Cognito). */
const sessionUser = { name: "Edgar Ferreira", initials: "EF", role: "Master" };

/** O tema escuro do Hubble é a classe `dark` no `<html>`; a escolha fica salva no navegador. */
function useDarkMode() {
  const [isDark, setIsDark] = useLocalStorage("portal-dark-mode", false);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);
  return [isDark, setIsDark] as const;
}

function AppSidebarFooter() {
  const [isDark, setIsDark] = useDarkMode();

  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <div
            className="flex items-center gap-xs p-3xs"
            title={`${sessionUser.name} · ${sessionUser.role}`}
            data-testid="sidebar-user"
          >
            <Avatar size="small">
              <AvatarFallback>{sessionUser.initials}</AvatarFallback>
            </Avatar>
            <span className="flex min-w-0 flex-col group-data-[collapsible=icon]:hidden">
              <span
                className="truncate text-sm font-medium text-text"
                data-testid="sidebar-user-name-text"
              >
                {sessionUser.name}
              </span>
              <span
                className="truncate typo-caption-1 text-muted-text"
                data-testid="sidebar-user-role-text"
              >
                {sessionUser.role}
              </span>
            </span>
          </div>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton asChild tooltip="Modo escuro">
            <label htmlFor="sidebar-dark-mode-switch" data-testid="sidebar-dark-mode-label">
              <MoonIcon />
              <span>Modo escuro</span>
              <Switch
                id="sidebar-dark-mode-switch"
                className="ml-auto"
                checked={isDark}
                onCheckedChange={setIsDark}
                data-testid="sidebar-dark-mode-switch"
              />
            </label>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton
            onClick={() =>
              toast.info("Sair encerra a sessão no portal em produção.")
            }
            tooltip="Sair"
            data-testid="sidebar-sign-out-button"
          >
            <SignOutIcon />
            <span>Sair</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
}

function AppShell({
  routes,
  home,
}: Readonly<{ routes: RouteObject[]; home: ReactNode }>) {
  const { pathname } = useLocation();

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" data-testid="sidebar">
        <SidebarHeader className="flex-row items-center gap-xs">
          <Link
            to="/"
            className="flex min-w-0 flex-1 items-center gap-xs group-data-[collapsible=icon]:hidden"
            data-testid="sidebar-home-link"
          >
            <Avatar shape="square">
              <AvatarImage src={magazordIcon} alt="Magazord" />
              <AvatarFallback>MZ</AvatarFallback>
            </Avatar>
            <span className="truncate text-sm font-medium text-text">
              Portal de transportes
            </span>
          </Link>
          <SidebarTrigger
            variant="ghost"
            size="small"
            data-testid="sidebar-toggle-button"
          />
        </SidebarHeader>
        <SidebarSeparator />
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigationGroups.map((group) => (
                  <AppSidebarGroup
                    key={group.key}
                    group={group}
                    pathname={pathname}
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <AppSidebarFooter />
      </Sidebar>
      <SidebarInset className="h-svh min-w-0 overflow-hidden">
        <Workarea routes={routes} home={home} />
      </SidebarInset>
    </SidebarProvider>
  );
}

export { AppShell };
