---
title: "Proxmox VE : mon hyperviseur principal"
description: "Retour d'expérience sur Proxmox VE : installation, gestion des VMs et LXC, et ce que j'ai appris en cassant des trucs."
date: "2025-01-01"
tags: ["Proxmox", "Linux", "Infra"]
draft: false
---

## Qu'est-ce que Proxmox VE ?

Proxmox Virtual Environment est un hyperviseur open-source basé sur Debian. Il permet de faire tourner des machines virtuelles (KVM) et des conteneurs (LXC) depuis une interface web, sans avoir besoin d'une licence payante.

C'est la base de mon homelab depuis 2023. Tout ce que je déploie passe par là.

## Pourquoi Proxmox plutôt que VMware ou Hyper-V ?

Trois raisons simples :

- **Gratuit**. VMware vSphere coûte cher, Hyper-V demande Windows Server. Proxmox est open-source avec une interface web complète sans débourser un centime.
- **Debian sous le capot**. Je connais bien Debian, donc quand quelque chose cloche en dessous de l'interface, je sais où chercher.
- **LXC natif**. Avoir des conteneurs LXC aux côtés des VMs KVM dans la même interface, c'est un confort énorme pour des services légers qui n'ont pas besoin d'un kernel isolé.

VMware reste plus mature pour les environnements pro avec des dizaines de nœuds, mais pour un homelab solo, Proxmox gagne sans discussion.

## Mon setup

Un seul nœud physique pour l'instant, un mini-PC x86 avec :

- **CPU** : Intel Core i5 (6 cœurs)
- **RAM** : 32 Go DDR4
- **Stockage** : SSD NVMe 1 To (VMs) + HDD 4 To (données)

Proxmox est installé directement sur le NVMe. Les VMs lourdes (GitLab, Nextcloud) tournent sur ce même disque. Les données volumineuses (Immich, backups) sont sur le HDD.

## VMs vs conteneurs LXC

C'est la question que tout le monde se pose au début. Ma règle :

**LXC** quand le service est simple, stateless ou quand je veux une empreinte minimale. Exemples : Nginx, Pi-hole, petits scripts Python. Un conteneur LXC démarre en 2 secondes et consomme à peine de RAM.

**VM KVM** quand j'ai besoin d'un kernel isolé, d'une distribution spécifique, ou quand le service est complexe. Exemples : GitLab (qui a ses propres dépendances système), pfSense, les environnements de test.

En pratique, la majorité de mes services tournent dans des LXC, c'est plus léger et ça se manage facilement avec Ansible.

## Ce que j'ai appris (et cassé)

**Les backups Proxmox (vzdump) sont tes amis.** J'ai un job automatique toutes les nuits qui sauvegarde les VMs importantes vers le HDD.

**La console noVNC est utile mais lente.** Pour le debug rapide ça va, mais travailler dedans au quotidien c'est douloureux. SSH reste la norme dès que le réseau est configuré.
