---
title: "Homelab"
description: "Full self-hosted infrastructure: Proxmox, Unifi, Authentik SSO, Nextcloud, Immich, Pangolin and Tailscale."
date: "2023-09-01"
tags: ["Proxmox", "Docker", "Linux", "Ansible", "Authentik"]
status: "Actif"
featured: true
order: 1
---

## Overview

My homelab is a self-hosted infrastructure I've been building and evolving since 2023. What started as a personal project to stop relying on commercial cloud services gradually became a small platform shared with a close circle of friends (each with their own account, storage, and access to the services).

The goal was to build something that actually works: reliable, secure, maintainable, and where I understand every layer.

## Networking & exposure

One of the core design choices was never opening ports on the home router. All public-facing services are exposed through **Pangolin**, a self-hosted alternative to Cloudflare Tunnel. It creates an encrypted tunnel to a VPS, handles reverse proxying, automatic SSL, and enforces SSO-based access control on every request.

The tradeoff is that native apps (mobile clients, desktop sync tools) can't handle SSO redirects. Pangolin includes its own VPN for this: devices connect through my instance directly, bypassing the SSO layer. ACL management stays on one stack.

**Tailscale** runs alongside for a different purpose: personal access to internal services that aren't exposed through Pangolin at all.

The network itself is segmented into VLANs (trusted devices, servers, IoT, guests) with firewall rules managed through the UniFi stack.

## Virtualisation & orchestration

Proxmox VE runs everything. The choice between LXC and KVM is mostly about isolation needs: lightweight services get LXC containers, anything that requires a full environment (or that I don't want touching the host) gets a KVM VM.

Docker stacks are managed through **Dokploy**: a lightweight self-hosted PaaS with a web interface, real-time logs, and Git-triggered redeploys. It keeps deployment straightforward without requiring a full Kubernetes setup.

## Identity & access

Every service goes through **Authentik** for authentication (OAuth2/OIDC, one account per user). The SSO flow is invisible in the browser: you hit a service URL, get redirected to Authentik, log in once, and you're in everywhere. For users sharing the platform, this means a single set of credentials for all services, with 2FA and session management in one place.

## Services

The platform currently runs:

- **Nextcloud**: file storage, calendar and contact sync, shared folders
- **Immich**: photo backup with AI-based facial recognition and search
- **Grafana + Prometheus**: infrastructure monitoring, dashboards and alerts
- **Crafty Controller**: modded Minecraft server management for a small community
- **Termix**: SSH access, file manager and Docker management from the browser, replacing noVNC for daily administration

## Automation

Ansible covers VM and LXC provisioning: package setup, network configuration, user creation. The goal is full reproducibility: every node should be rebuildable from scratch with a single command, with no manual steps.

## Hardware

The setup runs on a few machines: a Minisforum UM790 Pro as the main Proxmox node, a desktop as secondary, a Dell Optiplex for light workloads, and a Synology DS923+ NAS for storage. Nothing exotic, the interesting part is what runs on it.
