---
title: "Homelab"
description: "Infrastructure self-hosted complète : Proxmox, Unifi, Authentik SSO, Nextcloud, Immich, Pangolin et Tailscale."
date: "2023-09-01"
tags: ["Proxmox", "Docker", "Linux", "Ansible", "Authentik"]
status: "Actif"
featured: true
order: 1
---

## Vue d'ensemble

Mon homelab est une infrastructure self-hosted que je construis et fais évoluer depuis 2023. Ce qui a commencé comme un projet personnel pour ne plus dépendre des services cloud commerciaux est progressivement devenu une petite plateforme partagée avec un cercle restreint d'amis (chacun avec son propre compte, son stockage et son accès aux services).

L'objectif était de construire quelque chose qui fonctionne vraiment : fiable, sécurisé, maintenable, et où je comprends chaque couche.

## Réseau & exposition

L'un des choix fondamentaux a été de ne jamais ouvrir de port sur la box. Tous les services publics sont exposés via **Pangolin**, une alternative auto-hébergée à Cloudflare Tunnel. Il crée un tunnel chiffré vers un VPS, gère le reverse proxy, les certificats SSL automatiques, et impose un contrôle d'accès SSO sur chaque requête.

La contrepartie : les apps natives (clients mobiles, outils de sync desktop) ne savent pas gérer les redirections SSO. Pangolin intègre son propre VPN pour ça : les appareils se connectent directement via mon instance en contournant la couche SSO. Les ACL restent sur une seule stack.

**Tailscale** tourne en parallèle pour un usage différent : accès personnel aux services internes qui ne sont pas exposés via Pangolin.

Le réseau lui-même est segmenté en VLANs (appareils de confiance, serveurs, IoT, invités) avec des règles de firewall gérées via la stack UniFi.

## Virtualisation & orchestration

Proxmox VE fait tourner l'ensemble. Le choix entre LXC et KVM dépend surtout du besoin d'isolation : les services légers vont dans des conteneurs LXC, tout ce qui nécessite un environnement complet (ou que je ne veux pas en contact avec l'hôte) part dans une VM KVM.

Les stacks Docker sont gérées via **Dokploy** : un PaaS auto-hébergé minimaliste avec interface web, logs en temps réel et redéploiements déclenchés depuis Git. Ça rend les déploiements simples sans nécessiter un setup Kubernetes.

## Identité & accès

Chaque service passe par **Authentik** pour l'authentification (OAuth2/OIDC, un compte par utilisateur). Le flux SSO est invisible dans le navigateur : on accède à une URL, on est redirigé vers Authentik, on se connecte une fois, et on est authentifié partout. Pour les utilisateurs de la plateforme, ça signifie un seul identifiant pour tous les services, avec 2FA et gestion des sessions au même endroit.

## Services

La plateforme fait actuellement tourner :

- **Nextcloud** : stockage de fichiers, synchronisation calendrier et contacts, dossiers partagés
- **Immich** : backup photo avec reconnaissance faciale par IA et recherche intelligente
- **Grafana + Prometheus** : monitoring de l'infrastructure, dashboards et alertes
- **Crafty Controller** : gestion du serveur Minecraft moddé pour une petite communauté
- **Termix** : accès SSH, gestionnaire de fichiers et gestion Docker depuis le navigateur, en remplacement de noVNC pour l'administration quotidienne

## Automatisation

Ansible couvre le provisioning des VMs et des LXC : configuration des paquets, réseau, création des utilisateurs. L'objectif est une reproductibilité totale : chaque nœud doit pouvoir être reconstruit depuis zéro avec une seule commande, sans étape manuelle.

## Matériel

Le setup tourne sur quelques machines : un Minisforum UM790 Pro comme nœud Proxmox principal, un PC fixe en secondaire, un Dell Optiplex pour les workloads légers, et un NAS Synology DS923+ pour le stockage. Rien d'exotique, la partie intéressante c'est ce qui tourne dessus.
