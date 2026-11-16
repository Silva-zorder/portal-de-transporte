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
import { toast } from "@hubble-ds/components/ui/toast";
import { CaretRightIcon, SignOutIcon } from "@phosphor-icons/react";
import type { ReactNode } from "react";
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
            <span className="flex min-w-0 flex-col">
              <span className="truncate text-sm font-medium text-text">
                Portal de transportes
              </span>
              <span className="truncate typo-caption-1 text-muted-text">
                Edgar Ferreira
              </span>
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
        <SidebarFooter>
          <SidebarMenu>
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
      </Sidebar>
      <SidebarInset className="h-svh min-w-0 overflow-hidden">
        <Workarea routes={routes} home={home} />
      </SidebarInset>
    </SidebarProvider>
  );
}

export { AppShell };
