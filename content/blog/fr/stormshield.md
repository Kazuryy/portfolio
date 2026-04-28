---
title: "Stormshield : firewall professionnel en environnement éducatif"
description: "Retour d'expérience sur Stormshield dans le cadre du club ISR à Guardia : configuration, filtrage applicatif, segmentation réseau."
date: "2025-01-04"
tags: ["Stormshield", "Réseau", "Cybersécurité"]
draft: false
---

## Contexte : le club ISR et ProxFibre

ProxFibre est le club Cloud/Homelab de Guardia. On dispose de notre propre réseau, séparé de celui de l'école, et on héberge des services pour les élèves : outils de collaboration, environnements de lab, ressources internes. L'infrastructure tourne sur un cluster Proxmox qu'on administre collectivement, protégé par un Stormshield physique en bordure de réseau.

## Qu'est-ce que Stormshield ?

Stormshield est une solution de sécurité réseau française, qualifiée par l'ANSSI. Leurs firewalls sont utilisés dans les administrations, les collectivités, et les entreprises qui ont des contraintes de souveraineté ou de conformité.

Contrairement à pfSense ou OPNsense qui sont des logiciels open-source qu'on installe sur du matériel générique, Stormshield est un appliance, matériel et logiciel intégrés. L'interface de gestion (SN Center) est propriétaire.
## Ce qu'on a configuré

**Segmentation VLAN**

Le réseau est découpé en sous-réseaux par type d'usage : services, Wi-Fi, accès lab, etc. Chaque zone a ses propres règles de filtrage et les flux inter-zones sont contrôlés explicitement.

**Règles de filtrage applicatif**

Stormshield permet de filtrer par application et non juste par port. On peut bloquer BitTorrent même s'il tourne sur le port 443, ou autoriser uniquement certains outils de visioconférence. On a configuré des profils d'inspection pour les flux HTTP/HTTPS et SSH.

**Politique IPS**

L'IPS (Intrusion Prevention System) est activé sur les flux entrants. On a ajusté les seuils pour éviter les faux positifs sur du trafic légitime de lab (scans Nmap dans les cours de pentest, par exemple).

## Différences avec pfSense / OPNsense

pfSense et OPNsense sont excellents pour un homelab. Ils font 90% de ce que fait Stormshield, gratuitement, sur du matériel standard.

Ce que Stormshield apporte en plus :

- **Filtrage applicatif natif** sans plugin : pfSense dépend de Snort/Suricata pour ça, avec plus de configuration
- **Interface unifiée** : tout se gère depuis SN Center, sans jongler entre plusieurs add-ons
- **Qualification ANSSI** : requis dans certains contextes réglementaires
- **Support** : critique en environnement pro, inexistant sur du open-source communautaire

Ce que Stormshield coûte en échange : la configuration est plus rigide, la communauté est bien plus petite, et la documentation est moins accessible que celle de pfSense.

## Ce que j'ai appris

Travailler sur du matériel pro dans un contexte réel change l'approche. Sur un homelab, casser quelque chose ne touche que soi. Là, une mauvaise règle peut couper l'accès réseau à une salle entière pendant un cours.

Ça m'a appris à tester les changements sur des règles à faible impact d'abord, à documenter chaque modification, et à comprendre la notion de "politique de sécurité par défaut", ce qui est bloqué implicitement vs ce qui est autorisé explicitement.

Le filtrage layer 7 m'a aussi fait réaliser à quel point un simple port 443 ne dit rien sur ce qui transite réellement.
