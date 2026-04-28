---
title: "ProxFibre"
description: "Club ISR de Guardia : hébergement de services pour les élèves, déploiement automatisé, gestion des accès et infra réseau avec Stormshield."
date: "2024-09-01"
tags: ["Proxmox", "Stormshield", "Docker", "Terraform", "Authentik"]
status: "En cours"
featured: true
order: 2
---

## Contexte

ProxFibre est le club Cloud/Homelab de Guardia. On dispose de notre propre réseau, séparé de celui de l'école, et on héberge des services à destination des élèves : déploiement de projets, environnements de lab, outils de collaboration.

## Hébergement de projets

Dokploy gère le déploiement des sites et applications des élèves. Les déploiements sont automatisés depuis Gitea ou GitHub : un push sur le repo déclenche un redéploiement automatique.

Pangolin expose les services via des tunnels VPN, sans IP fixe ni ouverture de ports. Chaque service est accessible via un sous-domaine sécurisé.

## Provisioning de VMs

GitLab combiné à Terraform permet de créer des VMs à la demande pour les élèves qui en ont besoin. Un pipeline CI/CD provisionne automatiquement la machine sur Proxmox à partir d'un fichier de configuration.

## Gestion des accès

Authentik centralise les comptes de tous les membres du club. Un seul compte donne accès à Gitea, Nextcloud, et les autres services de l'infrastructure.

## Monitoring

Grafana agrège les métriques de l'infrastructure : état des nœuds Proxmox, consommation des ressources, disponibilité des services.

## Ce qui est en cours

L'infrastructure supporte aujourd'hui les projets de dev et de réseau. On travaille à étendre ça aux projets de pentest : environnements isolés, machines cibles, accès contrôlé pour les membres qui en ont besoin.
