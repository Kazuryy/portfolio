---
title: "Dokploy: Docker deployment without the complexity of Kubernetes"
description: "Dokploy simplifies Docker service deployment and management. My experience after adopting it as a Portainer alternative."
date: "2025-01-05"
tags: ["Dokploy", "Docker", "Infra"]
draft: false
---

## The need

When the number of Docker services starts growing, managing everything by hand gets tedious. Restarting a service after a crash, checking logs, updating an image, managing environment variables. Doable, but it's time spent on repetitive tasks.

I needed an interface that centralises all of that without adding too heavy an abstraction layer.

## Dokploy in a nutshell

Dokploy is an open-source deployment platform. It manages Docker services (Compose stacks or single images) from a web interface, with:

- Deployment from a Git repository (push -> automatic redeploy)
- Per-service environment variable management
- Real-time logs
- Basic monitoring (CPU, RAM, network)
- TLS certificate management via built-in Traefik
- Configurable backups

Everything runs in Docker on the host server, no cluster or remote agent needed.

## Installation

A single script to run on the server:

```bash
curl -sSL https://dokploy.com/install.sh | sh
```

Dokploy installs itself as a Docker Compose stack on port 3000. After installation, configure the domain, TLS certificate, and it's accessible from the web interface.

## Comparison with Portainer and Coolify

**Portainer** is lower-level — essentially a UI over the Docker daemon. Great for inspecting containers, managing volumes and networks. But for continuous deployment from Git, it's limited without Portainer Business.

**Coolify** is Dokploy's direct competitor. Both are open-source, both deploy from Git, both handle TLS automatically. Dokploy is newer but lighter and simpler to configure. Coolify has more features (managed databases, services) but a heavier interface.

For a solo homelab, both work. I chose Dokploy because the interface is cleaner and the initial setup faster.

## What I actually use

Dokploy manages most of my services:

- **Nextcloud**: Compose stack with PostgreSQL and Redis
- **Immich**: Compose stack with the machine learning part
- **Authentik**: Compose stack with its database
- **Gitea**: simple Docker image
- **Grafana + Prometheus**: monitoring stack

Redeploys happen in one click from the interface, or automatically via a GitHub webhook when I push to the service's repo.

What I still manage manually: Proxmox itself, and a few lightweight LXC containers that don't need an interface.
