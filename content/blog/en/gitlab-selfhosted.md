---
title: "Self-hosting GitLab in 2025"
description: "Why I installed my own GitLab instance, how it went, and whether it's actually worth it compared to GitHub."
date: "2025-03-23"
tags: ["GitLab", "Docker", "Linux"]
draft: false
---

## Why self-host Git?

GitHub is convenient, but it has limits: free CI/CD minutes run out fast, private repos for an organisation require a paid plan, and your data stays with Microsoft.

Self-hosted GitLab fixes all of that: unlimited CI/CD on your own runners, unrestricted private repos, and full control. For a homelab with infrastructure already running, it makes sense.

## Installation via Docker

GitLab is heavy. That's just the reality. The official image bundles Postgres, Redis, Nginx and a dozen other services. Plan for at least 4 GB of RAM just for GitLab.

```yaml
services:
  gitlab:
    image: gitlab/gitlab-ce:latest
    restart: unless-stopped
    hostname: gitlab.yourdomain.com
    environment:
      GITLAB_OMNIBUS_CONFIG: |
        external_url 'https://gitlab.yourdomain.com'
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

TLS is handled by Traefik upstream, so we disable GitLab's internal Let's Encrypt and tell it to listen on HTTP port 80. Traefik handles the rest.

The first start takes several minutes. GitLab initialises its database and generates its keys. That's normal.

## Initial configuration

**Authentik SSO**: GitLab supports OAuth2/OIDC natively. In `gitlab.rb`:

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
      issuer: "https://auth.yourdomain.com/application/o/gitlab",
      client_auth_method: "query",
      uid_field: "preferred_username",
      client_options: {
        identifier: ENV['AUTHENTIK_CLIENT_ID'],
        secret: ENV['AUTHENTIK_CLIENT_SECRET'],
        redirect_uri: "https://gitlab.yourdomain.com/users/auth/openid_connect/callback"
      }
    }
  }
]
```

**CI runners**: a separate runner registers with GitLab and executes pipelines. It can run on the same machine or elsewhere. I run it in a Docker container on Proxmox:

```bash
docker run -d --name gitlab-runner \
  -v /var/run/docker.sock:/var/run/docker.sock \
  gitlab/gitlab-runner:latest

docker exec -it gitlab-runner gitlab-runner register
```

## GitLab vs GitHub: my verdict

Self-hosted GitLab wins on CI/CD. Pipelines are more expressive, runners are unlimited, and everything is in the same interface without going through the GitHub Actions Marketplace.

GitHub wins on ecosystem. Third-party integrations, pull requests, the open-source community: everyone is on GitHub. For public projects or external collaboration, GitHub is more practical.

I use GitLab for internal projects and private repos, GitHub for what I want to make public.

## What gave me trouble

**RAM.** GitLab consumes a lot at idle. With default settings, Puma (the Ruby server) spawns multiple workers each taking several hundred MB. Reduce in `gitlab.rb` if the machine doesn't have 8 GB to spare:

```ruby
puma['worker_processes'] = 2
sidekiq['concurrency'] = 5
```

**Updates.** Don't skip major versions. GitLab has a specific migration path to follow. Going directly from 15.x to 17.x can break the database. Always check the upgrade path in the official docs before `docker pull`.
