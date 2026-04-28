---
title: "Unifi : réseau maison pro sans se ruiner"
description: "Mon setup réseau avec les équipements Unifi : switches, access points, VLANs, et pourquoi j'ai choisi cet écosystème."
date: "2025-01-06"
tags: ["Unifi", "Réseau", "Infra"]
draft: false
---

## Pourquoi Unifi ?

La plupart des routeurs grand public gèrent les VLANs soit très mal, soit pas du tout. Pour un homelab avec des dizaines de services, de l'IoT, et des VMs qui ne doivent pas se parler entre elles, c'est bloquant.

Unifi propose du matériel réseau orienté pro, géré depuis une interface centralisée, à des prix raisonnables comparé aux équipements Cisco ou HP. Les switches, les access points et le routeur se configurent tous depuis la même console, et la gestion des VLANs est native et claire.

## Mon matériel

- **UniFi Switch Lite 8 PoE** : switch principal, alimente les APs en PoE
- **UniFi U6** : access point Wi-Fi 6, couvre la majorité de la surface
- **UniFi Cloud Gateway Ultra** : routeur/gateway, remplace la box pour le routage

Le tout est géré par le UniFi Network Server qui tourne sur une VM Proxmox.

Un truc fun : l'interface affiche le trafic réseau en temps réel par appareil et par port, avec un historique sur le mois. On voit directement qui consomme le plus de bande passante, quels appareils sont actifs, et les pics d'utilisation.

## Segmentation VLAN

Le réseau est découpé en plusieurs VLANs selon les usages :

- **Principal** : appareils de confiance (PC, téléphones)
- **Serveurs** : les VMs et conteneurs du homelab
- **IoT** : ampoules, prises connectées, appareils qui n'ont pas besoin d'accéder au reste
- **Invités** : accès internet uniquement, les appareils ne peuvent ni voir ni joindre quoi que ce soit d'autre sur le réseau

Les règles de firewall entre VLANs sont gérées directement dans l'interface Unifi. Par défaut, un VLAN ne peut pas en joindre un autre sans règle explicite.

## Le controller Unifi

Le UniFi Network Server (anciennement controller) est l'interface qui gère tout le matériel. Il peut tourner dans le cloud chez Ubiquiti, sur une UniFi Console physique, ou en self-hosted.

J'ai choisi le self-hosted sur Proxmox : une VM Debian légère avec le paquet officiel installé. Ça évite l'abonnement cloud et les données restent chez moi. L'interface est accessible depuis le réseau local ou via Tailscale depuis l'extérieur.

## Ce que j'aurais fait différemment

J'aurais pris un switch avec plus de ports PoE dès le début. Le Lite 8 PoE a 4 ports PoE sur 8, ce qui commence à être juste quand on ajoute des APs supplémentaires.

J'aurais aussi configuré les VLANs avant de brancher les appareils plutôt qu'après. Reconfigurer les VLANs sur un réseau déjà en place, c'est risquer de se couper l'accès au controller le temps de la migration.
