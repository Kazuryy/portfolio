---
title: "ProxFibre"
description: "Club ISR de Guardia : hébergement de services pour les élèves, déploiement automatisé, gestion des accès et infra réseau avec Stormshield."
date: "2024-09-01"
tags: ["Proxmox", "Stormshield", "Docker", "Terraform", "Authentik"]
status: "Actif"
featured: true
order: 2
---

## Contexte

ProxFibre est le club Cloud/Homelab de Guardia, mais c'est surtout une infrastructure mutualisée au service de tous les étudiants de l'école. On dispose de notre propre réseau, séparé de celui de l'école, et on met à disposition des ressources pour les projets, les cours et les environnements de lab : n'importe quel étudiant peut déployer un projet ou travailler sur une infrastructure sans avoir à monter la sienne.

## Réseau & sécurité

L'infrastructure est protégée par un **Stormshield** physique en bordure de réseau. Le réseau est segmenté en VLANs par usage (services, Wi-Fi, accès lab) avec des règles de filtrage inter-zones explicites. Contrairement à pfSense ou OPNsense, Stormshield permet un filtrage applicatif natif (layer 7) : on peut bloquer ou autoriser du trafic sur la base de l'application, pas juste du port. L'IPS est activé sur les flux entrants, avec des seuils ajustés pour ne pas bloquer le trafic légitime de lab (scans Nmap pendant les cours de pentest, par exemple).

## Hébergement de projets

Dokploy gère le déploiement des sites et applications des élèves. Les déploiements sont automatisés depuis Gitea ou GitHub : un push sur le repo déclenche un redéploiement automatique.

Pangolin expose les services via des tunnels VPN, sans IP fixe ni ouverture de ports. Chaque service est accessible via un sous-domaine sécurisé.

## Accès aux serveurs et aux labs

**Termix** est déployé en deux instances distinctes. Une pour les membres du club : accès SSH aux nœuds Proxmox, aux LXC et aux VMs directement depuis le navigateur, sans clé SSH à configurer localement. Une pour les élèves : quand un lab est provisionné, l'étudiant s'y connecte via Termix plutôt que noVNC. Le terminal est réactif, le copier-coller fonctionne, et les accès sont restreints aux machines attribuées au groupe via les ACL.

## Provisioning de labs

Quand un professeur prépare un cours (réseau, sécurité, sysadmin), il définit une configuration de lab : par exemple 1 Windows Server, 1 Ubuntu, 1 pfSense. Le système récupère automatiquement la liste des élèves de la promo et leurs groupes (définis par la pédagogie de Guardia), puis provisionne un lab complet par groupe sur Proxmox via Terraform et un pipeline CI/CD.

L'avantage par rapport à VMware en local : les membres d'un groupe travaillent sur les mêmes VMs partagées, comme dans un contexte professionnel réel, plutôt que chacun sur son instance perso avec des configs synchronisées à la main.

## Gestion des accès

Tous les étudiants de Guardia ont un compte Authentik, pas seulement les membres du club. L'intérêt : chaque service (Gitea, Nextcloud, les labs, les outils de cours) est connecté à Authentik en SSO. Un seul compte, sans avoir à gérer une base d'utilisateurs séparée pour chaque outil. C'est le même principe qu'un "Connexion avec Google" à l'échelle de l'école.

## Monitoring

Grafana agrège les métriques de l'infrastructure : état des nœuds Proxmox, consommation des ressources, disponibilité des services.

## Ce qui est en cours

L'infrastructure supporte aujourd'hui les projets de dev et de réseau. On travaille à étendre ça aux projets de pentest : environnements isolés, machines cibles, accès contrôlé pour les membres qui en ont besoin.
