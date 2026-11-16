# Portal de Transportes

Protótipo navegável e entrega de front-end do Portal de Transportes, construído apenas com componentes do
Hubble DS (`@hubble-ds/*`). Os dados são fictícios, ficam em memória e reiniciam a cada reload.

O contexto completo do projeto (pedido, leitura do Figma, decisões, telas extrapoladas e pendências do DS) está em
[`PROJECT-CONTEXT.md`](PROJECT-CONTEXT.md).

## Rodar

```bash
npm install
```

```bash
npm run dev
```

Abre em http://localhost:5183. `npm run typecheck` e `npm run build` validam o projeto.

Os pacotes do Hubble são instalados a partir dos tarballs em `../hubble-ds-main/hubble-ds-main/.local-packs`.
Para regerá-los, veja a seção 9 do `PROJECT-CONTEXT.md`.

## Regras do projeto

- Só componentes do Hubble. Layout com utilitários do Tailwind ligados aos tokens do tema (`gap-xs`, `p-md`,
  `bg-background`). Sem CSS próprio, sem `style`, sem valores arbitrários, sem cor crua.
- Não editar os pacotes do Hubble. Falta ou defeito do DS vira item na seção 11 do `PROJECT-CONTEXT.md`.
- Telas são descritas em `src/resources/*.resource.ts`; os componentes genéricos ficam em `src/components/`.
- Services, queries, hooks e enums seguem o `AGENTS.md` do Hubble e são gerados por `scripts/generate-data-layer.mjs`
  e `scripts/generate-enums.mjs`.
- Todo elemento interativo tem `data-testid` no formato `<contexto>-<elemento>-<tipo>`.
