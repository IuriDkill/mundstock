# Iuri Mundstock

<h2 align="center">
    Portfólio pessoal ✨
</h2>

## Sobre o Projeto

<p align="justify">
  Página única de apresentação: hero com cena 3D interativa (three.js), sobre mim, formação, habilidades,
  projetos (com links para ver online e no GitHub) e contato.
</p>

### Features

- [x] Cena 3D com React Three Fiber (carregada sob demanda, respeita `prefers-reduced-motion`)
- [x] Tema escuro (padrão, azul) e claro, idiomas PT/EN
- [x] Projetos com link "Veja online" e repositório

## Preparando Ambiente de Desenvolvimento

**Instalar dependências**

```bash
  npm install
```

**Executar em modo de desenvolvimento**

```bash
  npm run dev
```

**Gerar build para produção**

```bash
  npm run build
```

## 📁 Estrutura de pastas

```bash
src/
  │
  ├── components/
  │   └── layout/         # Header, Footer e Layout
  ├── config/             # i18n
  ├── locales/            # Textos em PT e EN
  ├── pages/
  │   └── home/           # index.tsx (seções), content.ts (links, projetos, skills), Scene3D.tsx, icons.tsx, style.module.css
  ├── routes/             # Rotas
  └── utils/              # useTheme
```

Para adicionar um projeto: inclua-o em `PROJECTS` em `src/pages/home/content.ts` (com `live` e/ou `repo`)
e escreva a descrição em `projects.items.<key>` nos dois arquivos de `src/locales`.
