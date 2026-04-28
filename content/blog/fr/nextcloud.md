---
title: "Nextcloud : mon Google Drive personnel"
description: "Pourquoi et comment j'ai migré vers Nextcloud pour stocker et synchroniser mes fichiers, remplacer Google Drive et Calendar."
date: "2025-01-08"
tags: ["Nextcloud", "Docker", "Infra"]
draft: false
---

## Pourquoi Nextcloud ?

Quand on fait du homelab et qu'on a déjà un NAS ou un disque dédié, avoir son propre cloud c'est une évidence. Le stockage est là, le serveur tourne déjà, autant en faire quelque chose d'utilisable plutôt que de payer un abonnement Google ou iCloud.

Nextcloud transforme ce stockage en cloud complet : sync automatique sur tous les appareils, partage de fichiers, calendrier, contacts. Tout ça tourne chez soi, sur du matériel qu'on contrôle.

## Installation via Docker

Nextcloud se déploie en Docker Compose avec une base de données PostgreSQL et Redis pour le cache :

```yaml
services:
  nextcloud:
    image: nextcloud:latest
    environment:
      POSTGRES_HOST: db
      POSTGRES_DB: nextcloud
      POSTGRES_USER: nextcloud
      POSTGRES_PASSWORD: ${DB_PASS}
      REDIS_HOST: redis
      NEXTCLOUD_TRUSTED_DOMAINS: nextcloud.mondomaine.fr
    volumes:
      - ./data:/var/www/html/data
      - ./config:/var/www/html/config

  db:
    image: postgres:16
    environment:
      POSTGRES_DB: nextcloud
      POSTGRES_USER: nextcloud
      POSTGRES_PASSWORD: ${DB_PASS}

  redis:
    image: redis:alpine
```

Le dossier `data` contient les fichiers des utilisateurs. Je le monte sur le HDD du serveur pour ne pas saturer le NVMe.

## Configuration

**Authentik SSO** : les utilisateurs se connectent avec leur compte Authentik via OIDC. Plus besoin de gérer des comptes séparés dans Nextcloud.

**Collabora Online** : Nextcloud Office permet d'éditer des documents directement dans le navigateur, comme Google Docs. Il faut déployer un serveur Collabora séparé et le connecter à Nextcloud. Les performances sont correctes pour un usage occasionnel, pas idéales pour de la collaboration intensive en temps réel.

## Performances et optimisations

Par défaut, Nextcloud n'est pas très rapide. Quelques réglages qui changent vraiment la donne :

- **Redis** pour le cache de sessions et le cache distribué. Sans ça, chaque requête relit la config depuis la base de données.
- **APCu** pour le cache local en mémoire. À activer dans `config.php` avec `memcache.local`.
- **Opcache PHP** pour compiler et mettre en cache le code PHP. Activé par défaut dans l'image officielle mais les valeurs par défaut sont conservatrices.

Avec ces trois éléments configurés, l'interface devient nettement plus réactive.

## Ce que j'utilise vraiment

- **Sync fichiers** : client desktop sur Linux et Windows, sync automatique du dossier Documents
- **Calendrier et contacts** : sync CalDAV/CardDAV avec les apps système iOS et Android
- **Partage** : liens de partage temporaires pour envoyer des fichiers lourds sans passer par WeTransfer

Sur ProxFibre, Nextcloud sert aussi de base de travail pour le club : partage de docs internes, coordination sur les projets d'infra, stockage partagé entre les membres.
