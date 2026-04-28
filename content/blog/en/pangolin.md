---
title: "Pangolin: exposing services without a static IP"
description: "Pangolin is a reverse proxy with built-in VPN tunnels. The open-source alternative to Cloudflare Tunnel for cleanly exposing your homelab."
date: "2025-01-03"
tags: ["Pangolin", "Network", "Infra"]
draft: false
---

## The problem: no static IP

Most residential ISPs assign a dynamic IP that changes regularly. Some put subscribers behind CG-NAT, making port forwarding impossible entirely.

Result: no reliable way to expose homelab services directly from home.

The usual workarounds: a VPS with a static IP as an exit point, or Cloudflare Tunnel (free, but your traffic goes through Cloudflare). Pangolin does the same thing as Cloudflare Tunnel, but self-hosted.

## What Pangolin does

Pangolin creates an encrypted tunnel between your home server and a VPS you control. Incoming traffic arrives at the VPS, goes through the tunnel, and reaches the service on your homelab — without opening a single port on your router.

Architecture:
- **Pangolin** runs on the VPS and handles request routing
- **Newt** is the lightweight agent running on the homelab, maintaining the tunnel to the VPS
- **Traefik** handles reverse proxying and TLS (automatic Let's Encrypt certificates)

## Installation and configuration

Pangolin deploys via Docker on the VPS:

```yaml
services:
  pangolin:
    image: fosrl/pangolin
    restart: unless-stopped
    volumes:
      - ./config:/app/config
      - ./data:/app/data

  traefik:
    image: traefik:v3
    restart: unless-stopped
    ports:
      - "443:443"
    volumes:
      - ./traefik:/etc/traefik
      - /var/run/docker.sock:/var/run/docker.sock
```

On the homelab, Newt runs in an LXC container and connects to the VPS using a token generated in the Pangolin interface. Once the tunnel is established, you declare your services in the interface and they're immediately reachable via their configured subdomain.

## Pangolin vs Cloudflare Tunnel vs Tailscale

| | Pangolin | Cloudflare Tunnel | Tailscale |
|---|---|---|---|
| Self-hosted | ✓ | ✗ | ✗ (Headscale for that) |
| Free | VPS required | Yes | Freemium |
| Encrypted traffic | ✓ | ✓ | ✓ |
| Public exposure | ✓ | ✓ | No (private network) |
| Web interface | ✓ | ✓ | ✓ |

Tailscale isn't really comparable — it's a mesh VPN for private access, not public exposure. For services you want to reach without Tailscale installed, you need Pangolin or Cloudflare Tunnel.

## My usage

I expose via Pangolin:

- **Nextcloud**: accessible from anywhere for file sync
- **Immich**: for the iOS mobile app
- **Authentik**: the SSO needs to be reachable for OAuth redirects to work
- **Gitea**: SSH and HTTPS access to repositories

Internal services (Grafana, Proxmox, Dokploy) stay behind Tailscale — no need for them to be public.
