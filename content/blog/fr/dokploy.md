---
title: "Dokploy : déploiement Docker sans la complexité de Kubernetes"
description: "Dokploy simplifie le déploiement et la gestion de services Docker. Mon retour après l'avoir adopté comme alternative à Portainer."
date: "2025-01-05"
tags: ["Dokploy", "Docker", "Infra"]
draft: false
---

## Le besoin

Quand le nombre de services Docker commence à grossir, gérer tout à la main devient pénible. Redémarrer un service après un crash, vérifier les logs, mettre à jour une image, gérer les variables d'environnement. C'est faisable, mais c'est du temps passé sur des tâches répétitives.

J'avais besoin d'une interface qui centralise tout ça sans ajouter une couche d'abstraction trop lourde.

## Dokploy en quelques mots

Dokploy est une plateforme de déploiement open-source. Elle permet de gérer des services Docker (compose ou image seule) depuis une interface web, avec :

- Déploiement depuis un dépôt Git (push -> redéploiement automatique)
- Gestion des variables d'environnement par service
- Logs en temps réel
- Monitoring basique (CPU, RAM, réseau)
- Gestion des certificats TLS via Traefik intégré
- Backups configurables

Tout tourne dans Docker sur le serveur hôte, sans cluster ni agent distant.

## Installation

Un seul script à exécuter sur le serveur :

```bash
curl -sSL https://dokploy.com/install.sh | sh
```

Dokploy s'installe lui-même en tant que stack Docker Compose sur le port 3000. Après l'installation, on configure le domaine, le certificat TLS, et c'est accessible depuis l'interface web.

## Comparaison avec Portainer et Coolify

**Portainer** est plus bas niveau, c'est essentiellement une UI sur le daemon Docker. Très complet pour inspecter des conteneurs, gérer des volumes, des networks. Mais pour le déploiement continu depuis Git, c'est limité sans Portainer Business.

**Coolify** est le concurrent direct de Dokploy. Les deux sont open-source, les deux font du déploiement depuis Git, les deux gèrent le TLS automatiquement. Dokploy est plus jeune mais plus léger et plus simple à configurer. Coolify a plus de fonctionnalités (hébergement de bases de données, services managés) mais l'interface est plus chargée.

Pour un usage homelab solo, les deux fonctionnent. J'ai choisi Dokploy parce que l'interface est plus claire et la configuration initiale plus rapide.

## Ce que j'utilise vraiment

Dokploy gère la majorité de mes services :

- **Nextcloud** : stack Compose avec PostgreSQL et Redis
- **Immich** : stack Compose avec la partie machine learning
- **Authentik** : stack Compose avec sa base de données
- **Gitea** : image Docker simple
- **Grafana + Prometheus** : stack de monitoring

Les redéploiements se font en un clic depuis l'interface ou automatiquement via un webhook GitHub quand je push sur le repo du service.

Ce que je gère encore à la main : Proxmox lui-même, et les quelques LXC légers qui n'ont pas besoin d'interface.
