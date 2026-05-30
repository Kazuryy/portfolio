---
title: "Followfeat"
description: "Plateforme self-hosted de feedback, roadmap et changelog. Inspiré de Featurebase, construit avec Next.js, Prisma et Authentik."
date: "2025-03-01"
tags: ["TypeScript", "Next.js", "React", "Docker"]
status: "Terminé"
github: "https://github.com/Kazuryy/followfeat"
featured: true
order: 3
---

## Concept

Followfeat est une plateforme self-hosted de feedback produit. Les utilisateurs soumettent des demandes de features, votent, commentent. Les admins gèrent la roadmap et publient un changelog. Inspiré de Featurebase, sans l'abonnement SaaS.

## Fonctionnalités

Côté utilisateurs :

- Board de feedback : soumettre des posts, upvoter, commenter, filtrer par tag
- Roadmap publique en vue kanban
- Changelog versionnée avec catégories
- Profil avec historique et stats d'activité

Côté admins :

- Gestion des posts et statuts, drag & drop sur la roadmap
- Éditeur de changelog rich text (Tiptap) avec import markdown
- Gestion des membres : stats, promotion admin, bannissement
- Notifications email (SMTP) et Discord webhook
- Clés API pour automatiser la publication du changelog depuis une CI

## Stack

| Couche | Technologie |
|--------|-------------|
| Framework | Next.js 15 App Router + TypeScript |
| Style | Tailwind CSS v4 |
| Base de données | Prisma + SQLite |
| Auth | Better Auth + Authentik OIDC |
| Rich text | Tiptap v2 |
| Drag & drop | dnd-kit |

## Déploiement

Followfeat se déploie via Docker Compose. La base de données SQLite est montée en volume, les migrations et le seed tournent au démarrage.
