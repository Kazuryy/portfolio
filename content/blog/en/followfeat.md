---
title: "Followfeat: why I built my own feedback tool"
description: "Followfeat is a self-hosted feedback, roadmap and changelog platform. Inspired by Featurebase, built with Next.js, Prisma and Authentik."
date: "2025-03-01"
tags: ["TypeScript", "Next.js", "Dev"]
draft: false
---

## The problem

I needed a place to centralise feedback on my projects: feature requests, bug reports, a visible roadmap, a versioned changelog. Existing tools are either too heavy (Jira, Linear), not self-hostable, or not quite what I wanted.

Featurebase does exactly that, but it's SaaS. I decided to build my own version.

## What Followfeat does

Followfeat is a self-hosted product feedback platform. For users:

- **Feedback board**: submit feature requests and bug reports, upvote, comment
- **Roadmap**: kanban view of posts organised by status
- **Changelog**: versioned release notes with rich text editor and category badges
- **User profile**: post history, activity stats

For admins:

- Post and status management, pinning, rejection
- Drag & drop roadmap
- Changelog editor with Tiptap, markdown import, featured image
- Board, tag and member management
- Email (SMTP) and Discord webhook notifications
- API keys to automate changelog publishing

## Tech stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 App Router + TypeScript |
| Styling | Tailwind CSS v4 |
| Database | Prisma + SQLite |
| Auth | Better Auth v1 + Authentik OIDC |
| Rich text | Tiptap v2 |
| Drag & drop | dnd-kit |

SQLite is more than enough for this use case. No need for PostgreSQL — the data fits in a single file that's easy to back up.

Authentication goes through Authentik via OIDC. Users log in with their Authentik account, and admins are defined by an email list in environment variables.

## Why not GitHub Projects or something else?

GitHub Projects is fine for managing issues in a repo, not for exposing a public roadmap or collecting external feedback. The other self-hosted tools I found were either abandoned or far too complex for my needs.

Building my own let me start from exactly the features I needed, without compromise.

## Current state

Followfeat is deployed and in use. The REST API allows creating changelog entries from a script or CI, which I use to automate release note publishing.

The code is open-source on GitHub.
