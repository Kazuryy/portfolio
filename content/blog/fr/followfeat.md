---
title: "Followfeat : pourquoi j'ai construit mon propre outil de feedback"
description: "Followfeat est une plateforme self-hosted de feedback, roadmap et changelog. Inspiré de Featurebase, construit avec Next.js, Prisma et Authentik."
date: "2025-03-01"
tags: ["TypeScript", "Next.js", "Dev"]
draft: false
---

## Le problème

J'avais besoin d'un endroit pour centraliser les retours sur mes projets : demandes de features, bug reports, roadmap visible, changelog versionnée. Les outils existants sont soit trop lourds (Jira, Linear), soit pas self-hostables, soit pas exactement ce que je voulais.

Featurebase fait exactement ça, mais c'est SaaS. J'ai décidé de construire ma propre version.

## Ce que fait Followfeat

Followfeat est une plateforme de feedback produit self-hosted. Côté utilisateurs :

- **Board de feedback** : soumettre des demandes de features, des bug reports, upvoter, commenter
- **Roadmap** : vue kanban des posts organisés par statut
- **Changelog** : notes de version avec éditeur rich text et badges de catégories
- **Profil utilisateur** : historique des posts, stats d'activité

Côté admin :

- Gestion des posts (statut, épinglage, rejet)
- Roadmap drag & drop
- Éditeur de changelog avec Tiptap, import markdown, image mise en avant
- Gestion des boards, tags, membres
- Notifications email (SMTP) et Discord webhook
- Clés API pour automatiser la publication de changelog

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Framework | Next.js 15 App Router + TypeScript |
| Style | Tailwind CSS v4 |
| Base de données | Prisma + SQLite |
| Auth | Better Auth v1 + Authentik OIDC |
| Rich text | Tiptap v2 |
| Drag & drop | dnd-kit |

SQLite suffit largement pour cet usage. Pas besoin de PostgreSQL, les données tiennent dans un seul fichier facile à sauvegarder.

L'authentification passe par Authentik via OIDC. Les utilisateurs se connectent avec leur compte Authentik, et les admins sont définis par une liste d'emails dans les variables d'environnement.

## Pourquoi pas GitHub Projects ou une autre solution ?

GitHub Projects c'est bien pour gérer des issues dans un repo, pas pour exposer une roadmap publique ou collecter du feedback externe. Les autres outils self-hosted que j'ai trouvés étaient soit abandonnés, soit beaucoup trop complexes pour mon usage.

Construire le mien m'a permis de partir exactement des features dont j'avais besoin, sans compromis.

## État actuel

Followfeat est déployé et utilisé. L'API REST permet de créer des entrées de changelog depuis un script ou une CI, ce que j'utilise pour automatiser la publication de notes de version.

Le code est open-source sur GitHub.
