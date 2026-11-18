import { confirmAlert } from "@hubble-ds/components/callables/confirm-alert-callable";
import { toast } from "@hubble-ds/components/ui/toast";
import { KeyIcon, UserCirclePlusIcon } from "@phosphor-icons/react";
import { useProfileCreateMutation } from "@/hooks/use-profile-create-mutation";
import { useProfileFetchAllQuery } from "@/hooks/use-profile-fetch-all-query";
import { useProfileFindByIdQuery } from "@/hooks/use-profile-find-by-id-query";
import { useProfileRouteFetchAllQuery } from "@/hooks/use-profile-route-fetch-all-query";
import { useProfileRemoveMutation } from "@/hooks/use-profile-remove-mutation";
import { useProfileUpdateMutation } from "@/hooks/use-profile-update-mutation";
import { useUserCreateMutation } from "@/hooks/use-user-create-mutation";
import { useUserFetchAllQuery } from "@/hooks/use-user-fetch-all-query";
import { useUserFindByIdQuery } from "@/hooks/use-user-find-by-id-query";
import { useUserGroupCreateMutation } from "@/hooks/use-user-group-create-mutation";
import { useUserGroupFetchAllQuery } from "@/hooks/use-user-group-fetch-all-query";
import { useUserGroupRemoveMutation } from "@/hooks/use-user-group-remove-mutation";
import { useUserProfileCreateMutation } from "@/hooks/use-user-profile-create-mutation";
import { useUserProfileFetchAllQuery } from "@/hooks/use-user-profile-fetch-all-query";
import { useUserProfileRemoveMutation } from "@/hooks/use-user-profile-remove-mutation";
import { useUserRemoveMutation } from "@/hooks/use-user-remove-mutation";
import { useUserUpdateMutation } from "@/hooks/use-user-update-mutation";
import { EnumPlatformOptions } from "@/lib/enum/platform";
import { EnumUserTypeOptions } from "@/lib/enum/user-type";
import { formatInteger, formatStatus } from "@/lib/resource/format";
import { defineRecord } from "@/lib/resource/record";
import { defineResource } from "@/lib/resource/types";
import type { Profile } from "@/services/portal/v1/profile.service";
import type { ProfileRoute } from "@/services/portal/v1/profile-route.service";
import type { User } from "@/services/portal/v1/user.service";
import type { UserGroup } from "@/services/portal/v1/user-group.service";
import type { UserProfile } from "@/services/portal/v1/user-profile.service";

const platformOptions = EnumPlatformOptions.map((option) => option.value);
const userTypeOptions = EnumUserTypeOptions.map((option) => option.value);
const userGroupOptions = ["Operação", "Financeiro", "Suporte", "Comercial"];

const NO_OPTIONS: readonly string[] = [];

function useProfileNameOptions() {
  const names = useProfileFetchAllQuery().data?.map((profile) => profile.name);
  return names ? [...new Set(names)] : NO_OPTIONS;
}

const userGroupResource = defineResource<UserGroup>({
  key: "user-groups",
  title: "Grupos",
  noun: "grupo",
  article: "o",
  describe: (group) => `Grupo ${group.description}`,
  hooks: {
    useFetchAll: useUserGroupFetchAllQuery,
    useCreate: useUserGroupCreateMutation,
    useRemove: useUserGroupRemoveMutation,
  },
  columns: [
    { key: "id", header: "ID", size: 96 },
    { key: "description", header: "Descrição" },
    { key: "platform", header: "Plataforma", filterable: true },
  ],
  searchKeys: ["id", "description"],
  searchPlaceholder: "Pesquisar grupo...",
  toolbar: ["export", "import"],
  createLabel: "Adicionar grupo",
  form: {
    kind: "dialog",
    createTitle: "Adicionar grupo ao usuário",
    editTitle: (group) => `Editar grupo · ${group.description}`,
    defaults: { userId: 0, description: "", platform: "MZ" },
    fields: [
      { name: "description", label: "Grupo", kind: "select", options: userGroupOptions, required: true },
      { name: "platform", label: "Plataforma", kind: "select", options: platformOptions, required: true },
    ],
  },
});

const userProfileResource = defineResource<UserProfile>({
  key: "user-profiles",
  title: "Perfis",
  noun: "perfil",
  article: "o",
  describe: (profile) => `Perfil ${profile.description}`,
  hooks: {
    useFetchAll: useUserProfileFetchAllQuery,
    useCreate: useUserProfileCreateMutation,
    useRemove: useUserProfileRemoveMutation,
  },
  columns: [
    { key: "id", header: "ID", size: 96 },
    { key: "description", header: "Descrição" },
    { key: "platform", header: "Plataforma", filterable: true },
  ],
  searchKeys: ["id", "description"],
  searchPlaceholder: "Pesquisar perfil...",
  toolbar: ["export", "import"],
  createLabel: "Adicionar perfil",
  form: {
    kind: "dialog",
    createTitle: "Adicionar perfil ao usuário",
    editTitle: (profile) => `Editar perfil · ${profile.description}`,
    defaults: { userId: 0, description: "", platform: "MZ" },
    fields: [
      { name: "description", label: "Perfil", kind: "select", required: true, useOptions: useProfileNameOptions },
      { name: "platform", label: "Plataforma", kind: "select", options: platformOptions, required: true },
    ],
  },
});

const userResource = defineResource<User>({
  key: "users",
  title: "Usuários",
  noun: "usuário",
  article: "o",
  describe: (user) => user.name,
  hooks: {
    useFetchAll: useUserFetchAllQuery,
    useCreate: useUserCreateMutation,
    useUpdate: useUserUpdateMutation,
    useRemove: useUserRemoveMutation,
  },
  statusSwitch: true,
  columns: [
    { key: "id", header: "ID", size: 96 },
    { key: "platform", header: "Plataforma", size: 120, filterable: true },
    { key: "name", header: "Nome" },
    { key: "email", header: "E-mail" },
    { key: "type", header: "Tipo", size: 130, filterable: true },
  ],
  searchKeys: ["id", "name", "email"],
  searchPlaceholder: "Pesquisar usuário...",
  toolbar: ["refresh"],
  createLabel: "Novo usuário",
  createIcon: UserCirclePlusIcon,
  recordPath: (user) => `/acesso/usuarios/${user.id}`,
  rowLinks: [
    { key: "groups", label: "Grupos", to: (user) => `/acesso/usuarios/${user.id}/grupos` },
    { key: "profiles", label: "Perfis", to: (user) => `/acesso/usuarios/${user.id}/perfis` },
  ],
  rowActions: [
    {
      key: "reset-login",
      label: "Redefinir login",
      icon: KeyIcon,
      run: async (user) => {
        const confirmed = await confirmAlert({
          title: "Redefinir login?",
          description: `${user.name} receberá em ${user.email} um link para cadastrar uma nova senha.`,
          actionText: "Redefinir login",
          ActionProps: { "data-testid": "users-reset-login-confirm-button" },
          PopupProps: { "data-testid": "users-reset-login-alert-dialog" },
        });
        if (confirmed) toast.success(`Link de redefinição enviado para ${user.email}.`);
      },
    },
  ],
  form: {
    kind: "drawer",
    createTitle: "Novo usuário",
    editTitle: () => "Editar usuário",
    defaults: { platform: "MZ", name: "", email: "", type: "Cognito", active: true },
    fields: [
      { name: "name", label: "Nome", required: true },
      { name: "email", label: "E-mail", required: true, placeholder: "nome@magazord.com.br" },
      { name: "type", label: "Tipo", kind: "select", options: userTypeOptions, span: "half", required: true },
      { name: "platform", label: "Plataforma", kind: "select", options: platformOptions, span: "half", required: true },
    ],
  },
});

const userRecord = defineRecord<User>({
  definition: userResource,
  listPath: "/acesso/usuarios",
  useFindById: useUserFindByIdQuery,
  title: (user) => user.name,
  status: (user) => formatStatus(user.active),
  editLabel: "Editar usuário",
  cards: [
    {
      key: "identification",
      title: "Identificação",
      description: "Dados gerais do usuário",
      span: "full",
      fields: [
        { name: "name", label: "Nome" },
        { name: "email", label: "E-mail", span: "half" },
        { name: "type", label: "Tipo", span: "half" },
        { name: "platform", label: "Plataforma", span: "half" },
        { name: "active", label: "Status", kind: "status", span: "half" },
      ],
    },
  ],
  tabs: [
    {
      key: "grupos",
      label: "Grupos",
      definition: userGroupResource,
      parentKey: "userId",
      summary: (count) => `${formatInteger(count)} grupos de usuário`,
      linkLabel: "Ver grupos",
    },
    {
      key: "perfis",
      label: "Perfis",
      definition: userProfileResource,
      parentKey: "userId",
      summary: (count) => `${formatInteger(count)} perfis de acesso`,
      linkLabel: "Ver perfis",
    },
  ],
});

const profileResource = defineResource<Profile>({
  key: "profiles",
  title: "Perfil",
  noun: "perfil",
  article: "o",
  describe: (profile) => profile.name,
  hooks: {
    useFetchAll: useProfileFetchAllQuery,
    useCreate: useProfileCreateMutation,
    useUpdate: useProfileUpdateMutation,
    useRemove: useProfileRemoveMutation,
  },
  statusSwitch: true,
  columns: [
    { key: "id", header: "ID", size: 96 },
    { key: "platform", header: "Plataforma", size: 120, filterable: true },
    { key: "name", header: "Nome" },
  ],
  searchKeys: ["id", "name"],
  searchPlaceholder: "Pesquisar perfil...",
  toolbar: ["refresh"],
  createLabel: "Novo perfil",
  recordPath: (profile) => `/acesso/perfis/${profile.id}`,
  rowLinks: [
    { key: "routes", label: "Rotas", to: (profile) => `/acesso/perfis/${profile.id}/rotas` },
  ],
  form: {
    kind: "drawer",
    createTitle: "Novo perfil",
    editTitle: () => "Editar perfil",
    defaults: { platform: "MZ", name: "", active: true },
    fields: [
      { name: "platform", label: "Plataforma", kind: "select", options: platformOptions, required: true },
      { name: "name", label: "Nome", required: true },
    ],
  },
});

const profileRouteResource = defineResource<ProfileRoute>({
  key: "profile-routes",
  title: "Rotas",
  noun: "rota",
  article: "a",
  describe: (route) => `${route.method} ${route.route}`,
  hooks: { useFetchAll: useProfileRouteFetchAllQuery },
  columns: [
    { key: "id", header: "ID", size: 96 },
    {
      key: "method",
      header: "Método",
      kind: "badge",
      size: 120,
      filterable: true,
      badgeVariants: { GET: "success", POST: "warning", DELETE: "destructive" },
    },
    { key: "route", header: "Rota" },
  ],
  searchKeys: ["id", "route"],
  searchPlaceholder: "Pesquisar rota...",
  toolbar: [],
});

const profileRecord = defineRecord<Profile>({
  definition: profileResource,
  listPath: "/acesso/perfis",
  useFindById: useProfileFindByIdQuery,
  title: (profile) => profile.name,
  status: (profile) => formatStatus(profile.active),
  editLabel: "Editar perfil",
  cards: [
    {
      key: "identification",
      title: "Identificação",
      description: "Dados gerais do perfil",
      span: "full",
      fields: [
        { name: "name", label: "Nome", span: "half" },
        { name: "platform", label: "Plataforma", span: "half" },
        { name: "active", label: "Status", kind: "status", span: "half" },
      ],
    },
  ],
  tabs: [
    {
      key: "rotas",
      label: "Rotas",
      definition: profileRouteResource,
      parentKey: "profileId",
      summary: (count) => `${formatInteger(count)} rotas liberadas`,
      linkLabel: "Ver rotas",
    },
  ],
});

export { profileRecord, profileResource, userRecord, userResource };
