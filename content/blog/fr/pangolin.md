---
title: "Pangolin : exposer ses services sans IP fixe"
description: "Pangolin est un reverse proxy avec tunnels VPN intégré. L'alternative open-source à Cloudflare Tunnel pour exposer son homelab proprement."
date: "2025-01-03"
tags: ["Pangolin", "Réseau", "Infra"]
draft: false
---

## Le problème : pas d'IP fixe

La plupart des FAI résidentiels attribuent une IP dynamique. Elle change régulièrement. Certains mettent carrément leurs abonnés derrière du CG-NAT, ce qui rend l'ouverture de ports impossible côté box.

Résultat : impossible d'exposer ses services homelab directement depuis chez soi de manière fiable.

Les solutions classiques : un VPS avec une IP fixe qui sert de point de sortie, ou Cloudflare Tunnel (gratuit mais les données passent chez Cloudflare). Pangolin fait la même chose que Cloudflare Tunnel, mais en self-hosted.

## Ce que fait Pangolin

Pangolin crée un tunnel chiffré entre ton serveur chez toi et un VPS que tu contrôles. Le trafic entrant arrive sur le VPS, traverse le tunnel, et atteint le service sur ton homelab, sans que tu aies besoin d'ouvrir un seul port sur ta box.

Côté architecture :
- **Pangolin** tourne sur le VPS et gère le routage des requêtes
- **Newt** est l'agent léger qui tourne sur le homelab et maintient le tunnel vers le VPS
- **Traefik** s'occupe du reverse proxy et du TLS (certificats Let's Encrypt automatiques)

## Installation et configuration

Pangolin se déploie via Docker. Sur le VPS :

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

Sur le homelab, Newt tourne en conteneur LXC et se connecte au VPS via un token généré dans l'interface Pangolin. Une fois le tunnel établi, tu déclares tes services dans l'interface et ils sont immédiatement accessibles via le sous-domaine configuré.

## Pangolin vs Cloudflare Tunnel vs Tailscale

| | Pangolin | Cloudflare Tunnel | Tailscale |
|---|---|---|---|
| Self-hosted | ✓ | ✗ | ✗ (Headscale pour ça) |
| Gratuit | VPS requis | Oui | Freemium |
| Trafic chiffré | ✓ | ✓ | ✓ |
| Exposition publique | ✓ | ✓ | Non (réseau privé ou gestion d'accès difficile) |
| Interface web | ✓ | ✓ | ✓ |

Tailscale n'est pas vraiment comparable, c'est un VPN mesh pour accès privé, pas pour l'exposition publique. Pour exposer des services à des utilisateurs qui n'ont pas Tailscale installé, il faut Pangolin ou Cloudflare Tunnel.

## Mon usage

J'expose via Pangolin :

- **Nextcloud** : accessible depuis n'importe où pour la sync de fichiers
- **Immich** : pour l'app mobile iOS
- **Authentik** : le SSO doit être joignable pour que les redirections OAuth fonctionnent
- **Gitea** : accès SSH et HTTPS pour les dépôts

Les services internes (Grafana, Proxmox, Dokploy) restent derrière Tailscale, pas besoin qu'ils soient publics.
