---
title: "Homelab"
description: "Infrastructure self-hosted complète : Proxmox, Unifi, Authentik SSO, Nextcloud, Immich, Dokploy et Pangolin."
date: "2023-09-01"
tags: ["Proxmox", "Docker", "Linux", "Ansible", "Authentik"]
status: "En cours"
featured: true
order: 1
---

## Vue d'ensemble

Mon homelab est une infrastructure self-hosted que je construis et fais évoluer depuis 2023. L'objectif : maîtriser la stack complète, du réseau physique à la couche applicative, en hébergeant moi-même les services que j'utilise au quotidien.

## Matériel

Plusieurs machines font tourner le homelab :

- **Minisforum UM790 Pro** : nœud principal, AMD Ryzen 9 7940HS
- **PC fixe** : AMD Ryzen 7 3700X, RX 6600 XT
- **Dell Optiplex 7010** : Intel Core i3-3240, usage léger
- **Synology DS923+** : NAS, 16 To de stockage

Côté réseau :

- **UniFi Switch Lite 8 PoE** : switch principal avec alimentation PoE
- **UniFi U6** : access point Wi-Fi 6
- **UniFi Cloud Gateway Ultra** : routeur/gateway

## Réseau

Le réseau est segmenté en VLANs par type d'usage : appareils de confiance, serveurs, IoT, invités. Les règles de firewall entre VLANs sont gérées dans l'interface Unifi.

Pangolin expose les services publics via un tunnel chiffré vers un VPS, sans ouvrir de port sur la box. Les services internes sont accessibles via Tailscale.

## Virtualisation & orchestration

Proxmox VE est l'hyperviseur principal. Les services légers tournent dans des conteneurs LXC, les services qui nécessitent un environnement isolé dans des VMs KVM.

Dokploy gère le déploiement et le cycle de vie des stacks Docker : interface web, logs en temps réel, redéploiements depuis Git.

## Identité & accès

Authentik centralise l'authentification sur tous les services via OAuth2/OIDC. Un seul compte pour Nextcloud, Gitea, Grafana, Immich et les autres.

## Services déployés

- **Nextcloud** : stockage et synchronisation de fichiers, calendrier, contacts
- **Immich** : gestion et sauvegarde de photos avec reconnaissance faciale
- **Gitea** : instance Git légère auto-hébergée
- **Grafana + Prometheus** : monitoring de l'infrastructure
- **Crafty Controller** : gestion du serveur Minecraft

## Automatisation

Ansible gère la configuration des VMs et des LXC : provisioning, déploiement des paquets, configuration réseau. L'objectif est que chaque machine soit reproductible depuis zéro sans intervention manuelle.
