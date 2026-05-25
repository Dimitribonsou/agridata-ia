Schema de Base de Donnees

Ce document decrit le schema relationnel PostgreSQL utilise pour persister les donnees de la plateforme AgriData-AI. Le schema est defini a travers Prisma ORM et gere par migrations versionees.

Vue d'Ensemble

La base de donnees AgriData-AI gere les entites suivantes :

1. Analysis : Enregistrements d'analyses laitieres provenant des laboratoires.
2. Producer : Metadonnees des producteurs laitiers (preserv pour evolution future).
3. ShippingLog : Journal des envois de rapports par courrier electronique.

Tables PostgreSQL

Table: milkAnalyses

Stocke les resultats d'analyses laitieres pour chaque producteur.

Colonnes

| Nom | Type | Constraints | Description |
|-----|------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Identifiant unique de l'analyse |
| producerName | VARCHAR(100) | NOT NULL | Nom du producteur/éleveur |
| producerId | VARCHAR(50) | NOT NULL, UNIQUE | Code producteur unique (ex: PROD-001) |
| exploitation | VARCHAR(100) | NOT NULL | Nom de l'exploitation laitière |
| email | VARCHAR(255) | NOT NULL | Email de contact du producteur |
| sampleDate | DATE | NOT NULL | Date du prélèvement de lait |
| status | ENUM('COMFORME', 'ALERTE') | NOT NULL | Conformité aux normes de qualité |
| fatRate | DECIMAL(4,2) | NULLABLE | Taux de matière grasse en % (0-10) |
| proteinRate | DECIMAL(4,2) | NULLABLE | Taux de protéine en % (0-5) |
| somaticCells | INTEGER | NULLABLE | Cellules somatiques par mL (0-1000000) |
| cryoscopy | DECIMAL(4,2) | NULLABLE | Cryoscopie en degrés Celsius (-1 à 0) |
| createdAt | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Timestamp de création de l'enregistrement |
| updatedAt | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Timestamp de dernière modification |

**Index**

```sql
CREATE INDEX idx_milkAnalyses_producerId ON milkAnalyses(producerId);
CREATE INDEX idx_milkAnalyses_status ON milkAnalyses(status);
CREATE INDEX idx_milkAnalyses_sampleDate ON milkAnalyses(sampleDate DESC);
```

**Schéma Prisma**

```prisma
model MilkAnalysis {
  id            String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  producerName  String   @db.VarChar(100)
  producerId    String   @unique @db.VarChar(50)
  exploitation  String   @db.VarChar(100)
  email         String   @db.VarChar(255)
  sampleDate    DateTime @db.Date
  status        Status   @default(COMFORME)
  fatRate       Decimal? @db.Decimal(4, 2)
  proteinRate   Decimal? @db.Decimal(4, 2)
  somaticCells  Int?
  cryoscopy     Decimal? @db.Decimal(4, 2)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  shippingLogs  ShippingLog[]

  @@map("milkAnalyses")
}

enum Status {
  COMFORME
  ALERTE
}
```

### Table: shippingLogs

Journal d'audit des envois de rapports par courriel électronique.

**Colonnes**

| Nom | Type | Constraints | Description |
|-----|------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Identifiant unique du log d'envoi |
| analysisId | UUID | FOREIGN KEY(milkAnalyses.id), NOT NULL | Référence à l'analyse associée |
| recipientEmail | VARCHAR(255) | NOT NULL | Adresse email du destinataire |
| subject | VARCHAR(255) | NOT NULL | Objet du courrier envoyé |
| reportContentHash | VARCHAR(64) | NULLABLE | Hash SHA256 du contenu (pour dedup) |
| status | ENUM('PENDING', 'SENT', 'FAILED') | NOT NULL, DEFAULT 'PENDING' | État d'expédition |
| errorMessage | TEXT | NULLABLE | Message d'erreur si l'envoi a échoué |
| sentAt | TIMESTAMP | NULLABLE | Timestamp de l'envoi réussi |
| createdAt | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Timestamp de création du log |
| updatedAt | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Timestamp de dernière modification |

**Index**

```sql
CREATE INDEX idx_shippingLogs_analysisId ON shippingLogs(analysisId);
CREATE INDEX idx_shippingLogs_status ON shippingLogs(status);
CREATE INDEX idx_shippingLogs_sentAt ON shippingLogs(sentAt DESC);
CREATE INDEX idx_shippingLogs_recipientEmail ON shippingLogs(recipientEmail);
```

**Schéma Prisma**

```prisma
model ShippingLog {
  id                String    @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  analysis          MilkAnalysis @relation(fields: [analysisId], references: [id], onDelete: Cascade)
  analysisId        String    @db.Uuid
  recipientEmail    String    @db.VarChar(255)
  subject           String    @db.VarChar(255)
  reportContentHash String?   @db.VarChar(64)
  status            ShippingStatus @default(PENDING)
  errorMessage      String?   @db.Text
  sentAt            DateTime?
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt

  @@map("shippingLogs")
  @@index([analysisId])
  @@index([status])
  @@index([sentAt])
}

enum ShippingStatus {
  PENDING
  SENT
  FAILED
}
```

## Contraintes d'Intégrité

### Clé Primaire

Chaque table possède une clé primaire UUID générée automatiquement par PostgreSQL. Cette approche facilite la distribution horizontale de la base de données si elle est nécessaire à l'avenir.

### Clé Étrangère

- **shippingLogs.analysisId** référence **milkAnalyses.id** avec suppression en cascade (CASCADE). Lorsqu'une analyse est supprimée, tous les logs d'expédition associés sont supprimés automatiquement.

### Unicité

- **milkAnalyses.producerId** : Unique par producteur. Deux analyses ne peuvent pas être créées pour le même code producteur le même jour (validation applicative ou unique combinée).

## Opérations Courantes

### Récupérer toutes les analyses

```sql
SELECT * FROM "milkAnalyses"
ORDER BY "sampleDate" DESC;
```

### Récupérer les analyses en alerte

```sql
SELECT * FROM "milkAnalyses"
WHERE status = 'ALERTE'
ORDER BY "sampleDate" DESC;
```

### Récupérer l'historique des envois pour une analyse

```sql
SELECT * FROM "shippingLogs"
WHERE "analysisId" = '12345678-1234-5678-1234-567812345678'
ORDER BY "createdAt" DESC;
```

### Récupérer les analyses non conformes de cette semaine

```sql
SELECT * FROM "milkAnalyses"
WHERE status = 'ALERTE'
  AND "sampleDate" >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY "sampleDate" DESC;
```

### Compter les analyses par statut

```sql
SELECT status, COUNT(*) as count
FROM "milkAnalyses"
GROUP BY status;
```

### Récupérer la moyenne des cellules somatiques pour tous les producteurs

```sql
SELECT 
  "producerId",
  "producerName",
  AVG("somaticCells") as avg_somatic_cells,
  MAX("somaticCells") as max_somatic_cells
FROM "milkAnalyses"
WHERE "somaticCells" IS NOT NULL
GROUP BY "producerId", "producerName"
ORDER BY avg_somatic_cells DESC;
```

## Migrations Prisma

Chaque modification du schéma doit être versionnée par une migration Prisma. Les migrations sont stockées dans le répertoire `backend/prisma/migrations/`.

### Créer une nouvelle migration

```bash
cd backend
npx prisma migrate dev --name add_new_field
```

Cette commande :
1. Crée une migration SQL correspondant aux changements du schéma.
2. Applique la migration à la base de données de développement.
3. Régénère les types TypeScript dans `@prisma/client`.

### Appliquer les migrations en production

```bash
npx prisma migrate deploy
```

Cette commande applique toutes les migrations en attente à la base de données de production.

## Données d'Exemple

Population initiale de la table milkAnalyses :

```sql
INSERT INTO "milkAnalyses" (
  "producerName", "producerId", "exploitation", "email", "sampleDate",
  "status", "fatRate", "proteinRate", "somaticCells", "cryoscopy"
) VALUES 
  (
    'Élevage du Grand Jean', 'PROD-001', 'Élevage du Grand Jean',
    'contact@grandejean.fr', '2026-05-25',
    'ALERTE', 3.8, 3.2, 245000, -0.51
  ),
  (
    'GAEC Les Trois Bonnets', 'PROD-002', 'GAEC Les Trois Bonnets',
    'contact@troisbonnets.fr', '2026-05-25',
    'COMFORME', 4.1, 3.3, 150000, -0.52
  ),
  (
    'Ferme Laitière Mont-Cenis', 'PROD-003', 'Ferme Laitière Mont-Cenis',
    'contact@montcenis.fr', '2026-05-25',
    'ALERTE', 3.5, 3.0, 320000, -0.48
  );
```

## Performance et Indexation

Les index créés sur les colonnes clés garantissent les performances de requête :

- **status** : Indexé pour les requêtes filtrées par conformité (ALERTE vs COMFORME).
- **sampleDate** : Indexé en ordre décroissant pour les requêtes sur les analyses récentes.
- **producerId** : Indexé pour les recherches par producteur unique.
- **analysisId** (shippingLogs) : Indexé pour rejoindre rapidement les logs d'expédition.

## Stratégies de Sauvegarde

Les stratégies de sauvegarde (backup) de PostgreSQL doivent inclure :

1. Sauvegardes complètes quotidiennes via `pg_dump`.
2. Sauvegardes incrémentielles (WAL archiving) pour la récupération point-in-time.
3. Réplication en standby chaud pour la haute disponibilité.

Exemple de sauvegarde :

```bash
pg_dump -U postgres agridata > backup_$(date +%Y%m%d_%H%M%S).sql
```