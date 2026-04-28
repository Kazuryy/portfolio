---
title: "Immich: goodbye Google Photos"
description: "Immich is the self-hosted alternative to Google Photos. Facial recognition, geolocation, mobile apps: experience report."
date: "2025-01-09"
tags: ["Immich", "Docker", "Infra"]
draft: false
---

## Why Immich?

Same logic as Nextcloud: when the storage is already there, use it. Google Photos compresses photos past a certain quota, and the free 15 GB fills up fast.

Immich is the most complete self-hosted alternative available today. Clean interface, solid iOS and Android apps, and features that genuinely compete with Google Photos.

## What it does

Immich goes well beyond simple photo storage:

- **Automatic backup** from mobile, in the background
- **Facial recognition**: automatically groups photos by person
- **Geolocation**: interactive map with shooting locations
- **Shared albums**: share a selection without the other person needing an account
- **Semantic search**: search "dog on the beach" and find matching photos without tagging anything
- **Timeline**: chronological view identical to Google Photos

## Installation

Immich deploys via Docker Compose. The stack includes the main server, a machine learning microservice for recognition and search, PostgreSQL with the pgvecto.rs extension, and Redis:

```yaml
services:
  immich-server:
    image: ghcr.io/immich-app/immich-server:release
    volumes:
      - ./upload:/usr/src/app/upload
    environment:
      DB_HOSTNAME: database
      DB_PASSWORD: ${DB_PASS}
      REDIS_HOSTNAME: redis

  immich-machine-learning:
    image: ghcr.io/immich-app/immich-machine-learning:release
    volumes:
      - ./model-cache:/cache

  database:
    image: ghcr.io/immich-app/postgres:14-vectorchord0.3.0-pgvectors0.2.0
    environment:
      POSTGRES_PASSWORD: ${DB_PASS}
      POSTGRES_DB: immich

  redis:
    image: redis:alpine
```

The `upload` folder holds all photos. I mount it on the HDD, not the NVMe.

## Migration from Google Photos

Google Takeout lets you export all your photos as ZIP archives. Immich has a CLI import tool that handles the JSON metadata exported by Google (dates, geolocation):

```bash
immich upload --recursive ./takeout
```

The main issue: duplicates. If photos were already on the phone and imported via the app, they end up duplicated. Immich detects duplicates by hash but edge cases need manual review.

## What's still missing

Immich is still in active development and calls itself "beta". A few friction points:

- **No non-destructive editing**: basic retouching (crop, brightness) isn't there yet
- **Facial recognition takes time**: on a large library, the ML models run for hours on first start
- **Frequent updates**: the team ships new versions every week, which sometimes means database migrations to follow

It's still the best self-hosted tool in this category, and it improves fast.
