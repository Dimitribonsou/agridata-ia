Specification des Contrats d'API

Ce document decrit les points d'acces HTTP disponibles sur le serveur backend Express, les structures de requete acceptees, les codes de reponse et les regles de validation.

Table des Matieres

- [Base de l'API](#base-de-lapi)
- [Codes de Reponse HTTP](#codes-de-reponse-http)
- [Authentification](#authentification)
- [Endpoints](#endpoints)
  - [Analyses Laitieres](#analyses-laitieres)
  - [Generation de Rapport IA](#generation-de-rapport-ia)
  - [Expedition par Courrier Electronique](#expedition-par-courrier-electronique)
- [Modeles de Donnees](#modeles-de-donnees)
- [Gestion des Erreurs](#gestion-des-erreurs)
- [Deploiement et Configuration](#deploiement-et-configuration)

# Base de l'API

Base URL: http://localhost:3000/api

Tous les endpoints retournent du JSON. Les requetes doivent inclure l'en-tete Content-Type: application/json pour les methodes POST et PUT.

# Codes de Reponse HTTP

200 OK : Requete reussie. Le corps de la reponse contient les donnees demandees.
201 Created : Ressource creee avec succes. Le corps de la reponse contient la nouvelle ressource.
400 Bad Request : Erreur de validation. La requete contient des donnees invalides selon les schemas Zod.
404 Not Found : Ressource non trouvee.
500 Internal Server Error : Erreur serveur. Details disponibles dans le corps de la reponse.

# Authentification

Les endpoints ne necessitent pas d'authentification dans la version actuelle. La securite sera ajoutee dans les versions futures.

# Endpoints

Analyses Laitieres

Recuperer toutes les analyses

- GET /api/analyses

Repond avec un tableau d'analyses laitieres pour tous les producteurs enregistres.

- Reponse (200 OK)

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

Recuperer une analyse par ID

- GET /api/analyses/:id

Parametres de Route

id (string) : Identifiant unique de l'analyse.

Reponse (200 OK)

Retourne l'objet MilkAnalysis.

* Reponse (404 Not Found)

```json
{
  "error": "Analyse non trouvée",
  "id": "999"
}
```

Creer une nouvelle analyse

- POST /api/analyses

Corps de la Requete

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

# Schema de Validation (Zod)

producerName : string, longueur minimale 3, maximale 100    
producerId : string, format PROD-XXX (regex validee)    
exploitation : string, longueur minimale 3, maximale 100      
email : string, email valide    
sampleDate : string, format ISO 8601 (YYYY-MM-DD)      
status : enum (COMFORME | ALERTE)  
metrics.fatRate : number optionnel, entre 0 et 10      
metrics.proteinRate : number optionnel, entre 0 et 5      
metrics.somaticCells : number optionnel, entre 0 et 1000000      
metrics.cryoscopy : number optionnel, entre -1 et 0      

- Reponse (201 Created)

Retourne l'objet MilkAnalysis cree avec un nouvel id genere.

- Reponse (400 Bad Request)

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

# Generation de Rapport IA

Generer un rapport d'analyse via Gemini

POST /api/analyses/:id/generate-report

Parametres de Route

id (string) : Identifiant de l'analyse.

Corps de la Requete

```json
{
  "customPrompt": "Générez une analyse approfondie avec recommandations prioritaires."
}
```

# Parametres

customPrompt (string, optionnel) : Instructions supplementaires pour l'API Gemini. Si omis, un prompt par defaut est utilise.

Processus

1. Recupere l'analyse laitiere par ID depuis la base de donnees.
2. Construit un prompt structure incluant les metriques laitieres et le contexte d'alerte.
3. Appelle l'API Gemini 2.4.0 avec le prompt.
4. Retourne le rapport genere au format texte.

Reponse (200 OK)

```json
{
  "report": "RAPPORT D'ANALYSE LAITIÈRE Producteur: Élevage du Grand Jean  Status:   ALERTE  
  Diagnostic: La hausse des cellules somatiques (245000/mL) indique une probable mammite subclinique. Recommandations immédiates: vérifier l'hygiène de traite, renforcer l'observation clinique du cheptel, envisager une antibiothérapie ciblée après culture du lait.",
  "analysisId": "1",
  "generatedAt": "2026-05-25T14:30:00Z"
}
```

Reponse (404 Not Found)

L'analyse demandee n'existe pas.

Reponse (503 Service Unavailable)

L'API Gemini est temporairement indisponible.

Expedition par Courrier Electronique

Envoyer un rapport par email

- POST /api/shipping/send-report

Corps de la Requete

```json
{
  "analysisId": "1",
  "recipientEmail": "contact@grandejean.fr",
  "reportContent": "RAPPORT D'ANALYSE LAITIÈRE...",
  "subject": "Résultats d'analyse - Élevage du Grand Jean"
}
```

Parametres

analysisId (string) : Identifiant de l'analyse associee.    
recipientEmail (string) : Adresse email du destinataire (validee par schema email).    
reportContent (string) : Contenu du rapport a envoyer.    
subject (string) : Objet du courrier electronique.  

Schema de Validation

recipientEmail : format email valide  
reportContent : longueur minimale 10 caracteres  
subject : longueur minimale 5 caracteres

Processus

1. Valide les parametres selon les schemas Zod.
2. Configure le client Nodemailer avec les identifiants SMTP.
3. Envoie le rapport au format texte ou HTML.
4. Enregistre un log d'expedition en base de donnees (timestamp, adresse destinataire, statut).

- Reponse (200 OK)

```json
{
  "success": true,
  "messageId": "<abc123@mail.com>",
  "recipient": "contact@grandejean.fr",
  "sentAt": "2026-05-25T14:35:00Z"
}
```

- Reponse (400 Bad Request)

Validation echouee ou email invalide.

- Reponse (500 Internal Server Error)

```json
{
  "error": "Erreur lors de l'envoi du courrier",
  "details": "SMTP connection timeout"
}
```

# Modeles de Donnees

MilkAnalysis

interface MilkAnalysis {    
  id: string;    
  producerName: string;               // Nom de l'eleveur  
  producerId: string;                  // Code producteur unique
  exploitation: string;                 // Nom de l'exploitation
  email: string;                       // Email de contact    
  sampleDate: string;                 // Date de prelevement (ISO 8601)  
  status: 'COMFORME' | 'ALERTE';     // Conformite aux normes  
  metrics: MilkMetrics;              // Resultats analytiques
  createdAt?: string;                // Timestamp de creation
  updatedAt?: string;                // Timestamp de derniere modification  
}

MilkMetrics

interface MilkMetrics {  
  fatRate?: number | null;             // Taux de matiere grasse (%) 0-10  
  proteinRate?: number | null;         // Taux de proteine (%) 0-5     
  somaticCells?: number |   null;          // Cellules somatiques (/mL) 0-1000000   
  cryoscopy?: number | null;            // Cryoscopie (degres C) -1 a 0   
}

# Gestion des Erreurs

Tous les endpoints retournent une structure d'erreur coherente en cas d'exception :

{  
  "error": "Description lisible de l'erreur",  
  "code": "ERROR_CODE",   
  "timestamp": "2026-05-25T14:30:00Z",  
  "path": "/api/analyses/999"  
}

# Deploiement et Configuration

La configuration de l'API (port, base de donnees, cles API) est geree via variables d'environnement definies dans un fichier .env.local :

DATABASE_URL=postgresql://user:password@localhost:5432/agridata
GEMINI_API_KEY=sk-...  
SMTP_HOST=smtp.gmail.com  
SMTP_PORT=587
SMTP_USER=noreply@agridata.com
SMTP_PASSWORD=...   
NODE_ENV=production