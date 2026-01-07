# Neo4j AuraDB Setup Guide for GENESIS

## Overview
Neo4j AuraDB is a fully managed cloud graph database. We'll use the **free tier** for Soul Family discovery, Synastry relationships, and profile graphs.

## Step 1: Create Neo4j AuraDB Account

1. Go to [https://neo4j.com/cloud/aura/](https://neo4j.com/cloud/aura/)
2. Click "Start Free" or "Get Started Free"
3. Sign up with Google, GitHub, or email

## Step 2: Create a Free Instance

1. After login, click "New Instance"
2. Select **AuraDB Free** (includes 200K nodes, 400K relationships)
3. Choose your region (closest to your Firebase region for low latency)
4. Name your instance: `genesis-soul-family`
5. Click "Create"

## Step 3: Save Your Credentials

**IMPORTANT**: Save these immediately - the password is only shown once!

After creation, you'll see:
- **Connection URI**: `neo4j+s://xxxxxxxx.databases.neo4j.io`
- **Username**: `neo4j`
- **Password**: `your-generated-password`

Copy these to a secure location.

## Step 4: Configure Firebase Secrets

Use Firebase Secret Manager for secure credential storage:

```bash
# Set Neo4j URI
firebase functions:secrets:set NEO4J_URI
# Enter: neo4j+s://xxxxxxxx.databases.neo4j.io

# Set Neo4j Password
firebase functions:secrets:set NEO4J_PASSWORD
# Enter: your-generated-password
```

## Step 5: Verify Connection

Test your connection in Neo4j Browser:

1. In AuraDB console, click "Open with Neo4j Browser"
2. Login with your credentials
3. Run this test query:
```cypher
RETURN "GENESIS Connected!" AS message
```

## Step 6: Initialize Schema

Run this in Neo4j Browser to set up indexes and constraints:

```cypher
// Create constraints for uniqueness
CREATE CONSTRAINT profile_userId IF NOT EXISTS
FOR (p:Profile) REQUIRE p.userId IS UNIQUE;

CREATE CONSTRAINT sign_name IF NOT EXISTS
FOR (s:Sign) REQUIRE s.name IS UNIQUE;

// Create indexes for fast queries
CREATE INDEX profile_dominant IF NOT EXISTS
FOR (p:Profile) ON (p.dominantElement);

CREATE INDEX profile_sunSign IF NOT EXISTS
FOR (p:Profile) ON (p.sunSign);

// Create Sign nodes for all zodiac signs
UNWIND ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
        'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'] AS signName
MERGE (s:Sign {name: signName})
SET s.element = CASE
  WHEN signName IN ['Aries', 'Leo', 'Sagittarius'] THEN 'fire'
  WHEN signName IN ['Taurus', 'Virgo', 'Capricorn'] THEN 'earth'
  WHEN signName IN ['Gemini', 'Libra', 'Aquarius'] THEN 'air'
  ELSE 'water'
END,
s.modality = CASE
  WHEN signName IN ['Aries', 'Cancer', 'Libra', 'Capricorn'] THEN 'cardinal'
  WHEN signName IN ['Taurus', 'Leo', 'Scorpio', 'Aquarius'] THEN 'fixed'
  ELSE 'mutable'
END;
```

## Step 7: Verify Schema

Run this to confirm setup:

```cypher
// Check constraints
SHOW CONSTRAINTS;

// Check indexes
SHOW INDEXES;

// Check Sign nodes
MATCH (s:Sign) RETURN s.name, s.element, s.modality ORDER BY s.name;
```

## Data Model

### Nodes

```
(:Profile {
  userId: string,        // Firebase Auth UID
  sunSign: string,       // "Taurus"
  moonSign: string,      // "Cancer"
  risingSign: string,    // "Leo"
  fireElement: float,    // 25.5
  earthElement: float,   // 30.2
  airElement: float,     // 20.1
  waterElement: float,   // 24.2
  dominantElement: string,  // "earth"
  updatedAt: datetime
})

(:Sign {
  name: string,    // "Taurus"
  element: string, // "earth"
  modality: string // "fixed"
})
```

### Relationships

```
(:Profile)-[:HAS_SUN_IN]->(:Sign)
(:Profile)-[:HAS_MOON_IN]->(:Sign)
(:Profile)-[:HAS_RISING_IN]->(:Sign)
(:Profile)-[:SYNASTRY_WITH {
  compatibilityScore: float,
  aspectCount: int,
  elementalDynamic: string,
  calculatedAt: datetime
}]->(:Profile)
```

## Example Queries

### Find Soul Family (Similar Elements)
```cypher
MATCH (me:Profile {userId: $myUserId})
MATCH (other:Profile)
WHERE other.userId <> me.userId
WITH me, other,
     abs(me.fireElement - other.fireElement) +
     abs(me.earthElement - other.earthElement) +
     abs(me.airElement - other.airElement) +
     abs(me.waterElement - other.waterElement) AS elementDiff
WHERE elementDiff < 40
RETURN other, 100 - (elementDiff / 4) AS compatibilityScore
ORDER BY compatibilityScore DESC
LIMIT 10
```

### Find Fire + Air Amplifiers
```cypher
MATCH (me:Profile {userId: $myUserId})
WHERE me.dominantElement = 'fire'
MATCH (other:Profile)
WHERE other.dominantElement = 'air'
RETURN other, "amplifier" AS connectionType
```

### Get Synastry Connections
```cypher
MATCH (p:Profile {userId: $userId})-[r:SYNASTRY_WITH]-(other:Profile)
RETURN other.userId, other.sunSign, r.compatibilityScore
ORDER BY r.compatibilityScore DESC
```

## Free Tier Limits

- **Nodes**: 200,000
- **Relationships**: 400,000
- **Storage**: Included
- **Always Free**: Yes (no credit card required)

For GENESIS, this supports approximately:
- 50,000 user profiles
- Full synastry network
- Complete Soul Family graph

## Troubleshooting

### Connection Refused
- Check your URI includes `neo4j+s://` (secure connection)
- Verify instance is running in AuraDB console
- Check Firebase secrets are set correctly

### Slow Queries
- Ensure indexes are created
- Use LIMIT on large result sets
- Profile queries with EXPLAIN/PROFILE

### Authentication Failed
- Reset password in AuraDB console if needed
- Update Firebase secret: `firebase functions:secrets:set NEO4J_PASSWORD`
