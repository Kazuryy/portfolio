---
title: "Self-héberger GitLab en 2025"
description: "Pourquoi j'ai installé ma propre instance GitLab, comment ça se passe, et si ça vaut vraiment le coup face à GitHub."
date: "2025-03-23"
tags: ["GitLab", "Docker", "Linux"]
draft: false
---

## Pourquoi self-héberger son Git ?

GitHub est pratique, mais il a des limites : les minutes CI/CD gratuites s'épuisent vite, les repos privés pour une organisation demandent un plan payant, et les données restent chez Microsoft.

GitLab self-hosted règle tout ça : CI/CD illimité sur ses propres runners, repos privés sans restriction, et contrôle total. Pour un homelab avec déjà de l'infra qui tourne, c'est logique.

## Installation via Docker

GitLab est lourd. C'est la réalité. L'image officielle embarque Postgres, Redis, Nginx et une dizaine d'autres services. Prévoir au moins 4 Go de RAM rien que pour GitLab.

```yaml
services:
  gitlab:
    image: gitlab/gitlab-ce:latest
    restart: unless-stopped
    hostname: gitlab.mondomaine.fr
    environment:
      GITLAB_OMNIBUS_CONFIG: |
        external_url 'https://gitlab.mondomaine.fr'
        gitlab_rails['gitlab_shell_ssh_port'] = 2222
        nginx['listen_port'] = 80
        nginx['listen_https'] = false
        letsencrypt['enable'] = false
    ports:
      - "2222:22"
    volumes:
      - ./config:/etc/gitlab
      - ./logs:/var/log/gitlab
      - ./data:/var/opt/gitlab
```

Le TLS est géré par Traefik en amont, donc on désactive le Let's Encrypt interne de GitLab et on lui dit d'écouter en HTTP sur le port 80. Traefik s'occupe du reste.

Le premier démarrage prend plusieurs minutes. GitLab initialise sa base de données et génère ses clés. C'est normal.

## Configuration initiale

**Authentik SSO** : GitLab supporte OAuth2/OIDC nativement. Dans `gitlab.rb` :

```ruby
gitlab_rails['omniauth_enabled'] = true
gitlab_rails['omniauth_providers'] = [
  {
    name: "openid_connect",
    label: "Authentik",
    args: {
      name: "openid_connect",
      scope: ["openid", "profile", "email"],
      response_type: "code",
      issuer: "https://auth.mondomaine.fr/application/o/gitlab",
      client_auth_method: "query",
      uid_field: "preferred_username",
      client_options: {
        identifier: ENV['AUTHENTIK_CLIENT_ID'],
        secret: ENV['AUTHENTIK_CLIENT_SECRET'],
        redirect_uri: "https://gitlab.mondomaine.fr/users/auth/openid_connect/callback"
      }
    }
  }
]
```

**Runners CI** : un runner séparé s'enregistre auprès de GitLab et exécute les pipelines. Il peut tourner sur la même machine ou ailleurs. Je le fais tourner dans un conteneur Docker sur Proxmox :

```bash
docker run -d --name gitlab-runner \
  -v /var/run/docker.sock:/var/run/docker.sock \
  gitlab/gitlab-runner:latest

docker exec -it gitlab-runner gitlab-runner register
```

## GitLab vs GitHub : mon verdict

GitLab self-hosted gagne sur la CI/CD. Les pipelines sont plus expressifs, les runners sont illimités, et tout est dans la même interface sans passer par des GitHub Actions Marketplace.

GitHub gagne sur l'écosystème. Les intégrations tierces, les pull requests, la communauté open-source : tout le monde est sur GitHub. Pour des projets publics ou en collaboration externe, GitHub reste plus pratique.

J'utilise GitLab pour les projets internes et les repos privés, GitHub pour ce que je veux rendre public.

## Ce qui m'a posé problème

**La RAM.** GitLab consomme énormément au repos. Avec les réglages par défaut, Puma (le serveur Ruby) lance plusieurs workers qui prennent chacun plusieurs centaines de Mo. À réduire dans `gitlab.rb` si la machine n'a pas 8 Go à disposition :

```ruby
puma['worker_processes'] = 2
sidekiq['concurrency'] = 5
```

**Les mises à jour.** Il ne faut pas sauter de versions majeures. GitLab a un chemin de migration précis à suivre. Passer directement de 15.x à 17.x peut casser la base de données. Toujours vérifier le upgrade path sur la doc officielle avant de `docker pull`.
