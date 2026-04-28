---
title: "Authentik: one account for all services"
description: "How I set up Authentik as centralised SSO on ProxFibre: managing access for dozens of students on Gitea, Nextcloud and more without drowning in accounts."
date: "2025-01-07"
tags: ["Authentik", "Security", "Infra"]
draft: false
---

## The problem at scale

On my personal homelab, managing accounts manually is fine. On ProxFibre it's a different story: dozens of students who need access to Gitea, Nextcloud, and other services. Creating an account per service per person by hand is hours of work, and a nightmare when you need to revoke access or someone forgets their password.

Authentik solves this: one account per user, one place to manage everything. Add someone in Authentik and they instantly have access to all services. Remove them and they lose access to everything.

## Authentik in a nutshell

Authentik is an open-source Identity Provider (IdP). It supports standard protocols: OAuth2/OIDC, SAML, LDAP, SCIM. Virtually all self-hosted services know how to connect to it.

It stands out from Keycloak (the other major player) with a more modern interface and less verbose configuration. Keycloak is more complete for enterprise environments, Authentik is more approachable for a use case like ours.

## Installation

Authentik deploys via Docker Compose. The official stack includes the server, an async worker, PostgreSQL and Redis:

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

After the first boot, the admin interface is available at `/if/flow/initial-setup/` to create the admin account.

## Integrations

Most services connect via OAuth2/OIDC — the simplest to configure. In Authentik you create an application and a provider, grab the client ID and secret, and paste them into the target service.

Services integrated on ProxFibre and my homelab:

- **Gitea**: OAuth2, all students log in with their Authentik account
- **Nextcloud**: OIDC
- **Grafana**: OAuth2
- **Immich**: OAuth2

For services that don't support OAuth2, Authentik offers a forward auth proxy that intercepts requests and forces login before granting access.

## MFA and security

Authentik supports TOTP (Google Authenticator, Aegis) and WebAuthn (hardware keys like YubiKey, passkeys). You can define policies that enforce MFA per user, group, or service.

## What's tricky

**Flows.** Authentik works through flows: sequences of steps (identification, password, MFA, consent...) that the user goes through. Very flexible, but you need to understand the logic before changing anything. Breaking an authentication flow can lock everyone out of all services at once.

**LDAP.** Some legacy services only support LDAP. Authentik exposes an LDAP server, but attribute mapping is subtle and debugging is painful. The logs aren't always clear about why a bind fails.
