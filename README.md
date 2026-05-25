
```markdown
# AgriData-AI : Plateforme d'Analyse Laitière Décisionnelle

AgriData-AI est un projet de plateforme web d'entreprise conçu pour automatiser la surveillance sanitaire et l'analyse des données de production laitière. Le système centralise les métriques physico-chimiques provenant des laboratoires d'analyse, exploite l'intelligence artificielle via Google Gemini pour générer des diagnostics agronomiques, et orchestre le routage automatisé des rapports d'alerte par courrier électronique.

Ce projet a été inspiré par les missions décrites dans l'offre de formation apprenti développeur fullstack du Laboratoire Départemental d'Analyses - Jura (LDA39).

Etat du projet : En cours de développement. Les données actuelles sont simulées via un objet JSON dans le service InfoLaboStore. L'architecture est conçue pour être facilement connectée à n'importe quelle API backend sans modifications majeures du code métier.

## Prototype et Conception

Consultez le prototype interactif Figma pour visualiser le design et les flux utilisateur prévus de l'application :

https://www.figma.com/make/UvWS6oyXfrkDj3C2ASyn2V/AgriData-IA?t=DVcJSxYDprMXc6yi-20&fullscreen=1

Le prototype couvre les éléments suivants :
- Disposition générale et navigation entre les trois pages (Dashboard, Analysis, Shipping)
- Composants d'interface (tableaux, cartes KPI, formulaires)
- Comportement responsive sur desktop et tablette
- Palette de couleurs et typographie de la marque

## Objectifs Métier

La plateforme adresse trois besoins critiques dans l'industrie agroalimentaire laitière :

1. Centralisation des données d'analyse : Intégration des résultats de laboratoire (taux somatiques, matière grasse, protéine, cryoscopie) pour faciliter le suivi des exploitations laitières.

2. Génération de diagnostics intelligents : Traduction des anomalies complexes en recommandations actionables pour les éleveurs concernant l'alimentation, l'hygiène de traite et les soins du cheptel.

3. Automatisation du processus d'expédition : Réduction du délai de traitement des rapports par l'automatisation du flux de validation et d'envoi par courriel.

## Architecture Technique

### Frontend (Angular 21)

- Angular 21.0.0 : Framework web moderne utilisant les Signals pour la réactivité sans liaison bidirectionnelle complexe.
- TypeScript 5.9.2 : Typage statique strict, mode strict actif sur tous les fichiers. Aucun usage de type any.
- PrimeNG 21.1.8 : Composants d'interface utilisateur préconstruits (tableaux, cartes, boutons, balises).
- Tailwind CSS 4.3.0 : Utilitaires CSS pour la mise en page responsive et le positionnement.
- RxJS 7.8.0 : Bibliothèque réactive pour l'asynchronisme (utilisée par Angular).

### Backend (Express 5)

- Express 5.1.0 : Framework serveur web léger pour les API RESTful.
- TypeScript 6.0.3 : Typage statique strict identique au frontend.
- Prisma 7.8.0 : ORM TypeScript pour l'accès à la base de données PostgreSQL avec inférence de types automatique.
- Zod 4.4.3 : Bibliothèque de validation de schémas avec génération de types TypeScript.
- Google Genai 2.4.0 : SDK officiel de Google pour l'API Gemini.
- Nodemailer 8.0.7 : Client SMTP pour l'envoi de courriers électroniques.
- Vitest 4.1.6 : Framework de test unitaire avec support natif de TypeScript.

### Persistance des Données

- PostgreSQL : Base de données relationnelle pour la persistance des analyses laitières.
- Prisma Migrations : Versionnage des schémas de base de données avec rollback possible.

## Données Simulées

Actuellement, les données proviennent d'un objet JSON contenu dans le service InfoLaboStore (frontend/src/app/core/services/infolabo.service.ts). Cette approche permet de développer et de tester l'interface utilisateur sans dépendre d'une API backend complètement fonctionnelle.

Pour connecter le projet à une API backend réelle, il suffit de modifier le service InfoLaboStore pour effectuer des appels HTTP (via HttpClient) vers les endpoints décrits dans la documentation API. Aucune modification majeure du code métier ou des composants n'est nécessaire grâce à l'architecture réactive basée sur les Signals d'Angular.

## Organisation du Projet

agridata-ai/
├── docs/
│   ├── api-spec.md                # Specification des contrats d'API HTTP
│   └── database-schema.md          # Schema relationnel et modeles de donnees
├── frontend/                       # Application web Angular 21
│   ├── src/app/
│   │   ├── core/                  # Services d'infrastructure (Store, Modeles)
│   │   ├── shared/                # Directives et pipes reutilisables
│   │   └── features/              # Modules metier (Dashboard, Analysis, Shipping)
│   └── package.json
└── backend/                        # Serveur Express v5
    ├── prisma/                    # Schemas et migrations PostgreSQL
    ├── src/
    │   ├── core/                  # Middlewares, schemas Zod, modeles
    │   └── features/              # Routes metier (Analysis, Shipping)
    └── package.json

## Principes de Conception

Typage Statique Strict

L'integralite du codebase (frontend et backend) applique TypeScript en mode strict. Aucun usage de type any n'est autorise. Ce choix architectural elimine les classes d'erreurs courantes en production : acces a des proprietes non definies, types incoherents entre le serveur et le client, mutations non intentionnelles de l'etat.

Prisma genere automatiquement les types TypeScript a partir du schema de base de donnees. Zod valide les requetes HTTP entrantes et genere les types par inference. Angular Signals et le systeme de types TypeScript garantissent la coherence du flux de donnees depuis la base de donnees jusqu'a l'affichage dans le DOM.

Reactivite sans Liaison Bidirectionnelle

Angular 21 utilise les Signals (fonctions reactives) et les flux de controle modernes (@if, @for) au lieu de la liaison bidirectionnelle [(ngModel)]. Cette approche ameliore les performances du rendu et simplifie le raisonnement sur le flux de donnees.

Isolation des Modules Metier

Le frontend organise les composants en slices verticales par domaine fonctionnel (Dashboard, Analysis, Shipping). Chaque slice est autonome, facilitant le developpement, les tests et la maintenabilite.

## Documentation Technique Approfondie

Consultez les documents detailles pour les specifications completes :

api-spec.md : Contrats HTTP, payloads de requete/reponse, codes d'erreur.
database-schema.md : Schema relationnel PostgreSQL, modeles Prisma, contraintes d'integrite.

## Installation et Demarrage

Frontend

cd frontend
npm install
npm start          # Demmarre le serveur de developpement sur http://localhost:4200

Backend

cd backend
npm install
npm run dev        # Demmarre le serveur Express sur http://localhost:3000

## Specifications Detaillees

Pour les details des modeles de donnees, des schemas de validation et des contrats d'API, consultez le dossier docs.

```

```