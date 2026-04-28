---
title: "Nextcloud: my personal cloud"
description: "Why and how I set up Nextcloud to store and sync my files, replacing Google Drive and Calendar."
date: "2025-01-08"
tags: ["Nextcloud", "Docker", "Infra"]
draft: false
---

## Why Nextcloud?

When you run a homelab and already have a NAS or dedicated storage, having your own cloud is an obvious move. The storage is there, the server is already running — might as well make it useful instead of paying for a Google or iCloud subscription.

Nextcloud turns that storage into a full cloud: automatic sync across all devices, file sharing, calendar, contacts. All running on hardware you control.

## Installation via Docker

Nextcloud deploys with Docker Compose, a PostgreSQL database and Redis for caching:

```yaml
services:
  nextcloud:
    image: nextcloud:latest
    environment:
      POSTGRES_HOST: db
      POSTGRES_DB: nextcloud
      POSTGRES_USER: nextcloud
      POSTGRES_PASSWORD: ${DB_PASS}
      REDIS_HOST: redis
      NEXTCLOUD_TRUSTED_DOMAINS: nextcloud.yourdomain.com
    volumes:
      - ./data:/var/www/html/data
      - ./config:/var/www/html/config

  db:
    image: postgres:16
    environment:
      POSTGRES_DB: nextcloud
      POSTGRES_USER: nextcloud
      POSTGRES_PASSWORD: ${DB_PASS}

  redis:
    image: redis:alpine
```

The `data` folder holds user files. I mount it on the HDD to avoid filling up the NVMe.

## Configuration

**Authentik SSO**: users log in with their Authentik account via OIDC. No separate Nextcloud accounts to manage.

**Collabora Online**: Nextcloud Office lets you edit documents directly in the browser, like Google Docs. You need to deploy a separate Collabora server and connect it to Nextcloud. Performance is fine for occasional use, not ideal for intensive real-time collaboration.

## Performance and optimisations

Out of the box, Nextcloud isn't very fast. A few settings that make a real difference:

- **Redis** for session cache and distributed cache. Without it, every request re-reads the config from the database.
- **APCu** for local in-memory cache. Enable in `config.php` with `memcache.local`.
- **PHP Opcache** to compile and cache PHP code. Enabled by default in the official image but with conservative values.

With all three configured, the interface becomes noticeably more responsive.

## What I actually use

- **File sync**: desktop client on Linux and Windows, automatic sync of the Documents folder
- **Calendar and contacts**: CalDAV/CardDAV sync with iOS and Android system apps
- **Sharing**: temporary share links for sending large files without WeTransfer

On ProxFibre, Nextcloud also serves as the club's shared workspace: internal document sharing, coordination on infra projects, shared storage between members.
