# Portfolio — Document d'Architecture

> Basé sur le codebase `official-website` (MolyCorp), adapté en portfolio personnel.

---

## 1. Stack Technique

| Couche | Technologie |
|--------|-------------|
| Framework | Next.js (App Router) |
| Langage | TypeScript |
| UI | React |
| Style | Tailwind CSS + PostCSS |
| Contenu | MDX via `next-mdx-remote`, frontmatter YAML via `gray-matter` |
| Markdown | `remark-gfm` |
| Icônes | `lucide-react` |
| Thème | `next-themes` (light / dark / system) |
| Fonts | Geist + Geist Mono |
| Build | `output: "standalone"` → Docker |

---

## 2. Structure des fichiers

```
/
├── app/
│   ├── layout.tsx              # Layout racine
│   ├── page.tsx                # Home / Hero
│   ├── globals.css             # Variables CSS + styles globaux
│   ├── about/                  # Page À propos
│   ├── projects/               # Liste des projets
│   │   └── [slug]/             # Page détail projet (MDX)
│   ├── writeups/               # CTF writeups (MDX)
│   │   └── [slug]/
│   └── contact/                # Page contact
│
├── components/
│   ├── Header.tsx              # Navbar sticky
│   ├── Footer.tsx              # Footer simplifié
│   ├── ProjectCard.tsx         # Carte projet (≈ ServiceCard adapté)
│   ├── WriteupCard.tsx         # Carte writeup (≈ BlogCard adapté)
│   ├── TagBadge.tsx            # Badge tag technologie
│   ├── ThemeToggle.tsx         # Switch light/dark
│   └── ThemeProvider.tsx
│
├── lib/
│   ├── content.ts              # Chargement MD/frontmatter
│   └── image-config.ts
│
├── content/
│   ├── projects/               # Un fichier .md par projet
│   ├── writeups/               # Un fichier .md par writeup CTF
│   ├── pages/                  # about.md, etc.
│   └── tags.json               # Couleurs des tags
│
└── public/
    ├── icons/                  # Logos technos (SVG)
    └── images/
        ├── projects/
        └── writeups/
```

---

## 3. Pages & Routing

| Route | Description |
|-------|-------------|
| `/` | Hero + présentation rapide + projets mis en avant |
| `/about` | Parcours, compétences, formation Guardia |
| `/projects` | Grille de tous les projets |
| `/projects/[slug]` | Page détail d'un projet (MDX) |
| `/writeups` | Liste des CTF writeups |
| `/writeups/[slug]` | Writeup complet (MDX) |
| `/contact` | Liens GitHub, LinkedIn, email |

---

## 4. Modèles de contenu (Frontmatter)

### Projet (`content/projects/*.md`)

```yaml
title: "Nom du projet"
description: "Description courte"
date: "YYYY-MM-DD"
tags: ["Docker", "Proxmox", "Python"]
coverImage: "/images/projects/mon-projet.png"
github: "https://github.com/..."     # optionnel
status: "En cours | Terminé"
featured: true                        # affiché sur la home
```

### Writeup CTF (`content/writeups/*.md`)

```yaml
title: "Nom du challenge"
description: "Description courte"
date: "YYYY-MM-DD"
tags: ["Web", "Forensics", "Pwn"]
event: "NomDeLaCTF 2025"
difficulty: "Easy | Medium | Hard"
coverImage: "/images/writeups/..."    # optionnel
```

---

## 5. Design & Thème

Repris à l'identique depuis `official-website`.

### Variables CSS

```css
:root {
  --color-bg: #fafafa;
  --color-bg-secondary: #f5f5f5;
  --color-text: #18181b;
  --color-text-secondary: #52525b;
  --color-text-muted: #71717a;
  --color-border: #e5e5e5;
  --color-card: #ffffff;
  --color-card-hover: #fafafa;
  --color-accent: #6366f1;
  --color-accent-hover: #4f46e5;
  --gradient-title-from: #18181b;
  --gradient-title-to: #6366f1;
}

.dark {
  --color-bg: #09090b;
  --color-bg-secondary: #18181b;
  --color-text: #fafafa;
  --color-text-secondary: #a1a1aa;
  --color-text-muted: #71717a;
  --color-border: #27272a;
  --color-card: #18181b;
  --color-card-hover: #27272a;
  --color-accent: #818cf8;
  --color-accent-hover: #a5b4fc;
  --gradient-title-from: #ffffff;
  --gradient-title-to: #818cf8;
}
```

### Règles de style

- Font : `Geist Sans` (texte) + `Geist Mono` (code)
- Arrondis : `rounded-2xl` partout
- Hover : `hover:border-indigo-500/50` + `scale-105` sur les cards
- Gradient titre : `linear-gradient(135deg, from → to)` avec `background-clip: text`
- Transitions thème : `0.2s ease` sur `background-color` et `color`
- Zéro hardcoding couleur — tout passe par les variables CSS

---

## 6. Composants clés

### `ProjectCard`

```
Props : title, description, tags[], github?, coverImage?, slug, status, featured
Hover : border indigo + shadow-lg + title color change
Lien : /projects/[slug]
```

### `WriteupCard`

```
Props : title, event, difficulty, tags[], date, slug
Badge difficulté : couleur selon Easy/Medium/Hard
Lien : /writeups/[slug]
```

### `TagBadge`

```
Props : label, size (sm | xs)
Couleurs issues de tags.json, support light/dark
Style : rounded-full
```

---

## 7. Déploiement Docker

```dockerfile
# Dockerfile (Next.js standalone)
FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN npm ci && npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]
```

```yaml
# docker-compose.yml
services:
  portfolio:
    build: .
    restart: unless-stopped
    expose:
      - "3000"
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.portfolio.rule=Host(`portfolio.ton-domaine.com`)"
      - "traefik.http.routers.portfolio.entrypoints=websecure"
      - "traefik.http.routers.portfolio.tls.certresolver=letsencrypt"
```

Traefik gère le TLS et le reverse proxy — même setup que le reste de l'infra.

---

## 8. Ce qui est supprimé vs MolyCorp

| Supprimé | Remplacé par |
|----------|--------------|
| `services/` | `projects/` |
| `blog/` | `writeups/` |
| `faq/` | — |
| `premium/` | — |
| `rules/` | — |
| Footer 4 colonnes | Footer simplifié (liens sociaux + copyright) |

---

## 9. Roadmap

- [ ] Initialiser le projet Next.js avec la stack
- [ ] Copier le système de variables CSS et les composants de base
- [ ] Créer `ProjectCard` et `WriteupCard`
- [ ] Implémenter le routing MDX pour `/projects/[slug]` et `/writeups/[slug]`
- [ ] Rédiger le contenu (about, projets, writeups)
- [ ] Dockeriser et déployer sur Proxmox derrière Traefik
- [ ] Pusher le repo sur GitHub + README pointant vers le site
