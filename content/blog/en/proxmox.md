---
title: "Proxmox VE: my main hypervisor"
description: "Experience report on Proxmox VE: installation, VM and LXC management, and what I learned by breaking things."
date: "2025-01-01"
tags: ["Proxmox", "Linux", "Infra"]
draft: false
---

## What is Proxmox VE?

Proxmox Virtual Environment is an open-source hypervisor based on Debian. It lets you run virtual machines (KVM) and containers (LXC) from a web interface, without needing a paid licence.

It has been the foundation of my homelab since 2023. Everything I deploy goes through it.

## Why Proxmox over VMware or Hyper-V?

Three simple reasons:

- **Free.** VMware vSphere is expensive, Hyper-V requires Windows Server. Proxmox is open-source with a full web interface at zero cost.
- **Debian under the hood.** I know Debian well, so when something breaks below the interface, I know where to look.
- **Native LXC.** Having LXC containers alongside KVM VMs in the same interface is a huge convenience for lightweight services that don't need an isolated kernel.

VMware is more mature for enterprise environments with dozens of nodes, but for a solo homelab, Proxmox wins hands down.

## My setup

Multiple machines make up the cluster:

- **Minisforum UM790 Pro**: main node, AMD Ryzen 9 7940HS
- **Desktop PC**: AMD Ryzen 7 3700X, RX 6600 XT
- **Dell Optiplex 7010**: Intel Core i3-3240, light workloads
- **Synology DS923+**: NAS, 16 TB storage

## VMs vs LXC containers

The question everyone asks at the start. My rule:

**LXC** when the service is simple, stateless, or when I want a minimal footprint. Examples: Nginx, Pi-hole, small Python scripts. An LXC container starts in 2 seconds and uses barely any RAM.

**KVM VM** when I need an isolated kernel, a specific distribution, or when the service is complex. Examples: GitLab (which has its own system dependencies), pfSense, test environments.

In practice, most of my services run in LXC containers — lighter and easy to manage with Ansible.

## What I learned (and broke)

**Proxmox backups (vzdump) are your best friend.** I have an automatic job every night that backs up important VMs to the HDD.

**The noVNC console is useful but slow.** Fine for quick debugging, but painful to work in daily. SSH is the standard as soon as the network is configured.
