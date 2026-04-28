---
title: "Unifi: pro-grade home network without breaking the bank"
description: "My network setup with Unifi gear: switches, access points, VLANs, and why I chose this ecosystem."
date: "2025-01-06"
tags: ["Unifi", "Network", "Infra"]
draft: false
---

## Why Unifi?

Most consumer routers handle VLANs poorly or not at all. For a homelab with dozens of services, IoT devices, and VMs that shouldn't talk to each other, that's a blocker.

Unifi offers pro-oriented networking gear managed from a centralised interface, at reasonable prices compared to Cisco or HP equipment. Switches, access points and the router are all configured from the same console, and VLAN management is native and clear.

## My gear

- **UniFi Switch Lite 8 PoE**: main switch with PoE ports
- **UniFi U6**: Wi-Fi 6 access point
- **UniFi Cloud Gateway Ultra**: router/gateway

Everything is managed by the UniFi Network Server running on a Proxmox VM.

A fun feature: the interface shows real-time network traffic per device and per port, with a monthly history. You can see directly who's using the most bandwidth, which devices are active, and usage spikes.

## VLAN segmentation

The network is split into several VLANs by use case:

- **Main**: trusted devices (PCs, phones)
- **Servers**: homelab VMs and containers
- **IoT**: smart bulbs, connected plugs, devices that don't need to reach anything else
- **Guests**: internet access only, devices can't see or reach anything else on the network

Firewall rules between VLANs are managed directly in the Unifi interface. By default, a VLAN can't reach another without an explicit rule.

## The Unifi controller

The UniFi Network Server manages all the hardware. It can run in Ubiquiti's cloud, on a physical UniFi Console, or self-hosted.

I went self-hosted on Proxmox: a lightweight Debian VM with the official package installed. No cloud subscription, data stays local. The interface is accessible from the local network or via Tailscale from outside.

## What I'd do differently

I'd get a switch with more PoE ports from the start. The Lite 8 PoE has 4 PoE ports out of 8, which starts getting tight when adding extra APs.

I'd also configure the VLANs before plugging in devices rather than after. Reconfiguring VLANs on an existing network risks cutting your own access to the controller during the migration.
