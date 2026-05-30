---
title: "Termix : gérer ses serveurs depuis le navigateur"
description: "Retour d'expérience sur Termix, une plateforme self-hosted de gestion de serveurs : terminal SSH, fichiers, Docker, et pourquoi ça remplace avantageusement noVNC."
date: "2026-04-30"
tags: ["Infra", "Self-hosting", "Linux"]
draft: false
---

## Le problème avec noVNC

noVNC, c'est utile pour déboguer un serveur qui ne répond plus au SSH. Mais l'utiliser au quotidien pour administrer une infra, c'est pénible : pas de copier-coller natif, latence visible, et une ergonomie qui rappelle les consoles KVM des années 2000.

Sur ProxFibre, on donnait aux élèves un accès noVNC à leurs VMs de lab. Techniquement ça marchait. En pratique, personne n'arrivait à travailler efficacement dedans.

## Ce qu'est Termix

Termix est une plateforme de gestion de serveurs self-hosted, accessible depuis le navigateur. Elle centralise en un seul endroit :

- **Terminal SSH** avec onglets, split-screen jusqu'à 4 panneaux et thèmes configurables
- **Gestionnaire de fichiers** : navigation, upload, download, édition de code directement dans le navigateur
- **Gestion Docker** : démarrer, arrêter, supprimer des conteneurs, voir les stats et accéder à `docker exec`
- **Monitoring** : CPU, RAM, stockage, réseau en temps réel
- **Bureau distant** : RDP, VNC et Telnet via le navigateur

C'est open-source, gratuit, et ça se déploie en une commande Docker.

## Déploiement

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

L'interface est accessible sur le port 8080. Les connexions aux serveurs se configurent dans l'interface : adresse, port, clé SSH ou mot de passe. Termix ne stocke pas les credentials en clair.

## Mon usage personnel

Je l'ai déployé sur mon homelab il y a environ un mois. Depuis, c'est l'outil que j'ouvre en premier quand je dois intervenir sur un serveur.

Ce qui change concrètement :

- **Copier-coller qui fonctionne.** Ça paraît basique mais c'est la première chose qu'on remarque en venant de noVNC.
- **Le gestionnaire de fichiers.** Parcourir et éditer des fichiers de config sans sortir du navigateur, c'est un vrai gain de temps.
- **Le split-screen.** Avoir un terminal sur le serveur A et un autre sur le serveur B côte à côte dans le même onglet, c'est pratique pour déboguer des problèmes réseau entre deux machines.

La partie Docker, je l'utilise moins depuis que Dockhand gère mes stacks, mais elle est utile pour jeter un oeil rapide à l'état d'un conteneur.

## Intégration à ProxFibre

On a déployé une instance Termix dédiée à ProxFibre, exposée via Pangolin avec authentification SSO par Authentik.

Deux usages :

**Administration de l'infra.** Les membres du club accèdent aux serveurs Proxmox, aux conteneurs LXC et aux VMs directement depuis Termix. Plus besoin d'avoir une clé SSH configurée localement ou de passer par la console Proxmox.

**Accès élèves aux labs.** Quand un étudiant a un lab provisionné (une VM Ubuntu, un pfSense), il se connecte via Termix plutôt que noVNC. Le terminal est réactif, le copier-coller fonctionne, et on peut leur donner un accès restreint uniquement aux machines qui leur sont attribuées via les ACL.

## Termix vs les alternatives

| | Termix | noVNC | Wetty / ttyd |
|---|---|---|---|
| Terminal SSH | ✓ | ✗ (VNC uniquement) | ✓ |
| Copier-coller | ✓ | Limité | ✓ |
| Gestionnaire de fichiers | ✓ | ✗ | ✗ |
| Docker | ✓ | ✗ | ✗ |
| RDP / VNC | ✓ | ✓ | ✗ |
| Self-hosted | ✓ | ✓ | ✓ |

Wetty et ttyd font bien le terminal dans le navigateur, mais s'arrêtent là. noVNC est indispensable pour les VMs sans SSH (boot, recovery, Windows). Termix se positionne entre les deux : plus complet que Wetty, plus pratique que noVNC pour le travail quotidien.

En pratique, les deux coexistent : noVNC reste dans Proxmox pour les cas d'urgence, Termix pour tout le reste.
