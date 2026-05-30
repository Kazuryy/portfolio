---
title: "Followfeat"
description: "Self-hosted feedback, roadmap and changelog platform. Inspired by Featurebase, built with Next.js, Prisma and Authentik."
date: "2025-03-01"
tags: ["TypeScript", "Next.js", "React", "Docker"]
status: "Terminé"
github: "https://github.com/Kazuryy/followfeat"
featured: true
order: 3
---

## Concept

Followfeat is a self-hosted product feedback platform. Users submit feature requests, vote, and comment. Admins manage the roadmap and publish a changelog. Inspired by Featurebase, without the SaaS subscription.

## Features

For users:

- Feedback board: submit posts, upvote, comment, filter by tag
- Public roadmap in kanban view
- Versioned changelog with categories
- Profile with activity history and stats

For admins:

- Post and status management, drag & drop roadmap
- Rich text changelog editor (Tiptap) with markdown import
- Member management: stats, admin promotion, banning
- Email (SMTP) and Discord webhook notifications
- API keys to automate changelog publishing from CI

## Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 App Router + TypeScript |
| Styling | Tailwind CSS v4 |
| Database | Prisma + SQLite |
| Auth | Better Auth + Authentik OIDC |
| Rich text | Tiptap v2 |
| Drag & drop | dnd-kit |

## Deployment

Followfeat deploys via Docker Compose. The SQLite database is mounted as a volume, migrations and seeding run on startup.
