---
title: "Hosting a modded Minecraft server on Proxmox"
description: "How I deployed MolyCube, a self-hosted modded Minecraft server with a custom Modrinth modpack, Crafty Controller and NeoForge."
date: "2025-01-10"
tags: ["Linux", "Docker", "Infra"]
draft: false
---

## Context

MolyCube is a modded Minecraft server I host. The idea: a world with a narrative progression through eras (The Dawn, The Rise, The Industrial Age...), mods added over time, and a community of players building together.

Proxmox runs 24/7 anyway — might as well host the server there rather than keeping a dedicated machine running.

## Custom modpack on Modrinth

The MolyCube modpack is built and published on Modrinth. The advantage over a pre-made modpack: you pick exactly the mods you want, control the versions, and Modrinth handles dependencies automatically.

The pack runs on NeoForge and includes:

- **Terralith**: complete overhaul of biome generation
- **Incendium**: fully regenerated Nether
- **MineColonies**: found and manage colonies with AI citizens
- **Lightman's Currency**: player-to-player economy system
- **Create**: automation and trains to connect colonies

Each new server era comes with a modpack update adding new mods.

## Installation with Crafty Controller

I use Crafty Controller, a web-based Minecraft server management interface. It deploys in Docker and gives access to a console, logs, backups and file management from a browser.

```yaml
services:
  crafty:
    image: registry.gitlab.com/crafty-controller/crafty-4:latest
    ports:
      - "8443:8443"
      - "25565:25565"
    volumes:
      - ./backups:/crafty/backups
      - ./logs:/crafty/logs
      - ./servers:/crafty/servers
      - ./config:/crafty/config
    restart: unless-stopped
```

From the interface, create a NeoForge server, upload the `.mrpack` exported from Modrinth, and Crafty downloads the mods and starts the server. Modpack updates are done by re-importing the file from the interface.

## JVM configuration

A modded server is memory-hungry and sensitive to garbage collection pauses. The Aikar flags are the reference for tuning G1GC and avoiding freezes:

```
-XX:+UseG1GC
-XX:+ParallelRefProcEnabled
-XX:MaxGCPauseMillis=200
-XX:+UnlockExperimentalVMOptions
-XX:+DisableExplicitGC
-XX:G1NewSizePercent=30
-XX:G1MaxNewSizePercent=40
-XX:G1HeapRegionSize=8M
-XX:G1ReservePercent=20
-XX:G1HeapWastePercent=5
-XX:InitiatingHeapOccupancyPercent=15
```

## Access and integration

The server is not publicly exposed. Access goes through Pangolin: without a VPN connection, the server is invisible from the outside. This avoids exposing port 25565 to the internet and getting hit with bots and unwanted connection attempts.

World backups are managed by Crafty and included in Proxmox's daily backup job.
