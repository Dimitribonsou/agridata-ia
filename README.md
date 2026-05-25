
```markdown
# AgriData-AI : Plateforme d'Analyse Laitière Décisionnelle

AgriData-AI est une plateforme web d'entreprise conçue pour automatiser la surveillance sanitaire et l'analyse des données de production laitière. Le système centralise les métriques physico-chimiques complexes provenant des laboratoires d'analyse, exploite l'intelligence artificielle via Google Gemini pour générer des diagnostics agronomiques prédictifs, et orchestre le routage automatisé des rapports d'alerte par courrier électronique.

## Objectifs Métier

La plateforme adresse trois besoins critiques dans l'industrie agroalimentaire laitière :

1. **Centralisation des données d'analyse** : Intégration des résultats de laboratoire (taux somatiques, matière grasse, protéine, cryoscopie) pour faciliter le suivi des exploitations laitières.

2. **Génération de diagnostics intelligents** : Traduction des anomalies complexes en recommandations actionables pour les éleveurs concernant l'alimentation, l'hygiène de traite et les soins du cheptel.

3. **Automatisation du processus d'expédition** : Réduction du délai de traitement des rapports par l'automatisation du flux de validation et d'envoi par courriel.

## Architecture Technique

### Frontend (Angular 21)

- **Angular 21.0.0** : Framework web moderne utilisant les Signals pour la réactivité sans liaison bidirectionnelle complexe.
- **TypeScript 5.9.2** : Typage statique strict, mode strict actif sur tous les fichiers. Zéro usage de type any.
- **PrimeNG 21.1.8** : Composants d'interface utilisateur préconstruits (tableaux, cartes, boutons, balises).
- **Tailwind CSS 4.3.0** : Utilitaires CSS pour la mise en page responsive et le positionnement.
- **RxJS 7.8.0** : Bibliothèque réactive pour l'asynchronisme (utilisée par Angular).

### Backend (Express 5)

- **Express 5.1.0** : Framework serveur web léger pour les API RESTful.
- **TypeScript 6.0.3** : Typage statique strict identique au frontend.
- **Prisma 7.8.0** : ORM TypeScript pour l'accès à la base de données PostgreSQL avec inférence de types automatique.
- **Zod 4.4.3** : Bibliothèque de validation de schémas avec génération de types TypeScript.
- **Google Genai 2.4.0** : SDK officiel de Google pour l'API Gemini.
- **Nodemailer 8.0.7** : Client SMTP pour l'envoi de courriers électroniques.
- **Vitest 4.1.6** : Framework de test unitaire avec support natif de TypeScript.

### Persistance des Données

- **PostgreSQL** : Base de données relationnelle pour la persistance des analyses laitières.
- **Prisma Migrations** : Versionnage des schémas de base de données avec rollback possible.

## Organisation du Projet

```
agridata-ai/
├── docs/
│   ├── api-spec.md                # Spécification des contrats d'API HTTP
│   └── database-schema.md          # Schéma relationnel et modèles de données
├── frontend/                       # Application web Angular 21
│   ├── src/app/
│   │   ├── core/                  # Services d'infrastructure (Store, Modèles)
│   │   ├── shared/                # Directives et pipes réutilisables
│   │   └── features/              # Modules métier (Dashboard, Analysis, Shipping)
│   └── package.json
└── backend/                        # Serveur Express v5
    ├── prisma/                    # Schémas et migrations PostgreSQL
    ├── src/
    │   ├── core/                  # Middlewares, schémas Zod, modèles
    │   └── features/              # Routes métier (Analysis, Shipping)
    └── package.json
```

## Principes de Conception

### Typage Statique Strict

L'intégralité du codebase (frontend et backend) applique TypeScript en mode strict. Aucun usage de type any n'est autorisé. Ce choix architectural élimine les classes d'erreurs courantes en production : accès à des propriétés non définies, types incohérents entre le serveur et le client, mutations non intentionnelles de l'état.

Prisma génère automatiquement les types TypeScript à partir du schéma de base de données. Zod valide les requêtes HTTP entrantes et génère les types par inférence. Angular Signals et le système de types TypeScript garantissent la cohérence du flux de données depuis la base de données jusqu'à l'affichage dans le DOM.

### Réactivité sans Liaison Bidirectionnelle

Angular 21 utilise les Signals (fonctions réactives) et les flux de contrôle modernes (@if, @for) au lieu de la liaison bidirectionnelle [(ngModel)]. Cette approche améliore les performances du rendu et simplifie le raisonnement sur le flux de données.

### Isolation des Modules Métier

Le frontend organise les composants en slices verticales par domaine fonctionnel (Dashboard, Analysis, Shipping). Chaque slice est autonome, facilitant le développement, les tests et la maintenabilité.

## Documentation Technique Approfondie

Consultez les documents détaillés pour les spécifications complètes :

- [api-spec.md](./docs/api-spec.md) : Contrats HTTP, payloads de requête/réponse, codes d'erreur.
- [database-schema.md](./docs/database-schema.md) : Schéma relationnel PostgreSQL, modèles Prisma, contraintes d'intégrité.

## Prototype et Design

Avant d'exécuter l'application, consultez le prototype interactif Figma pour comprendre le design et les flux utilisateur prévus :

**[Prototype Figma AgriData-AI](https://www.figma.com/make/UvWS6oyXfrkDj3C2ASyn2V/AgriData-IA?t=DVcJSxYDprMXc6yi-20&fullscreen=1)**

Ce prototype visualise :
- Layout et navigation entre les trois pages (Dashboard, Analysis, Shipping)
- Composants d'interface (tableaux, cartes KPI, formulaires)
- Responsive design sur desktop et tablette
- Palette de couleurs et typographie

## Installation et Démarrage

### Frontend

```bash
cd frontend
npm install
npm start          # Démarre le serveur de développement sur http://localhost:4200
```

### Backend

```bash
cd backend
npm install
npm run dev        # Démarre le serveur Express sur http://localhost:3000
```

## Spécifications Détaillées

Pour les détails des modèles de données, des schémas de validation et des contrats d'API, consultez le dossier docs.

```

```