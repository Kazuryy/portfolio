---
title: "Stormshield: professional firewall in an educational setting"
description: "Experience with Stormshield at ProxFibre, Guardia's Cloud/Homelab club: configuration, application filtering, network segmentation."
date: "2025-01-04"
tags: ["Stormshield", "Network", "Cybersecurity"]
draft: false
---

## Context: ProxFibre

ProxFibre is the Cloud/Homelab club at Guardia. We have our own network, separate from the school's, and host services for students: collaboration tools, lab environments, internal resources. The infrastructure runs on a Proxmox cluster we manage collectively, protected by a physical Stormshield at the network edge.

## What is Stormshield?

Stormshield is a French network security solution, ANSSI-qualified. Their firewalls are used in government agencies, local authorities, and companies with sovereignty or compliance requirements.

Unlike pfSense or OPNsense which are open-source software you install on generic hardware, Stormshield is an appliance — hardware and software integrated. The management interface (SN Center) is proprietary.

## What we configured

**VLAN segmentation**

The network is split into subnets by usage type: services, Wi-Fi, lab access, etc. Each zone has its own filtering rules and inter-zone traffic is explicitly controlled.

**Application filtering rules**

Stormshield filters by application, not just by port. You can block BitTorrent even if it runs on port 443, or only allow certain video conferencing tools. We configured inspection profiles for HTTP/HTTPS and SSH traffic.

**IPS policy**

The IPS (Intrusion Prevention System) is active on incoming traffic. We adjusted the thresholds to avoid false positives on legitimate lab traffic (Nmap scans during pentest classes, for example).

## Differences from pfSense / OPNsense

pfSense and OPNsense are excellent for a homelab. They do 90% of what Stormshield does, for free, on standard hardware.

What Stormshield adds:

- **Native application filtering** without plugins — pfSense relies on Snort/Suricata for that, with more configuration
- **Unified interface** — everything managed from SN Center, no juggling multiple add-ons
- **ANSSI qualification** — required in certain regulatory contexts
- **Support** — critical in a professional environment, non-existent in open-source community tools

The trade-off: configuration is more rigid, the community is much smaller, and the documentation is less accessible than pfSense's.

## What I learned

Working on professional hardware in a real context changes the approach. On a homelab, breaking something only affects yourself. Here, a bad rule can cut network access for an entire room during a class.

It taught me to test changes on low-impact rules first, document every modification, and understand the concept of a "default security policy" — what's implicitly blocked versus what's explicitly allowed.

Layer 7 filtering also made me realise how little a plain port 443 tells you about what's actually transiting.
