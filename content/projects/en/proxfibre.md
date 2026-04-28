---
title: "ProxFibre"
description: "Guardia's ISR club: hosting services for students, automated deployments, access management and network infrastructure with Stormshield."
date: "2024-09-01"
tags: ["Proxmox", "Stormshield", "Docker", "Terraform", "Authentik"]
status: "En cours"
featured: true
order: 2
---

## Context

ProxFibre is the Cloud/Homelab club at Guardia. We run our own network, separate from the school's, and host services for students: project deployments, lab environments, collaboration tools.

## Project hosting

Dokploy handles deployment of students' sites and applications. Deployments are automated from Gitea or GitHub: a push to the repo triggers an automatic redeploy.

Pangolin exposes services through VPN tunnels, without a static IP or open ports. Each service is reachable via a secured subdomain.

## VM provisioning

GitLab combined with Terraform allows on-demand VM creation for students who need one. A CI/CD pipeline automatically provisions the machine on Proxmox from a configuration file.

## Access management

Authentik centralises accounts for all club members. One account gives access to Gitea, Nextcloud, and the rest of the infrastructure's services.

## Monitoring

Grafana aggregates infrastructure metrics: Proxmox node status, resource usage, service availability.

## Work in progress

The infrastructure currently supports dev and network projects. We're working on expanding it to pentest projects: isolated environments, target machines, controlled access for members who need them.
