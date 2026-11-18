# Portal de Transporte — project context for agents

Handoff document. It records what the product owner asked for, what was learned from the Figma file and from the
Hubble DS repository, and what is still undecided. Read it fully before touching code.

Last updated: 2026-11-18 (adjustment packs, see §13 and §14). Status: **first full implementation delivered and verified in the browser** — all 43
frames plus the extrapolated overlays. See §9–§12 for what exists, what was invented and what to report to the DS
team. Nothing is committed (no git repository here) and nothing is deployed.

---

## 1. What was asked (the brief, verbatim intent)

The requester is a product designer at Magazord. In their words:

1. "Inside this folder we already have a folder with the design system installed." → `hubble-ds-main/hubble-ds-main/`
   next to this file.
2. Work on the Figma project **Portal de Transporte**:
   `https://www.figma.com/design/OUYg0JgXWujB3Y4meJjoRg/Portal-de-Transporte?node-id=2145-20231`
3. **First understand the project.** The file has the flow map and what each part should do. After understanding,
   ask questions if needed.
4. **Implement the project using only Hubble components.** Hardcoded values, custom CSS, or any kind of mismatch
   with the design system are **not allowed**. The result **will be reviewed by DS dev ops**.
5. The result is both a **delivery** and a **prototype**: the requester will use it to validate the product before
   the migration (the current portal is a legacy system being redesigned on Hubble).
6. Generate this `.md` so another agent has the complete context of the conversation.

### How rule 4 is being interpreted

- Every visible element is a `@hubble-ds/components` component. No hand-made buttons, inputs, tables, badges, tabs.
- No custom CSS files, no `style={{}}`, no arbitrary Tailwind values (`p-[13px]`, `#fff`), no primitive colour
  scales (`bg-blue-500`, `primaria-*`).
- Layout glue (flex/grid/gap/padding) uses Tailwind utilities **bound to Hubble tokens** (`gap-xs`, `p-md`,
  `bg-background`, `typo-*`), which is what the DS rulebook itself prescribes (`AGENTS.md` §6 "Tokens semânticos,
  nunca cor crua").
- DS packages are never edited to make a screen work. If the DS lacks something the design needs, **stop, describe
  the gap with evidence, and ask** — do not patch or fork a DS component. (Standing preference of this requester.)
- "Hardcode" refers to styling values. Mock **data** is expected: there is no backend for the prototype.

---

## 2. Folder layout

```
PORTAL DE TRANSPORTES/Nova pasta/
├── PROJECT-CONTEXT.md            ← this file
├── hubble-ds-main.zip            ← original download of the DS
├── hubble-ds-main/hubble-ds-main ← Hubble DS monorepo (npm workspaces, node_modules installed, not a git repo)
│   └── .local-packs/             ← tarballs of the DS packages built for the app (generated)
└── portal-de-transporte/         ← the application (Vite + React 19 + Tailwind 4), see §9
```

Machine notes: Windows 11, Node 24.19, npm 11.17, **no Python** (use Node for
scripts). The `@hubble-ds` CodeArtifact registry needs Magazord auth/VPN, so assume it is unreachable and consume
the DS from this local checkout.

---

## 3. Hubble DS — what an implementer must know

Source of truth: `hubble-ds-main/hubble-ds-main/AGENTS.md` (rulebook, pt-BR) and `docs/*.md`. Read
`AGENTS.md` §5–§8 and the section "Padrões para apps que consomem o Hubble" before writing code.

**Packages** (`packages/*`, scope `@hubble-ds/`): `components` (v0.1.2), `hooks`, `utils`, `styles`, `assets`,
`configs`.

**Components available** (`packages/components/src/ui/`): accordion, alert-dialog, aspect-ratio, avatar, badge,
breadcrumb, button, button-group, calendar, card, carousel, chart, checkbox, collapsible, combobox, command,
context-menu, counter, data-table, dialog, drawer, dropdown-menu, empty, field, file-upload, hint, icon-button,
input, input-group, input-otp, label, loading, pagination, popover, progress, radio-group, scroll-area, select,
separator, sidebar, skeleton, slider, survey-card, switch, table, tabs, textarea, toast, toggle, toggle-group,
tooltip. Callables: `confirm-alert-callable`, `survey-prompt-callable`.

**Consuming it** (`docs/getting-started.md`, `docs/local-testing.md`):

- Requirements: React 19, Tailwind CSS 4, TypeScript with `moduleResolution: "bundler"`.
- Import by subpath: `import { Button } from "@hubble-ds/components/ui/button"`.
- CSS entry, in this order: `tailwindcss`, `@hubble-ds/styles/theme.css`, `@hubble-ds/styles/components.css`
  (+ optional `@hubble-ds/styles/fonts.css`). `components.css` is **generated** by `npm run build:packages`.
  Tailwind does not scan `node_modules`; never add `@source` for Hubble.
- Offline install route: `npm run local-pack` in the DS repo → tarballs in `.local-packs/` → `npm install
  --save-exact <tgz…>` in the consumer (install `hooks` + `utils` + `components` + `styles` together).
- No global provider. Overlays portal to `document.body`.
- Icons: `@phosphor-icons/react`.

**Rules for consumer apps that DS dev ops will check** (`AGENTS.md`):

- Tokens only; `cn` from the `cn` package; named exports grouped at the end of the file; kebab-case filenames;
  props inline as `Readonly<ComponentProps<…>>`; comments are the exception.
- Data layer: `src/services/<service>/<version>/<domain>.service.ts` → `src/lib/query/<domain>.query.ts`
  (`<Domain>QueryKeys` + `<Domain>QueryOptions`) → `src/hooks/use-<domain>-<operation>-query.ts` /
  `-mutation.ts` (TanStack Query).
- Enums: `src/lib/enum/<domain>.ts` as `Enum<Domain>` `as const` objects with `Caption`/`Options`.
- Confirmations use `confirmAlert()` from `confirm-alert-callable`; hosts are mounted once in `app.tsx` inside a
  `Callables` component.
- `data-testid` on every interactive element: `<context>-<element>-<type>`, English kebab-case, row ids use the
  business id (`carriers-table-row-1234`), never the index or the label.
- **Errors are never inline messages** under a field: invalid state is shown by the control (`aria-invalid`) and
  the message goes in a Toast.
- Label + control spacing is `gap-2xs` (use `Field`).

**Known traps** (`AGENTS.md` §8):

- The spacing scale shadows Tailwind's container scale: `max-w-sm` is 12px. Write `max-w-(--container-sm)`.
- `SidebarMenuButton` with `tooltip` needs a `TooltipProvider` above it.
- `CommandDialog` does not mount `Command`; wrap the content yourself.
- `ComboboxLabel` does not respect the 4px label gap (known DS debt, MAG-50860) — do not fix locally.

---

## 4. The Figma file

File key `OUYg0JgXWujB3Y4meJjoRg`. Two things matter on the page:

| Node | What it is |
|---|---|
| `2168:39564` "Mapa da estrutura atual · Portal de Transporte" | Map of the **legacy** portal, built from 44 screenshots on 10/11/2026. It is the functional inventory: which modules exist and which fields/actions each has. |
| `2145:20231` "Protótipo navegável · Portal de Transporte (Hubble)" | The **new** design: 43 frames at 1920×1080, built with Hubble library components. This is what gets implemented. |
| `2168:37779` "Table nest" | Reference frame from another Magazord product (Estoque) showing grouped/nested table headers. Not a Portal screen. |

The Figma metadata dump does not include text inside component instances. To get exact copy for a frame, call
`get_design_context` or `get_screenshot` on its node id.

### 4.1 What changes from legacy to new

| Legacy (map) | New (prototype) |
|---|---|
| Top menu with 15 flat items in two rows + "Fazer logout" | Left `Sidebar` with 6 collapsible groups + "Sair" in the footer |
| Work-tab bar: fixed Dashboard + one closable tab per open module and per open record (reached 11 tabs) | The frames draw no work tabs. **The requester asked for them back on 2026-11-16**, so the app has a work-tab bar above the page (§9 "Work tabs"). Inside a tab, a record still opens as a **page** with title + status badge and internal `Tabs`. The breadcrumb was removed on 2026-11-16 at the requester's request, because the work tab already names the module and the record |
| 9 "dedicated tabs" (child lists opened as new work tabs) | Internal tabs of the record page, with a count badge |
| 19 view/edit modals | `Drawer` (right side) for editing a record; `Dialog` for editing a child row |
| Row actions as a strip of icons (up to 6) | One "⋮" actions menu per row |
| Status as a text column | `Switch` in the first column |

### 4.2 Navigation (sidebar)

Header: avatar + product name/subtitle + icon button. Footer: "Sair".

- **Cadastros**: Transportadoras · Transportadora serviço · Clientes · Marketplace · Grupos de clientes
- **Tabelas de frete**: Prazos · Preços · Relacionamento de tabelas
- **Magazord Envios**: CTEs · Conciliações de frete · Documentos de cobrança
- **Monitoramento**: Notificações · Sincronização Mongo DB · Logs
- **Acesso**: Usuários · Perfis
- **Ferramentas**: Manutenção · Calculadora de frete

The landing page (0.0 Dashboard) is the shell with a greyed Magazord logo watermark and no content.

### 4.3 Screen inventory (node ids)

| # | Screen | Node | Pattern |
|---|---|---|---|
| 0.0 | Dashboard | `2145:20233` | Empty shell + watermark |
| 1.0 | Transportadoras | `2145:20909` | List |
| 1.1 | Transportadora serviço | `2145:21576` | List |
| 1.2 | Clientes | `2145:22357` | List |
| 1.3 | Cliente › Visão geral | `2145:23144` | Record · cards |
| 1.4 | Cliente › Marketplaces | `2145:23654` | Record · child list |
| 1.5 | Marketplace | `2145:24274` | List |
| 1.6 | Marketplace do cliente › Visão geral | `2145:25061` | Record · cards |
| 1.7 | Marketplace do cliente › Transportadoras | `2145:25571` | Record · child list |
| 1.8 | Grupos de clientes | `2145:26191` | List |
| 1.9 | Grupo de clientes › Visão geral | `2145:26778` | Record · cards |
| 1.10 | Grupo de clientes › Clientes | `2145:27288` | Record · child list |
| 2.0 | Prazos | `2145:27909` | List |
| 2.1 | Tabela de prazo › Visão geral | `2145:28696` | Record · cards |
| 2.2 | Tabela de prazo › Faixas de CEP | `2145:29206` | Record · child list |
| 2.3 | Preços | `2145:29826` | List |
| 2.4 | Tabela de preço › Visão geral | `2145:30734` | Record · cards |
| 2.5 | Tabela de preço › Cargas | `2145:31244` | Record · child list |
| 2.6 | Tabela de preço › Taxas | `2145:31864` | Record · child list |
| 2.7 | Tabela de preço › Editar (drawer) | `2145:32587` | Drawer form |
| 2.8 | Tabela de preço › Cargas › Editar carga (dialog) | `2145:33252` | Dialog form |
| 2.9 | Relacionamento de tabelas | `2145:33959` | List |
| 3.0 | CTEs | `2145:34685` | List with row selection |
| 3.1 | Conciliações de frete | `2145:35432` | List |
| 3.2 | Conciliação › Visão geral | `2145:36219` | Record · cards |
| 3.3 | Conciliação › CTEs | `2145:36729` | Record · child list |
| 3.4 | Documentos de cobrança | `2145:37349` | List |
| 4.0 | Notificações | `2145:38137` | List with row selection |
| 4.1 | Sincronização Mongo DB | `2145:38884` | List |
| 4.2 | Logs | `2145:39473` | List |
| 5.0 | Usuários | `2145:40112` | List |
| 5.1 | Usuário › Visão geral | `2145:40775` | Record · cards |
| 5.2 | Usuário › Grupos | `2145:41285` | Record · child list |
| 5.3 | Usuário › Perfis | `2145:41905` | Record · child list |
| 5.4 | Perfis | `2145:42525` | List |
| 6.0 | Manutenção › Sincronizações | `2145:43113` | Tabs · action cards |
| 6.1 | Manutenção › Relatórios | `2145:43645` | Tabs · report cards |
| 6.2 | Calculadora de frete | `2145:44177` | Form + results table |
| 6.3 | Calculadora de frete › Detalhes | `2145:45231` | Same, with an expanded result row |

### 4.4 Screen patterns (observed in the frames)

**List page** (e.g. 1.2 Clientes)

- Header row: page title on the left, primary button on the right ("Novo cliente", "Nova transportadora"…).
- Filter row: search `Input` on the left ("Pesquisar cliente…"); secondary buttons on the right ("Baixar CSV" /
  "Exportar" / "Importar" / "Atualizar", and "Filtrar").
- `DataTable`: sortable headers, first column is a status `Switch` where the entity has a status, last column
  "Ações" with a "⋮" menu. Some lists (CTEs, Notificações) have a selection `Checkbox` column instead of status.
- Sticky footer: "Resultados por página" select (25), three icon buttons, pagination ("Primeira · Anterior ·
  1 2 3 4 5 … 20 · Próxima · Última") and the record count ("1 à 25 de 1541 registros").

**Record page** (e.g. 1.3 / 2.4)

- `Breadcrumb` ("Preços › J&T 2026-11-01 SC Prazo Tres e ja"), title + status `Badge` ("Ativo"/"Ativa"), a
  contextual primary button on the right (changes per tab: "Vincular marketplace", "Nova carga").
- `Tabs` with count badges: "Visão geral", then child collections ("Cargas 5.304", "Taxas 32").
- "Visão geral" = `Card`s with title + description and **read-only (disabled) fields** in a grid. Example,
  Cliente: card "Identificação — Dados gerais do cliente" (Nome, Identificador, Plataforma, CNPJ, Status) and card
  "Integração — Token e vínculo com o Melhor Envio" (Token masked, Analista responsável, Melhor Envio).
- Child tab = the list pattern scoped to the record (own search, Exportar/Importar/Filtrar, table, pagination).

**Drawer form** (2.7 "Editar tabela de preço"): right-side `Drawer`, title + close button, fields Nome*,
Transportadora serviço* (select), Tipo* (select), Plataformas compartilhadas (select), Valor limite (R$), Peso
mínimo / Peso limite (kg), Altura / Largura / Comprimento limite (m); footer "Cancelar" + "Salvar alterações".

**Dialog form** (2.8 "Editar carga · AC-CAP até 1.000 kg"): Tabela de preço* (disabled), Sigla tarifária*
(select), Limite de peso (kg)*, Valor*; footer "Cancelar" + "Salvar".

**Manutenção** (6.0/6.1): page `Tabs` "Sincronizações" | "Relatórios".

- Sincronizações: destructive alert ("Esse ambiente deve ser usado com extremo cuidado. Toda alteração realiza
  alterações em cascata no sistema, podendo quebrar a aplicação. Seus dados e ações serão gravados para
  monitoramento.") and five cards — Tabela de preços, Tabela de transferências, Tabela de intermediação, Tabela de
  prazo, Adicionar/Reduzir prazo — each with selects "De" and "Para" and a full-width "Confirmar atualização".
  The legacy map also lists "Forçar atualização de ocorrências" and "Atualização DNE (upload .zip)", which are
  **not drawn** in the new frame.
- Relatórios: card "Erros de notificação" (Data inicial, Data final, Plataforma, Formato) and card
  "Ativação / Desativação" (Cliente, Período, Tipo). Fields are drawn disabled and no action button is drawn.

**Calculadora de frete** (6.2/6.3): left card "Dados do envio" — Localização (CEP origem*, CEP destino*),
Volumes with "Adicionar volume"; each volume card has Comprimento*, Largura*, Altura*, Peso (kg)*, Valor total da
mercadoria* and a delete icon button; sticky full-width "Simular frete". Right: "Resultados" table —
Transportadora, Serviço, Valor do frete, Prazo de entrega, Comparativo (badges "Mais barato" / "Mais rápido"),
Detalhes (chevron). Expanding a row shows read-only Pedágio, EMEX, Gris, ICMS padrão, Advalorem.

**Other list details seen**

- CTEs: Número, Cliente, Chave, Emissão, Transp. serviço, Valor do frete, Situação (Conciliado / Divergente /
  Pendente). Actions "Atualizar", "Filtrar".
- Notificações: Identificador, Código de rastreio, Número, Chave, Data de emissão, Transp. serviço, Situação
  (badge "Enviado").
- Logs: Ação realizada (badges "Alteração", "Exclusão" destructive, "Nova" primary), Tabela, Usuário, Usuário
  banco, Data. Only "Filtrar".
- Relacionamento de tabelas: Status, ID, Nome, Serviço transportadora. "Novo relacionamento", "Baixar CSV".

### 4.5 Functional inventory from the legacy map

Use this for fields and actions the new frames do not spell out.

| Module | List columns · actions | Modals / child views |
|---|---|---|
| Transportadoras | ID, Nome, Status, Parceiro · editar, excluir · Novo, Filtrar | Editar transportadora: Nome |
| Transportadora serviço | ID, Sigla, Nome, Status, Transportadora · editar, excluir | Editar: Transportadora, Nome, CNPJ, Sigla, Sigla TAR, Timeout do cálculo de frete… |
| Clientes | ID, Plataforma, Nome, Identificador, Status · 6 row actions · Exportar, Novo, Filtrar | Visualizar/Vincular Melhor Envio (Id cliente, Token, Código de autorização); Visualizar/Editar cliente (Nome, Identificador, Token, CNPJ, Analista); child: Marketplaces do cliente |
| Prazos | ID, Nome, Transp. serviço, Plataforma, Status · faixas de CEP, editar, excluir | Editar tabela de prazo (Plataformas, Nome, Transportadora serviço); child Faixas de CEP: ID, Sigla tarifária, CEP inicial, CEP final, Prazo · Exportar, Importar, Novo; Editar configuração de prazos |
| Preços | ID, Nome, Transp. serviço, Plataforma, Status · cargas, taxas, editar, excluir | Editar tabela de preço (long form); child Cargas: ID, Sigla, Limite de peso, Valor; child Taxas: ID, CEP inicial/final, Tipo, Base de cálculo, Valor, Ordem · Exportar, Importar, Novo |
| Relacionamento de tabelas | Nome, Serviço transportadora, Status · 5 row actions | Visualizar/Editar configuração de integração (cálculo de frete, notificações e-mail/FTP, dados de API); Visualizar/Editar relacionamento (Cliente, transportadora, tabelas de prazo/preço/transferência, flags) |
| Marketplace | Identificador, Cliente, Marketplace, Descrição, User ID, Status · transportadoras, editar, excluir | Editar marketplace do cliente (Cliente, Descrição, User ID); child Transportadoras: Serviço transportadora, Cód. no marketplace, Status · 5 actions · Clonar da loja, Novo |
| Sincronização do Mongo | Estado, Data, Tempo gasto, Tabelas, Filtros · Atualizar lista, Nova sincronização | — |
| Notificações | Data, situação, plataforma, identificador, rastreio, número, chave, transp. · reenviar, visualizar | — |
| Usuários | ID, Plataforma, Nome, E-mail, Tipo, Status · 5 row actions | child Grupos: ID, Descrição, Plataforma · Novo, excluir; child Perfis: same |
| Perfil | no legacy screenshot | — |
| Grupo (de clientes) | ID, Plataforma, Descrição, Status · clientes, editar, excluir | Editar grupo (Plataforma, Descrição); child Clientes do grupo: ID, Nome, Identificador · Novo |
| Manutenção | page with internal tabs | Sincronizações; Relatórios (sub-tabs Erros de notificação, Ativação/Desativação) |
| Logs | Ação, Tabela, Usuário, Usuário banco, Data · visualizar · filtro de data | Detalhamento de logs: header + JSON of data and of changes |
| Magazord Envios | CTE: 11 columns · Enviar cobrança, Conciliar frete, Resumo de valores, Adicionar coluna, Exportar, Importar, Filtrar. Conciliações: ID, data, cliente, tolerância, totais, % conciliado. Documentos de cobrança: ID, Tipo, Identificador, Competência, Valor, Arquivo, Status, Data · Importar | Visualizar CTE (NFe, CTE, JSON · Baixar arquivo); Enviar cobrança (Identificador, Chave NFS-e, Competência); child CTEs Conciliação (Recalcular fatura); Histórico de recálculo |

Map summary: 15 top-menu items, 9 dedicated tabs, 19 view/edit modals, 1 page with internal tabs, 3 items without
a legacy screenshot (Dashboard, Perfil, Marketplaces do cliente).

---

## 5. Gaps and inconsistencies found in the design

Raise these with the requester; do not resolve them silently.

1. **Only two overlays are drawn** (2.7 drawer, 2.8 dialog) against 19 legacy modals. "Novo…" buttons, row "⋮"
   menus, "Filtrar", "Importar" and the log/CTE detail views have no frame.
2. **Sidebar header differs between frames**: "Transzord / Portal de transportes" + gear icon (0.0, 2.7, 2.8) vs
   "Portal de transportes / Edgar Ferreira" + panel icon (most others).
3. **Three unlabeled icon buttons** sit next to "Resultados por página" on every list footer.
4. **Manutenção › Relatórios** has disabled fields and no "Gerar"/"Exportar" button; the legacy version had both.
5. **Manutenção › Sincronizações** omits "Forçar atualização de ocorrências" and "Atualização DNE".
6. **Calculadora** shows "1,20 cm" as the sample Comprimento, and the same carriers repeated twice (placeholder
   data).
7. Possible DS coverage risks to verify during implementation: expandable `DataTable` rows (6.3), grouped headers
   ("Table nest"), the destructive alert banner (no `alert` component in the DS list), and the Dashboard
   watermark (`@hubble-ds/assets` ships `magazord-icon.svg`, not the full wordmark).

---

## 6. Implementation approach (as built — details in §9)

- New consumer app **beside** the DS checkout (`Nova pasta/portal-de-transporte/`), Vite + React 19 + TypeScript +
  Tailwind 4, DS installed from local tarballs. The DS repo stays untouched.
- Client-side routing, one route per list and per record tab, so every screen in §4.3 has a shareable URL.
- In-memory mock data behind the service → query → hook layers of `AGENTS.md`, so swapping in the real API later
  is a change inside `src/services/` only.
- Shared building blocks composed only from DS parts: app shell (Sidebar), list page, record page, form drawer,
  form dialog.
- Every gap in §5 is reported, not patched.

---

## 7. Working agreements with this requester

- DS fidelity beats local fixes: never patch a DS component; measure, flag, ask.
- Never ask the requester to check something manually when it can be verified in the browser preview.
- DS dev ops reviews the output: follow `AGENTS.md` conventions to the letter (`data-testid`, tokens, file
  layout).
- Commits in the DS repo follow `MAG-<n> - <type>: description`; ask for the ticket number, never invent one.

---

## 8. Decisions (answered by the requester on 2026-11-16)

1. **Undrawn UI → extrapolate.** Build the undrawn overlays and actions following the two drawn patterns (drawer
   for a record, dialog for a child row), with fields from the legacy map (§4.5). Keep a list of every
   extrapolated screen so the requester can review them.
2. **App location / DS source.** Requester's words: "This folder with the design system is the most recent version
   that we have. For this project you can use the local components importing what you need to inside of portal de
   pagamentos." Read as: the local `hubble-ds-main` checkout is the authoritative DS version (do not fetch another
   one), and the app lives inside the `PORTAL DE TRANSPORTES` folder importing from it. "portal de pagamentos" is
   taken to be a slip for "Portal de Transportes" — this is the agent's interpretation, not confirmed.
3. **Prototype depth → working, in-memory.** Search, sort, pagination, status switches, create/edit/delete and the
   freight simulation work on mock data that resets on reload, behind the service/query/hook layers.

---

## 9. What was built

App: `portal-de-transporte/`. Run it with `npm run dev` (http://localhost:5183). `npm run typecheck` and
`npm run build` both pass. Mock data lives in memory and resets on reload.

### How the DS is consumed

The DS source was **not modified**. Its packages are built and packed in the DS repo
(`hubble-ds-develop/hubble-ds-develop/.local-packs/*.tgz`) and the tarballs are **committed in this repo under
`vendor/hubble-ds/`** (2026-11-18), so CI/Vercel can install them; `package.json` points there with `file:`
dependencies. The requester accepted that this public repo carries the DS build. To update the DS: rebuild the
tarballs, copy them into `vendor/hubble-ds/`, update the versions in `package.json` and run `npm install`. `src/assets/app.css` only imports `tailwindcss`, the DS `theme.css`,
`components.css` and `fonts.css`; there is no other CSS in the project.

Rebuilding the tarballs on Windows: `npm run local-pack` fails (§11.1). From the DS repo, run instead:

```bash
for p in hooks utils components; do npx tsx ./scripts/build-packages.ts $p; npx tsc -p packages/$p/tsconfig.build.json; done
npx tsx ./scripts/build-packages.ts styles
for p in hooks utils components styles assets; do npm pack --workspace packages/$p --pack-destination .local-packs; done
```

The first line prints an `ENOENT npx` error per package after the JS is written; the `tsc` call that follows
completes the step. Then copy the tarballs into `vendor/hubble-ds/`, delete `node_modules/@hubble-ds` in the app and reinstall.

### Structure

```
src/
├── app.tsx, main.tsx, router.tsx
├── assets/app.css                    imports only
├── components/
│   ├── app-shell.tsx                 Sidebar (6 collapsible groups) + SidebarInset
│   ├── workarea.tsx                  work-tab bar + one kept-alive panel per open tab
│   ├── page-header.tsx               title, badge, actions, tabs slot
│   ├── resource-list.tsx             toolbar + DataTable + pagination + row menu
│   ├── resource-list-page.tsx        list screen = PageHeader + ResourceList
│   ├── record-page.tsx               record screen: Tabs, cards, child lists
│   ├── resource-form.tsx             create/edit in Drawer or Dialog, detail Dialog
│   ├── resource-fields.tsx           field controls (edit) and disabled fields (read-only)
│   ├── resource-filter-drawer.tsx    "Filtrar"
│   ├── resource-import-dialog.tsx    "Importar" (FileUpload)
│   └── date-picker-field.tsx         Popover + Calendar
├── resources/*.resource.ts           one file per sidebar group: columns, forms, tabs, cards
├── pages/                            dashboard, maintenance, freight-calculator
├── lib/resource/                     types + formatting for the definitions
├── lib/enum/*.ts                     generated, AGENTS.md enum format
├── lib/query/*.query.ts              generated: QueryKeys + QueryOptions per domain
├── hooks/use-<domain>-<op>-(query|mutation).ts   generated
└── services/portal/v1/               api.ts (in-memory client), mock-database.ts, <domain>.service.ts
```

Screens are **definition-driven**: a `defineResource` object describes a list (columns, search, toolbar, form, row
actions) and a `defineRecord` object describes a record page (cards, tabs). To add or change a screen, edit
`src/resources/*.resource.ts`; the components in `src/components/` should rarely need changes.

The data layer for 24 domains is generated by `scripts/generate-data-layer.mjs` and the enums by
`scripts/generate-enums.mjs`. Edit the manifest inside the script and re-run it instead of editing generated files.
To connect a real backend, replace `src/services/portal/v1/api.ts` with the HTTP client: services, queries and
hooks keep their signatures.

### Routes

| Path | Figma frame |
|---|---|
| `/` | 0.0 |
| `/cadastros/transportadoras`, `/cadastros/transportadora-servico` | 1.0, 1.1 |
| `/cadastros/clientes` (1.3/1.4 removed on 2026-11-17: Visualizar opens a drawer) | 1.2 |
| `/cadastros/marketplace`, `…/:id`, `…/:id/transportadoras` | 1.5, 1.6, 1.7 |
| `/cadastros/grupos-de-clientes`, `…/:id`, `…/:id/clientes` | 1.8, 1.9, 1.10 |
| `/tabelas-de-frete/prazos`, `…/:id`, `…/:id/faixas-de-cep` | 2.0, 2.1, 2.2 |
| `/tabelas-de-frete/precos`, `…/:id`, `…/:id/cargas`, `…/:id/taxas` | 2.3–2.8 |
| `/tabelas-de-frete/relacionamento-de-tabelas` | 2.9 |
| `/magazord-envios/ctes`, `/conciliacoes-de-frete`, `…/:id`, `…/:id/ctes`, `/documentos-de-cobranca` | 3.0–3.4 |
| `/monitoramento/notificacoes`, `/sincronizacao-mongo-db`, `/historico-de-registros` | 4.0–4.2 |
| `/acesso/usuarios`, `…/:id`, `…/:id/grupos`, `…/:id/perfis`, `/acesso/perfis`, `…/:id`, `…/:id/rotas` | 5.0–5.4 |
| `/ferramentas/manutencao`, `…/relatorios` | 6.0, 6.1 |

### Work tabs (workarea)

Added on 2026-11-16 at the requester's request, restoring the legacy work-tab bar on top of the new layout.
Visual spec: Figma frame `2175:56715` "Abas de trabalho" and component `2175:56319` "Transzord/Workspace tab"
(states Default / Hover / Active / Active hover, types Closable / Pinned).

- Look, built on the DS `Tabs`/`TabsTrigger` with overrides: an `accent` strip (`px-md pt-xs`, `gap-2xs`, 44px
  high); 36px tabs with `px-sm py-xs gap-xs`, `rounded-t-md`, a 16px module icon and a label capped at 200px
  (`max-w-50`, truncated). Updated on 2026-11-16 to the revised component:
  - Inactive: p2/regular in `muted-text`, with `pr-2xl` (32px) reserved for the X. On hover the background is
    `accent-2` and the X shows in the top-right corner (20px `IconButton` at `top-2xs right-2xs`, 18px
    `muted-text` icon).
  - Active: p2/medium in `text` on `background`, with a `border-100` border on the top and sides. Padding is
    `px-sm` on both sides, with no space reserved, so a tab changes width when it becomes active, as in the
    component. On hover, a 24px X (`right-xs`, vertically centred, 16px `text` icon) overlays the end of the label
    over a 48×24 fade from transparent to `background` (stop at 30%; Figma uses 28.8%).
  - The X shows only on hover or keyboard focus, and is a sibling of the trigger, not nested inside it, as the
    component description asks.
- Tabs that don't fit go into a "+N ⌄" menu (DS `DropdownMenu`). Widths are measured while a tab is visible and
  cached; the active tab is always kept in the bar. This replaced the earlier horizontal scroll.
- Icons: `NavigationItem.icon` in `lib/navigation.ts` (one per module; the Figma frame fixes House, Storefront,
  Table and Users, and the rest were chosen to match). Records use their list's icon.
- Record labels are `<list title> · <record title>` ("Preços · J&T 2026-11-01 SC Prazo Tres e ja"), or
  `workTabTitle` when the record definition sets it. Marketplace sets it to drop the prefix, as drawn in Figma
  ("Transporte Inteligente · Mercado Livre").

- The data router has a single `/*` route rendering `AppShell`. The screen routes live in `workareaRoutes`
  (`router.tsx`) and each one declares `handle.workTab(params) → { key, label, icon }`. The `key` is the tab's
  root path: the module (`/cadastros/clientes`) or the record (`/cadastros/clientes/1644`). A record's internal tabs
  (`…/1644/marketplaces`) stay in the same work tab, which remembers the last sub-tab.
- `Workarea` (`components/workarea.tsx`) keeps the list of open tabs, adds or updates the tab on each location
  change, and renders every open tab with `useRoutes(workareaRoutes, tab.location)` inside a React `<Activity>`.
  Hidden tabs keep their state (search, filters, sort, page, open sub-tab) and pause their effects.
- **Start screen (since 2026-11-16, Figma `2171:39960` "0.0 · Dashboard").** There is no Dashboard tab. On the first
  load, `/` shows no tab bar, just the `accent-0` content area with the Magazord wordmark centred at 30% opacity
  (`pages/dashboard-page.tsx`, passed to `Workarea` as `home`). The first navigation opens the first tab. Closing
  the last tab (or "Fechar todas as abas") returns to `/`, and the bar disappears again. Going to `/` while tabs are
  open (sidebar logo link) keeps the bar with no active tab over the same start screen.
- Every tab closes with the X button, a middle click, or the context menu (Fechar aba / outras / à direita / todas). Closing the active tab activates the neighbour on the right, or on
  the left if there is none. Deleting a record from its page closes its tab and opens the list
  (`useWorkarea().closeTabs`).
- Open tabs are saved in `sessionStorage` (`portal-de-transporte:work-tabs`, paths only) and come back after a
  reload. Their in-memory state does not. Unknown paths go to the start screen without opening a tab.
- Record tab labels come from the record title (`RecordWorkTabLabel` in `record-page.tsx`), with "Cliente 1644"
  as the fallback while it loads or when the record no longer exists.
- `data-testid`: `workarea-tab-bar`, `workarea-tabs-list`, and per tab `workarea-<root path with dashes>-tab`,
  `-close-button`, `-context-menu`, `-close-menu-item`, `-close-others-menu-item`, `-close-right-menu-item`,
  `-close-all-menu-item` (e.g. `workarea-cadastros-clientes-1644-tab`); `workarea-overflow-button` and
  `workarea-overflow-<root path>-menu-item` for "+N"; the start screen is `dashboard-empty`.

Verified in the browser on 2026-11-16: module and record tabs open from the sidebar and from "Visualizar"; the
Clientes search survives switching tabs; a record tab goes back to its Marketplaces sub-tab; X on the active tab
activates the neighbour; "Fechar outras abas" works; a reload restores the tabs; an unknown path falls back to
the start screen; deleting a user from its page closes its tab. No console errors, and `npm run build` passes.
The Figma restyle was checked on 2026-11-16 at 1320×800 with the frame's own tabs: bar height, paddings,
radius, colour tokens, the hover X and the "+3" overflow match the frame, and opening a hidden tab from "+3"
brings it into the bar. Not verified: keyboard-only use and dark mode.

### Verified in the browser (2026-11-16, 1600×900)

List rendering, search, pagination; create → appears in the list (64 → 65 carriers); status switch toggles and
persists; row menu; delete with confirmation; required-field validation (`aria-invalid` + toast); record page with
cards, tab counts and child list; edit dialog on a child row; filter drawer opens with the expected fields; row
selection with counter; log detail dialog; Manutenção (both tabs); freight simulation with an expanded result row;
sidebar collapse. Source audit: no arbitrary Tailwind values, no `style`, no raw colours, no custom CSS; the only
raw HTML tags are layout/semantic wrappers (`div`, `span`, `section`, `header`, `form`, `h1`, `h2`, `p`, one `img`).

Not verified: dark mode, widths below ~1280px, keyboard-only navigation, the shadow-DOM scenario, applying a
filter and the CSV download end to end, and every individual extrapolated form (they share one component; the
Cliente, Transportadora and Carga forms were exercised).

---

## 10. Extrapolated UI — review list for the requester

None of these has a Figma frame. Each follows the two drawn patterns and takes its fields from §4.5.

| Where | What was invented |
|---|---|
| Every list | Row "⋮" menu items: Visualizar, Editar, Excluir (+ module-specific items). Delete asks for confirmation. Exposed row actions are `secondary` buttons without icon. |
| Every list | Filter header (rule from the 2026-11-17 pack): typed filters become options of a composite search (field select + text); selects/dates sit on the right; with more than 5, the first 3 stay out and the rest go to the "Filtrar" drawer. Columns can be resized (drag the header edge) and reordered (drag the header). |
| Every list | "Exportar"/"Baixar CSV" downloads the filtered rows; "Atualizar" refetches; "Importar" opens a CSV upload dialog (the file is accepted, not parsed). |
| Every list footer | The three unlabeled icon buttons became: open in new tab, save view (toast only), reset view. Meaning **confirmed by the requester on 2026-11-16**; "save view" still needs real persistence. |
| Transportadoras, Transportadora serviço, Clientes, Marketplace, Grupos, Prazos, Preços (create), Relacionamento, Usuários, Perfis, Conciliações, Documentos de cobrança, Sincronização Mongo | Create/edit **drawer** with the legacy fields. |
| Faixas de CEP, Taxas, Cargas (create), Marketplaces do cliente, Transportadoras do marketplace, Clientes do grupo, Grupos/Perfis do usuário | Create/edit **dialog**. |
| CTEs, Logs, Notificações, Relacionamento, Sincronização | "Visualizar" read-only dialog (logs show the JSON of data and changes). |
| CTEs | Page actions Enviar cobrança (dialog: clients multi-select, Chave NFS-e, Competência), Conciliar frete (toast), Resumo dos valores (totals dialog). Nothing is sent. |
| Conciliações | Row action Histórico de recálculo; exposed "Listar CTEs"; "Recalcular fatura" (toast only). |
| Manutenção › Sincronizações | Cards "Forçar atualização de ocorrências" and "Atualização DNE" (from the legacy map); confirmation before every update. |
| Manutenção › Relatórios | Fields are editable; "Gerar relatório" and "Exportar" buttons added (they download a header-only CSV). |
| Calculadora | The quote values come from an illustrative formula, not real pricing. |
| Dashboard | Nothing extrapolated any more: since 2026-11-16 it follows frame `2171:39960` (wordmark only, no text). |
| Sidebar | "Sair" shows a toast; the sidebar collapses to an icon rail. |
| Work-tab bar | The whole bar (not in the new frames; requested on 2026-11-16). DS `Tabs` size small, an X `IconButton` next to each trigger, and a context menu to close several tabs at once. |

---

## 11. DS findings to report to the Hubble team (not patched)

1. **`scripts/build-packages.ts` does not run on Windows.** `execFileSync("npx", …)` throws
   `spawnSync npx ENOENT` (Windows needs `npx.cmd` or `shell: true`), so `npm run build:packages` and
   `npm run local-pack` stop after the first package's JS is written. Workaround in §9.
2. **`DataTable` row selection double-toggles.** With `enableRowSelection` + `createDataTableRowSelectionColumnDef`,
   clicking the checkbox toggles the row, the click bubbles to the `TableRow` `onClick` and toggles it back
   (measured: 0 rows selected after one checkbox click). **2026-11-18: no longer reproduces with the current DS
   pack** — Notificações uses the helper as-is and one click selects one row. The app passes its own `cell` through the helper's
   `options` with `stopPropagation` (`resource-list.tsx`). Any other interactive element inside a selectable row
   has the same problem.
3. **Breadcrumb demo nests `<li>` inside `<li>`.** `breadcrumb.demo.tsx` puts `BreadcrumbSeparator` (an `li`)
   inside `BreadcrumbItem` (an `li`); React logs an invalid-nesting error. The app renders them as siblings.
4. **No alert/banner component.** The destructive notice on Manutenção is a `Card` with
   `bg-destructive-background` / `border-border-destructive` / `text-destructive-text` and `role="alert"`.
5. **No expandable row in `DataTable`.** The calculator composes `DataTableGridBody` children by hand with the DS
   `TableRow`/`TableCell`.
6. **`DataTablePagination` differs from the Figma footer**: no slot for the "Resultados por página" label or for the
   three icon buttons, and it adds an "Ir para" jumper the design does not show. The app leaves the DS component
   untouched: the label sits before it and the icon buttons after the record count.
7. **`@hubble-ds/assets` ships the Magazord icon but not the full wordmark** used as the Dashboard watermark. The app
   uses the SVG exported from the Figma frame (`src/assets/magazord-wordmark.svg`, 969×161.929) until the DS ships it.
8. **Sidebar width** (DS default 16rem) truncates "Relacionamento de tabelas"; the Figma sidebar is wider.
9. **`Tabs` has no closable variant.** A close button cannot go inside `TabsTrigger` (a `<button>` inside a
   `<button>` is invalid HTML), so the work-tab bar puts the X `IconButton` next to the trigger. The X therefore sits
   outside the active tab's highlight.
10. **`ScrollArea` only scrolls vertically** (it always mounts a vertical `ScrollBar` and has no horizontal option).
    The work-tab bar no longer needs it, since overflow goes into a "+N" menu.
11. **Consumer overrides of DS classes need `!`.** `components.css` is imported after the app's utilities and redefines
    the same utility classes (`.text-muted-text`, `.border`, `.p-2xs`…), so on equal specificity the DS copy wins.
    `cn` also doesn't see named-token values (`px-xs` vs `px-sm`, `gap-2xs` vs `gap-xs`) as conflicting, so it keeps
    both. The work tabs therefore use the `!` modifier on overridden properties, which is the same idiom the DS uses
    (`p-0!` in `IconButton`).

12. **`DataTable` has no column resize or reorder UI.** It ships `columnSizingFeature` and reads
    `header.getSize()`, but renders no resize handle and doesn't include `columnOrderingFeature`. The app adds
    `columnOrderingFeature` through the documented feature extensions, makes `DataTableColumn` draggable (native
    HTML5 drag) and renders its own resize handle: a `span` with `cursor-col-resize` and `hover:bg-primary`
    inside the header (`resource-list.tsx`). That handle is the only app-made visual element in the lists;
    approved by the requester on 2026-11-17 until the DS ships one.
13. **No date-range or month picker.** The CTE "Competência" filter uses the DS `Calendar` in single mode and keeps
    only the month and year of the picked day.
14. **No read-only style for `Input`/`Textarea`.** The DS only styles `disabled` (opacity 50, not-allowed cursor).
    Read-only views now use `readOnly` without `disabled` (2026-11-18), so the value looks like a normal field and
    can be selected; a dedicated read-only variant would make the difference visible. The `Badge` also lacks
    `success`/`warning` variants (the app uses the DS `badge-*` tokens on `secondary`).
15. **Table width (2026-11-18).** Columns without `size` must not pass `size: undefined` (it becomes TanStack's 150 px
    default instead of the DS auto width), and the "Ações" width is computed from the exposed button labels
    (`actionsColumnWidth`). Column sizes were trimmed so every list fits at 1440 px without horizontal scroll; a
    pinned (sticky) Ações column was tried and rejected by the requester.

---

## 12. Known deviations from the Figma frames

- Sidebar header uses the "Portal de transportes / Edgar Ferreira" variant on every screen (the frames mix two).
  **Kept on purpose, confirmed by the requester on 2026-11-16**, including on the start screen, whose frame shows
  "Transzord / Portal de transportes".
- 1.3/1.4 (Cliente) were normalised to the newer record pattern: Excluir + Editar on the overview, summary card.
  The frames show "Vincular marketplace" on both tabs.
- Record pages show **no breadcrumb**, although the record frames (e.g. 2.4 "Preços › J&T…") draw one. Removed on
  2026-11-16 at the requester's request: the work tab (module icon + "Preços · J&T…") already gives that context.
- 2.8 "Editar carga" does not show the disabled "Tabela de preço" field (the child record only carries the id).
- 6.3 detail row lays the five fee fields out as 3 + 2 instead of 5 in a row.
- Tab count badges show the mock counts (e.g. 60 cargas), not the Figma placeholders (5.304).
- Work tabs are 2px wider than in Figma (148 vs 146 for Marketplace): the 1px side border is transparent on every
  tab so activation doesn't shift the layout, and CSS borders take space where Figma's inside strokes don't.
  The active tab's fade stops at 30% instead of Figma's 28.8% (Tailwind gradient stops come in 5% steps).
- The select caret is the DS one (caret down), not the up/down caret drawn in the forms.
- Row links (Faixas de CEP, Transportadoras) appear in the "Ações" cell of Prazos and Marketplace, by analogy with
  the Cargas/Taxas links drawn in 2.3; the frames show only "⋮" there.
- Outside the app: a `portal-de-transporte` entry was added to
  `CLAUDE PROJECTS/design-inclusao-de-pedido-main/.claude/launch.json` so the preview pane can start the app.

---

## 13. Adjustment pack of 2026-11-17

Source: `Pack de ajustes.txt` from the requester. Decisions taken with the requester on 2026-11-17:

- Resizable/reorderable columns are built in the app (§11.12).
- Clientes: Visualizar opens a read-only drawer; the client record page (1.3) and its Marketplaces tab (1.4) are no
  longer reachable. "Visualizar Melhor Envio" opens a second drawer (Id cliente, Token cliente, Código de autorização).
- Preços › Nova carga: only Sigla tarifária, Tipo and Base de cálculo. Peso até and Valor stay as columns and filters
  but can no longer be set in the form.
- CTEs: the checkbox column is gone; Enviar cobrança (primary), Conciliar frete and Resumo dos valores are page
  header buttons.

Interpretations to confirm with the requester:

- Carga "Tipo" has no source in the legacy map; the options (Peso, Valor da nota, Volume) are invented.
- Relacionamento "Transportadora" is the carrier **service** (same list as the other screens). "Nome" is the client's
  name, filled on save, since the new form has no name field.
- Faixas de CEP: the "Prazo" filter matches both Prazo and Prazo máximo; "CEP" matches CEP inicial or CEP final.
- CTE filter placement: Cliente, Transportadora serviço and Conciliado on the header; Competência, Data emissão and
  Data vencimento in the drawer (dates counted as selects).
- Conciliação "Listar CTEs" is the exposed action; "Histórico de recálculo" stays in the menu.

Pending:

- ~~Visualização do CTE~~ — **done 2026-11-18** from the legacy "Visualizar CTE" print: drawer with the fields
  grouped as CT-e, NF-e, Cliente e pedido, Emitente e destinatário, Transporte, Cobrança, then Opções (JSON with
  Copiar); "Baixar arquivo" is the footer primary action (also in the row menu). New CTE fields: series, cteValue,
  nfeKey, nfeGeneratedAt, orderCode, storeName, trackingCode, carrierTrackingCode, grossWeight, billedWeight,
  fileName, options.

## 14. Adjustment pack 2 of 2026-11-18

Source: "Pack de updates 2" from the requester (pasted in chat).

- **Notificações**: checkbox column (`selectable`); header "Reenviar" (primary) is enabled only with one or more rows
  selected (`pageActions[].requiresSelection`, selection kept in the form controller). "Reenviar" is also an exposed
  row button (`rowActions[].exposed`). Filters: Data de emissão (date), Situação and Plataforma (selects), Código de
  rastreio (input on the right), Identificador / Número / Chave / Transportadora serviço (search). New `platform`
  field and column.
- **Status badges**: `ResourceBadge` adds `success` and `warning` on top of the DS Badge using the DS tokens
  `badge-bg-success` / `badge-text-success` / `badge-bg-warning` / `badge-text-warning` (the DS Badge has no such
  variants — §11 candidate). Mongo: Concluída success, Em andamento warning, Erro destructive (status renamed from
  "Falhou"). Histórico: Nova success, Alteração warning, Exclusão destructive. Notificações: Enviado success.
- **Sincronização Mongo DB**: no Ações column (the read-only detail was its only item).
- **Logs → Histórico de registros** (title, sidebar and route `/monitoramento/historico-de-registros`); Data filter
  matches the day of "dd/mm/aaaa hh…" values.
- **Usuários**: exposed "Grupos" and "Perfis" buttons open the user record tabs; "Redefinir login" in the menu
  (confirm + toast).
- **Perfil**: exposed "Rotas" opens the profile record (`/acesso/perfis/:id/rotas`) with ID, Método (badge: GET
  success, POST warning, DELETE destructive) and Rota. New `profile-route` domain and `http-method` enum.
- **Manutenção**: Atualização DNE now comes before Forçar atualização; both report buttons are primary; both reports
  use one period field (`DateRangePickerField`, DS `Calendar` in range mode, two months).
- **Calculadora de frete** removed (page, route and sidebar item).
- **Sidebar footer**: user name + role (mock: Edgar Ferreira · Master), "Modo escuro" switch (toggles the DS `dark`
  class on `<html>`, saved in localStorage), then Sair. The name was removed from the sidebar header.

Interpretations to confirm with the requester:

- Order of the footer: user → Modo escuro → Sair ("abaixo dessa opção" read as below the user).
- Transportadora serviço on Notificações is a search option (it was a select before).
- Método badge colours (GET green, POST orange, DELETE red) were not specified.

Pending:

- ~~Visualização da notificação~~ — **done 2026-11-18**: "Visualizar" is an exposed row button (the ⋮ menu is gone
  on Notificações) and opens the "Detalhes do request" drawer. A notification can be sent any number of times, so
  each request (`notification-request` domain) is its own accordion (closed by default, content on `bg-accent-0`),
  most recent first: Nota, Data,
  Integração, Message, URL, Method, Código HTTP, Request and Response (JSON with "Copiar"). Views support
  `exposed`, a custom `content` component and `footerActions` (Reenviar sits in the drawer footer); read-only
  `code` fields now have a "Copiar" button everywhere.
