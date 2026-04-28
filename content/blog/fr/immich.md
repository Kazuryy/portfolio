---
title: "Immich : adieu Google Photos"
description: "Immich est l'alternative self-hosted à Google Photos. Reconnaissance faciale, géolocalisation, apps mobiles : retour d'expérience."
date: "2025-01-09"
tags: ["Immich", "Docker", "Infra"]
draft: false
---

## Pourquoi Immich ?

Même logique que Nextcloud : quand le stockage est déjà là, autant l'utiliser. Google Photos compresse les photos au-delà d'un certain quota, et les 15 Go gratuits partent vite.

Immich est l'alternative self-hosted la plus aboutie aujourd'hui. Interface propre, apps mobiles iOS et Android bien faites, et des fonctionnalités qui rivalisent vraiment avec Google Photos.

## Ce que ça fait

Immich va bien au-delà d'un simple stockage de photos :

- **Sauvegarde automatique** depuis le mobile, en arrière-plan
- **Reconnaissance faciale** : regroupe automatiquement les photos par personne
- **Géolocalisation** : carte interactive avec les lieux de prise de vue
- **Albums partagés** : partager une sélection avec quelqu'un sans qu'il ait besoin d'un compte
- **Recherche sémantique** : chercher "chien sur la plage" et trouver les photos correspondantes sans avoir tagué quoi que ce soit
- **Timeline** : vue chronologique identique à Google Photos

## Installation

Immich se déploie via Docker Compose. La stack inclut le serveur principal, un microservice machine learning pour la reconnaissance et la recherche, PostgreSQL avec l'extension pgvecto.rs, et Redis :

```yaml
services:
  immich-server:
    image: ghcr.io/immich-app/immich-server:release
    volumes:
      - ./upload:/usr/src/app/upload
    environment:
      DB_HOSTNAME: database
      DB_PASSWORD: ${DB_PASS}
      REDIS_HOSTNAME: redis

  immich-machine-learning:
    image: ghcr.io/immich-app/immich-machine-learning:release
    volumes:
      - ./model-cache:/cache

  database:
    image: ghcr.io/immich-app/postgres:14-vectorchord0.3.0-pgvectors0.2.0
    environment:
      POSTGRES_PASSWORD: ${DB_PASS}
      POSTGRES_DB: immich

  redis:
    image: redis:alpine
```

Le dossier `upload` contient toutes les photos. Je le monte sur le HDD, pas sur le NVMe.

## Migration depuis Google Photos

Google Takeout permet d'exporter toutes ses photos en archives ZIP. Immich a un outil d'import en ligne de commande qui gère les métadonnées JSON exportées par Google (dates, géolocalisation) :

```bash
immich upload --recursive ./takeout
```

Le principal problème : les doublons. Si des photos étaient déjà sur le téléphone et ont été importées via l'app, elles se retrouvent en double. Immich détecte les doublons par hash mais il faut vérifier manuellement les cas limites.

## Ce qui manque encore

Immich est encore en développement actif et se qualifie lui-même de "beta". Quelques points de friction :

- **Pas d'édition non-destructive** : les retouches basiques (recadrage, luminosité) ne sont pas encore là
- **La reconnaissance faciale demande du temps** : sur une grande bibliothèque, les modèles ML tournent pendant des heures au premier démarrage
- **Les mises à jour sont fréquentes** : l'équipe sort des versions toutes les semaines, ce qui veut dire parfois des migrations de base de données à suivre

Ça reste le meilleur outil self-hosted dans cette catégorie, et ça s'améliore vite.
