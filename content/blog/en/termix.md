---
title: "Termix: managing servers from the browser"
description: "A look at Termix, a self-hosted server management platform: SSH terminal, file manager, Docker, and why it's a better experience than noVNC."
date: "2026-04-30"
tags: ["Infra", "Self-hosting", "Linux"]
draft: false
---

## The problem with noVNC

noVNC is useful when a server stops responding to SSH. But using it day-to-day to manage infrastructure is painful: no native copy-paste, visible latency, and ergonomics that feel like a KVM console from the early 2000s.

At ProxFibre, we gave students noVNC access to their lab VMs. It technically worked. In practice, nobody could work efficiently in it.

## What Termix is

Termix is a self-hosted server management platform, accessible from the browser. It brings together in one place:

- **SSH terminal** with tabs, split-screen up to 4 panels, and configurable themes
- **File manager**: browse, upload, download, edit code directly in the browser
- **Docker management**: start, stop, remove containers, view stats and access `docker exec`
- **Monitoring**: real-time CPU, RAM, storage, network
- **Remote desktop**: RDP, VNC and Telnet through the browser

It's open-source, free, and deploys in a single Docker command.

## Deployment

```yaml
services:
  termix:
    image: ghcr.io/lukegus/termix:latest
    container_name: termix
    restart: unless-stopped
    ports:
      - "8080:8080"
    volumes:
      - termix-data:/app/data
    environment:
      PORT: "8080"
    depends_on:
      - guacd
    networks:
      - termix-net

  guacd:
    image: guacamole/guacd:1.6.0
    container_name: guacd
    restart: unless-stopped
    ports:
      - "4822:4822"
    networks:
      - termix-net

volumes:
  termix-data:
    driver: local

networks:
  termix-net:
    driver: bridge
```

The interface runs on port 8080. Server connections are configured there: address, port, SSH key or password. Termix doesn't store credentials in plaintext.

## Personal use

I deployed it on my homelab about a month ago. Since then, it's the first thing I open when I need to work on a server.

What concretely changes:

- **Copy-paste that works.** Sounds basic, but it's the first thing you notice coming from noVNC.
- **The file manager.** Browsing and editing config files without leaving the browser saves real time.
- **Split-screen.** Having a terminal on server A and another on server B side by side in the same tab is handy when debugging network issues between two machines.

I use the Docker section less since Dockhand manages my stacks, but it's useful for a quick look at a container's state.

## Integration at ProxFibre

We deployed a dedicated Termix instance for ProxFibre, exposed through Pangolin with Authentik SSO.

Two use cases:

**Infrastructure management.** Club members access Proxmox servers, LXC containers and VMs directly through Termix. No need for a locally configured SSH key or going through the Proxmox console.

**Student lab access.** When a student has a provisioned lab (an Ubuntu VM, a pfSense), they connect via Termix instead of noVNC. The terminal is responsive, copy-paste works, and we can restrict their access to only the machines assigned to them through ACLs.

## Termix vs the alternatives

| | Termix | noVNC | Wetty / ttyd |
|---|---|---|---|
| SSH terminal | ✓ | ✗ (VNC only) | ✓ |
| Copy-paste | ✓ | Limited | ✓ |
| File manager | ✓ | ✗ | ✗ |
| Docker | ✓ | ✗ | ✗ |
| RDP / VNC | ✓ | ✓ | ✗ |
| Self-hosted | ✓ | ✓ | ✓ |

Wetty and ttyd handle the browser terminal well but stop there. noVNC is essential for VMs without SSH (boot, recovery, Windows). Termix sits between the two: more complete than Wetty, more practical than noVNC for daily work.

In practice both coexist: noVNC stays in Proxmox for emergencies, Termix for everything else.
