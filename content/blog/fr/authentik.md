---
title: "Authentik : un seul compte pour tous mes services"
description: "Comment j'ai mis en place Authentik comme SSO centralisé sur ProxFibre : gérer les accès de dizaines d'élèves sur Gitea, Nextcloud et d'autres services sans se noyer dans les comptes."
date: "2025-01-07"
tags: ["Authentik", "Sécurité", "Infra"]
draft: false
---

## Le problème à l'échelle

Sur mon homelab perso, gérer les comptes à la main c'est gérable. Sur ProxFibre, c'est une autre histoire : des dizaines d'élèves qui ont besoin d'accéder à Gitea, Nextcloud, et d'autres services. Créer un compte par service et par personne à la main, c'est des heures de travail et une galère dès qu'il faut révoquer un accès ou qu'un élève oublie son mot de passe.

Authentik résout ça : un seul compte par utilisateur, un seul endroit pour tout gérer. On ajoute quelqu'un dans Authentik, il a accès à tous les services d'un coup. On le retire, il n'a plus accès à rien.

## Authentik en quelques mots

Authentik est un Identity Provider (IdP) open-source. Il supporte les protocoles standard : OAuth2/OIDC, SAML, LDAP, SCIM. La quasi-totalité des services self-hosted savent s'y connecter.

Il se distingue de Keycloak (l'autre grand nom du secteur) par une interface plus moderne et une configuration moins verbeuse. Keycloak est plus complet pour les environnements enterprise, Authentik est plus accessible pour un usage comme le nôtre.

## Installation

Authentik se déploie via Docker Compose. La stack officielle inclut le serveur, un worker pour les tâches asynchrones, PostgreSQL et Redis :

```yaml
services:
  postgresql:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: ${PG_PASS}
      POSTGRES_USER: authentik
      POSTGRES_DB: authentik

  redis:
    image: redis:alpine

  server:
    image: ghcr.io/goauthentik/server:latest
    command: server
    environment:
      AUTHENTIK_REDIS__HOST: redis
      AUTHENTIK_POSTGRESQL__HOST: postgresql
      AUTHENTIK_POSTGRESQL__PASSWORD: ${PG_PASS}
      AUTHENTIK_SECRET_KEY: ${AUTHENTIK_SECRET_KEY}
    ports:
      - "9000:9000"

  worker:
    image: ghcr.io/goauthentik/server:latest
    command: worker
    environment:
      AUTHENTIK_REDIS__HOST: redis
      AUTHENTIK_POSTGRESQL__HOST: postgresql
      AUTHENTIK_POSTGRESQL__PASSWORD: ${PG_PASS}
      AUTHENTIK_SECRET_KEY: ${AUTHENTIK_SECRET_KEY}
```

Après le premier démarrage, l'interface d'admin est accessible sur `/if/flow/initial-setup/` pour créer le compte admin.

## Intégrations

La plupart des services se connectent via OAuth2/OIDC, c'est le plus simple à configurer. Dans Authentik on crée une application et un provider, on récupère le client ID et le secret, et on les colle dans le service cible.

Services intégrés sur ProxFibre et mon homelab :

- **Gitea** : OAuth2, tous les élèves s'y connectent avec leur compte Authentik
- **Nextcloud** : OIDC
- **Grafana** : OAuth2
- **Immich** : OAuth2

Pour les services qui ne supportent pas OAuth2, Authentik propose un proxy d'authentification qui intercepte les requêtes et force la connexion avant d'accéder au service.

## MFA et sécurité

Authentik supporte le TOTP (Google Authenticator, Aegis) et le WebAuthn (clés hardware type YubiKey, passkeys). On peut définir des politiques qui forcent le MFA selon l'utilisateur, le groupe ou le service.

## Ce qui est compliqué

**Les flows.** Authentik fonctionne par flows : des séquences d'étapes (identification, mot de passe, MFA, consentement...) que l'utilisateur traverse. C'est très flexible mais ça demande de comprendre la logique avant de modifier quoi que ce soit. Casser un flow d'authentification peut verrouiller l'accès à tous les services d'un coup.

**LDAP.** Certains services anciens ne supportent que LDAP (pas OAuth2). Authentik expose un serveur LDAP, mais le mapping des attributs est subtil et le debug est pénible. Les logs ne sont pas toujours explicites sur la raison d'un échec de bind.
