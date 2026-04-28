---
title: "Héberger un serveur Minecraft modé sur Proxmox"
description: "Comment j'ai déployé MolyCube, un serveur Minecraft modé auto-hébergé avec un modpack custom sur Modrinth, Crafty Controller et NeoForge."
date: "2025-01-10"
tags: ["Linux", "Docker", "Infra"]
draft: false
---

## Contexte

MolyCube est un serveur Minecraft modé que j'héberge. L'idée : un monde avec une progression narrative par ères (L'Aube, L'Essor, l'Ère Industrielle...), des mods qui s'ajoutent au fil du temps, et une communauté de joueurs qui construisent ensemble.

Proxmox tourne déjà H24, autant y mettre le serveur plutôt que de le faire tourner sur une machine dédiée.

## Modpack custom sur Modrinth

Le modpack MolyCube est composé et publié sur Modrinth. L'avantage par rapport à un modpack préfait : on choisit exactement les mods qu'on veut, on contrôle les versions, et Modrinth gère les dépendances automatiquement.

Le pack tourne sur NeoForge et inclut notamment :

- **Terralith** : refonte complète de la génération de biomes
- **Incendium** : Nether entièrement régénéré
- **MineColonies** : fondation et gestion de colonies avec citoyens IA
- **Lightman's Currency** : système économique entre joueurs
- **Create** : automatisation et trains pour relier les colonies

Chaque nouvelle ère du serveur s'accompagne d'une mise à jour du modpack avec de nouveaux mods ajoutés.

## Installation avec Crafty Controller

J'utilise Crafty Controller, une interface web de gestion de serveurs Minecraft. Ça se déploie en Docker et donne accès à une console, aux logs, aux backups et à la gestion des fichiers depuis un navigateur.

```yaml
services:
  crafty:
    image: registry.gitlab.com/crafty-controller/crafty-4:latest
    ports:
      - "8443:8443"
      - "25565:25565"
    volumes:
      - ./backups:/crafty/backups
      - ./logs:/crafty/logs
      - ./servers:/crafty/servers
      - ./config:/crafty/config
    restart: unless-stopped
```

Depuis l'interface, on crée un serveur NeoForge, on upload le `.mrpack` exporté depuis Modrinth, et Crafty télécharge les mods et démarre le serveur. Les mises à jour du modpack se font en réimportant le fichier depuis l'interface.

## Configuration JVM

Un serveur modé est gourmand en mémoire et sensible aux pauses de garbage collection. Les flags Aikar sont la référence pour tuner le G1GC et éviter les freezes :

```
-XX:+UseG1GC
-XX:+ParallelRefProcEnabled
-XX:MaxGCPauseMillis=200
-XX:+UnlockExperimentalVMOptions
-XX:+DisableExplicitGC
-XX:G1NewSizePercent=30
-XX:G1MaxNewSizePercent=40
-XX:G1HeapRegionSize=8M
-XX:G1ReservePercent=20
-XX:G1HeapWastePercent=5
-XX:InitiatingHeapOccupancyPercent=15
```

## Accès et intégration

Le serveur n'est pas exposé publiquement. L'accès passe par Pangolin : sans connexion VPN, le serveur est invisible depuis l'extérieur. Ça évite d'exposer le port 25565 sur internet et de se retrouver avec des bots et des tentatives de connexion non désirées.

Les sauvegardes du monde sont gérées par Crafty et incluses dans le job de backup quotidien de Proxmox.
