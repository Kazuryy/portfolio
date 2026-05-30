---
title: "ProxFibre"
description: "Guardia's ISR club: hosting services for students, automated deployments, access management and network infrastructure with Stormshield."
date: "2024-09-01"
tags: ["Proxmox", "Stormshield", "Docker", "Terraform", "Authentik"]
status: "Actif"
featured: true
order: 2
---

## Context

ProxFibre is the Cloud/Homelab club at Guardia, but more broadly it's a shared infrastructure available to all students at the school. We run our own network, separate from the school's, and provide resources for projects, courses and lab environments: any student can deploy a project or work on an infrastructure without having to build their own.

## Network & security

The infrastructure is protected by a physical **Stormshield** at the network edge. The network is segmented into VLANs by usage (services, Wi-Fi, lab access) with explicit inter-zone filtering rules. Unlike pfSense or OPNsense, Stormshield provides native layer-7 application filtering: traffic can be allowed or blocked based on the application, not just the port. IPS is enabled on inbound traffic, with thresholds tuned to avoid blocking legitimate lab traffic (Nmap scans during pentest classes, for example).

## Project hosting

Dokploy handles deployment of students' sites and applications. Deployments are automated from Gitea or GitHub: a push to the repo triggers an automatic redeploy.

Pangolin exposes services through VPN tunnels, without a static IP or open ports. Each service is reachable via a secured subdomain.

## Server and lab access

**Termix** is deployed in two separate instances. One for club members: SSH access to Proxmox nodes, LXC containers and VMs directly from the browser, no locally configured SSH key needed. One for students: when a lab is provisioned, the student connects via Termix instead of noVNC. The terminal is responsive, copy-paste works, and access is restricted to the machines assigned to the group through ACLs.

## Lab provisioning

When a teacher prepares a course (networking, security, sysadmin), they define a lab configuration: for example 1 Windows Server, 1 Ubuntu, 1 pfSense. The system automatically retrieves the student list for the cohort along with their groups (defined by Guardia's academic structure), then provisions a full lab per group on Proxmox via Terraform and a CI/CD pipeline.

The advantage over local VMware: group members work on the same shared VMs, like in a real professional environment, rather than each running their own instance and manually syncing configs between teammates.

## Access management

Every Guardia student has an Authentik account, not just club members. Each service (Gitea, Nextcloud, labs, course tools) is connected to Authentik via SSO. One account, with no separate user database to manage per tool. Same principle as "Sign in with Google", at school scale.

## Monitoring

Grafana aggregates infrastructure metrics: Proxmox node status, resource usage, service availability.

## Work in progress

The infrastructure currently supports dev and network projects. We're working on expanding it to pentest projects: isolated environments, target machines, controlled access for members who need them.
