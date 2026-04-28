---
title: "Homelab"
description: "Full self-hosted infrastructure: Proxmox, Unifi, Authentik SSO, Nextcloud, Immich, Dokploy and Pangolin."
date: "2023-09-01"
tags: ["Proxmox", "Docker", "Linux", "Ansible", "Authentik"]
status: "En cours"
featured: true
order: 1
---

## Overview

My homelab is a self-hosted infrastructure I've been building and evolving since 2023. The goal: own the full stack, from physical networking to the application layer, running the services I use daily on my own hardware.

## Hardware

Several machines make up the homelab:

- **Minisforum UM790 Pro**: main node, AMD Ryzen 9 7940HS
- **Desktop PC**: AMD Ryzen 7 3700X, RX 6600 XT
- **Dell Optiplex 7010**: Intel Core i3-3240, light workloads
- **Synology DS923+**: NAS, 16 TB storage

Networking:

- **UniFi Switch Lite 8 PoE**: main switch with PoE ports
- **UniFi U6**: Wi-Fi 6 access point
- **UniFi Cloud Gateway Ultra**: router/gateway

## Networking

The network is segmented into VLANs by usage type: trusted devices, servers, IoT, guests. Firewall rules between VLANs are managed in the Unifi interface.

Pangolin exposes public-facing services through an encrypted tunnel to a VPS, without opening any ports on the home router. Internal services are accessible via Tailscale.

## Virtualisation & orchestration

Proxmox VE is the main hypervisor. Lightweight services run in LXC containers, services that need an isolated environment run in KVM VMs.

Dokploy handles Docker stack deployment and lifecycle: web interface, real-time logs, Git-triggered redeploys.

## Identity & access

Authentik centralises authentication across all services via OAuth2/OIDC. One account for Nextcloud, Gitea, Grafana, Immich and the rest.

## Deployed services

- **Nextcloud**: file storage and sync, calendar, contacts
- **Immich**: photo management and backup with facial recognition
- **Gitea**: lightweight self-hosted Git instance
- **Grafana + Prometheus**: infrastructure monitoring
- **Crafty Controller**: Minecraft server management

## Automation

Ansible handles VM and LXC configuration: provisioning, package deployment, network setup. The goal is for every machine to be reproducible from scratch without manual intervention.
