# Conex Dashboard — CLAUDE.md

## Stack
- React 19 + Vite 8
- Recharts para gráficos
- Deploy: Vercel
- Domínio: dashboard.conexstudio.com.br

## Fluxo de branches

| Branch | Ambiente | URL |
|--------|----------|-----|
| `main` | Produção | dashboard.conexstudio.com.br |
| `dev`  | Preview  | URL automática Vercel (conex-dashboard-git-dev.vercel.app) |

### Regra: nunca commitar direto na `main`. Sempre trabalhar na `dev`.

```bash
# Sempre começar na dev
git checkout dev

# Após mudanças
git add .
git commit -m "feat: descrição"
git push
# → Vercel gera preview automaticamente

# Quando aprovado, promover para produção
git checkout main
git merge dev
git push
git checkout dev  # voltar para dev
```

## Estrutura do projeto

```
src/
  App.jsx        # Toda a aplicação (único arquivo)
  index.css      # Estilos globais + @tailwind
  main.jsx       # Entry point
public/
  favicon.svg
  icons.svg
```

## Módulos do dashboard

| Módulo | Descrição |
|--------|-----------|
| Visão Geral | Cards de stats + gráficos |
| Projetos | Kanban com 11 status + drag & drop |
| Tarefas | Kanban com 11 status + drag & drop |
| Conteúdo | Gestor de posts por plataforma |
| Calendário | Visualização mensal de conteúdo agendado |
| Analytics | Gráficos de performance |

## Status de projetos/tarefas (11 no total)

`backlog` → `briefing` → `planejando` → `andamento` → `producao` → `revisao` → `aprovacao` → `ajustes` → `concluido`

Também: `pausado`, `cancelado`

## Status de conteúdo

`ideia` → `rascunho` → `agendado` → `publicado`

## Plataformas de conteúdo

Instagram, YouTube, TikTok, LinkedIn

## Cores principais

```js
accent:  "#B8F500"  // verde-limão (primária)
bg:      "#080808"  // fundo
surface: "#0F0F0F"  // cards
text1:   "#F0F0F0"  // texto principal
```

## Deploy

O Vercel detecta pushes automaticamente:
- Push em `dev` → deploy no ambiente de preview
- Push em `main` → deploy em produção

Para buildar localmente:
```bash
npm run dev      # servidor local
npm run build    # build de produção
npm run preview  # preview do build
```
