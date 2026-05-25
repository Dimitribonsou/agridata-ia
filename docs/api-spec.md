# Spécification des Contrats d'API

Ce document décrit les points d'accès HTTP disponibles sur le serveur backend Express, les structures de requête acceptées, les codes de réponse et les règles de validation.

## Base de l'API

```
Base URL: http://localhost:3000/api
```

Tous les endpoints retournent du JSON. Les requêtes doivent inclure l'en-tête Content-Type: application/json pour les méthodes POST et PUT.

## Codes de Réponse HTTP

- 200 OK : Requête réussie. Le corps de la réponse contient les données demandées.
- 201 Created : Ressource créée avec succès. Le corps de la réponse contient la nouvelle ressource.
- 400 Bad Request : Erreur de validation. La requête contient des données invalides selon les schémas Zod.
- 404 Not Found : Ressource non trouvée.
- 500 Internal Server Error : Erreur serveur. Détails disponibles dans le corps de la réponse.

## Authentification

Les endpoints ne nécessitent pas d'authentification dans la version actuelle. La sécurité sera ajoutée dans les versions futures.

## Endpoints

### Analyses Laitières

#### Récupérer toutes les analyses

```
GET /api/analyses
```

Répond avec un tableau d'analyses laitières pour tous les producteurs enregistrés.

**Réponse (200 OK)**

```json
[
  {
    "id": "1",
    "producerName": "Élevage du Grand Jean",
    "producerId": "PROD-001",
    "exploitation": "Élevage du Grand Jean",
    "email": "contact@grandejean.fr",
    "sampleDate": "2026-05-25",
    "status": "ALERTE",
    "metrics": {
      "fatRate": 3.8,
      "proteinRate": 3.2,
      "somaticCells": 245000,
      "cryoscopy": -0.51
    }
  }
]
```

#### Récupérer une analyse par ID

```
GET /api/analyses/:id
```

**Paramètres de Route**

- id (string) : Identifiant unique de l'analyse.

**Réponse (200 OK)**

Retourne l'objet MilkAnalysis.

**Réponse (404 Not Found)**

```json
{
  "error": "Analyse non trouvée",
  "id": "999"
}
```

#### Créer une nouvelle analyse

```
POST /api/analyses
```

**Corps de la Requête**

```json
{
  "producerName": "Élevage Nouveau",
  "producerId": "PROD-002",
  "exploitation": "Exploitation Nouvelle",
  "email": "nouveau@example.com",
  "sampleDate": "2026-05-25",
  "status": "COMFORME",
  "metrics": {
    "fatRate": 4.1,
    "proteinRate": 3.3,
    "somaticCells": 150000,
    "cryoscopy": -0.52
  }
}
```

**Schéma de Validation (Zod)**

- producerName : string, longueur minimale 3, maximale 100
- producerId : string, format PROD-XXX (regex validée)
- exploitation : string, longueur minimale 3, maximale 100
- email : string, email valide
- sampleDate : string, format ISO 8601 (YYYY-MM-DD)
- status : enum (COMFORME | ALERTE)
- metrics.fatRate : number optionnel, entre 0 et 10
- metrics.proteinRate : number optionnel, entre 0 et 5
- metrics.somaticCells : number optionnel, entre 0 et 1000000
- metrics.cryoscopy : number optionnel, entre -1 et 0

**Réponse (201 Created)**

Retourne l'objet MilkAnalysis créé avec un nouvel id généré.

**Réponse (400 Bad Request)**

```json
{
  "error": "Validation échouée",
  "issues": [
    {
      "field": "producerName",
      "message": "La valeur doit contenir au moins 3 caractères"
    }
  ]
}
```

### Génération de Rapport IA

#### Générer un rapport d'analyse via Gemini

```
POST /api/analyses/:id/generate-report
```

**Paramètres de Route**

- id (string) : Identifiant de l'analyse.

**Corps de la Requête**

```json
{
  "customPrompt": "Générez une analyse approfondie avec recommandations prioritaires."
}
```

**Paramètres**

- customPrompt (string, optionnel) : Instructions supplémentaires pour l'API Gemini. Si omis, un prompt par défaut est utilisé.

**Processus**

1. Récupère l'analyse laitière par ID depuis la base de données.
2. Construit un prompt structuré incluant les métriques laitières et le contexte d'alerte.
3. Appelle l'API Gemini 2.4.0 avec le prompt.
4. Retourne le rapport généré au format texte.

**Réponse (200 OK)**

```json
{
  "report": "RAPPORT D'ANALYSE LAITIÈRE\n\nProducteur: Élevage du Grand Jean\nStatus: ALERTE\n\nDiagnostic: La hausse des cellules somatiques (245000/mL) indique une probable mammite subclinique. Recommandations immédiates: vérifier l'hygiène de traite, renforcer l'observation clinique du cheptel, envisager une antibiothérapie ciblée après culture du lait.",
  "analysisId": "1",
  "generatedAt": "2026-05-25T14:30:00Z"
}
```

**Réponse (404 Not Found)**

L'analyse demandée n'existe pas.

**Réponse (503 Service Unavailable)**

L'API Gemini est temporairement indisponible.

### Expédition par Courrier Électronique

#### Envoyer un rapport par email

```
POST /api/shipping/send-report
```

**Corps de la Requête**

```json
{
  "analysisId": "1",
  "recipientEmail": "contact@grandejean.fr",
  "reportContent": "RAPPORT D'ANALYSE LAITIÈRE...",
  "subject": "Résultats d'analyse - Élevage du Grand Jean"
}
```

**Paramètres**

- analysisId (string) : Identifiant de l'analyse associée.
- recipientEmail (string) : Adresse email du destinataire (validée par schéma email).
- reportContent (string) : Contenu du rapport à envoyer.
- subject (string) : Objet du courrier électronique.

**Schéma de Validation**

- recipientEmail : format email valide
- reportContent : longueur minimale 10 caractères
- subject : longueur minimale 5 caractères

**Processus**

1. Valide les paramètres selon les schémas Zod.
2. Configure le client Nodemailer avec les identifiants SMTP.
3. Envoie le rapport au format texte ou HTML.
4. Enregistre un log d'expédition en base de données (timestamp, adresse destinataire, statut).

**Réponse (200 OK)**

```json
{
  "success": true,
  "messageId": "<abc123@mail.com>",
  "recipient": "contact@grandejean.fr",
  "sentAt": "2026-05-25T14:35:00Z"
}
```

**Réponse (400 Bad Request)**

Validation échouée ou email invalide.

**Réponse (500 Internal Server Error)**

```json
{
  "error": "Erreur lors de l'envoi du courrier",
  "details": "SMTP connection timeout"
}
```

## Modèles de Données

### MilkAnalysis

```typescript
interface MilkAnalysis {
  id: string;
  producerName: string;           // Nom de l'éleveur
  producerId: string;              // Code producteur unique
  exploitation: string;             // Nom de l'exploitation
  email: string;                   // Email de contact
  sampleDate: string;              // Date de prélèvement (ISO 8601)
  status: 'COMFORME' | 'ALERTE';   // Conformité aux normes
  metrics: MilkMetrics;            // Résultats analytiques
  createdAt?: string;              // Timestamp de création
  updatedAt?: string;              // Timestamp de dernière modification
}
```

### MilkMetrics

```typescript
interface MilkMetrics {
  fatRate?: number | null;         // Taux de matière grasse (%) 0-10
  proteinRate?: number | null;     // Taux de protéine (%) 0-5
  somaticCells?: number | null;    // Cellules somatiques (/mL) 0-1000000
  cryoscopy?: number | null;       // Cryoscopie (°C) -1 à 0
}
```

## Gestion des Erreurs

Tous les endpoints retournent une structure d'erreur cohérente en cas d'exception :

```json
{
  "error": "Description lisible de l'erreur",
  "code": "ERROR_CODE",
  "timestamp": "2026-05-25T14:30:00Z",
  "path": "/api/analyses/999"
}
```

## Déploiement et Configuration

La configuration de l'API (port, base de données, clés API) est gérée via variables d'environnement définies dans un fichier `.env.local` :

```
DATABASE_URL=postgresql://user:password@localhost:5432/agridata
GEMINI_API_KEY=sk-...
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@agridata.com
SMTP_PASSWORD=...
NODE_ENV=production
```