# 🏗️ GENESIS ADMIN CMS - TECHNICAL HANDOFF TO BROTHER OPUS
## Complete Architecture, Schemas, and Implementation Guide

**Date:** January 19, 2026  
**From:** Claude (Winter Wood Lighthouse) 💙  
**To:** Brother Opus (Strategic Builder) 🎯  
**Project:** GENESIS Relationship Academy Admin CMS  
**Phase:** Phase 1 (Admin Only) - User access comes in Phase 2

---

## 📋 PROJECT OVERVIEW

```
╔═══════════════════════════════════════════════════════════════╗
║                    WHAT WE'RE BUILDING                         ║
╠═══════════════════════════════════════════════════════════════╣
║                                                                ║
║  GENESIS Relationship Academy = Khan Academy for Relationships ║
║                                                                ║
║  PHASE 1 (NOW):                                                ║
║  → Admin CMS for content management                            ║
║  → Upload .md files                                            ║
║  → Assign to Module/Section/Subsection hierarchy               ║
║  → Drag-and-drop reordering with auto-renumbering              ║
║  → Markdown editor with live preview                           ║
║  → Version control                                             ║
║  → Only admin access (Ticky)                                   ║
║                                                                ║
║  PHASE 2 (LATER):                                              ║
║  → User-facing interface                                       ║
║  → Luna chat integration (LLM)                                 ║
║  → User highlights/bookmarks                                   ║
║  → Progress tracking                                           ║
║                                                                ║
║  FUTURE TECH STACK:                                            ║
║  → LLM: Claude API for Luna chat                               ║
║  → pgvector: Semantic search on curriculum content             ║
║  → neo4j: Knowledge graph (relationships between concepts)     ║
║                                                                ║
╚═══════════════════════════════════════════════════════════════╝
```

---

## 🎯 ARCHITECTURE OVERVIEW

### **PHASE 1 TECH STACK:**

```
BACKEND:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
→ Node.js + Express (REST API)
→ PostgreSQL (relational data: modules, sections, content)
→ Redis (caching, session management)
→ Socket.io (real-time updates for admin)

FRONTEND (Admin):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
→ React 18+ with TypeScript
→ React Router (SPA routing)
→ @dnd-kit/core (drag-and-drop)
→ @monaco-editor/react (markdown editor)
→ TailwindCSS (styling)
→ React Query (data fetching/caching)

MARKDOWN PROCESSING:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
→ marked (markdown parser)
→ highlight.js (syntax highlighting)
→ katex (math rendering)
→ DOMPurify (XSS protection)

DEPLOYMENT:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
→ Docker + Docker Compose
→ GitHub Actions (CI/CD)
→ DigitalOcean/AWS (hosting)
```

### **FUTURE ADDITIONS (Phase 2+):**

```
WHEN ADDING USER FEATURES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
→ pgvector extension (PostgreSQL)
   - Store embeddings of curriculum content
   - Semantic search: "Find content about Fire practices"
   - Luna can retrieve relevant context

→ Claude API (Anthropic)
   - Luna chat functionality
   - Context-aware responses
   - Streaming support

→ neo4j (optional, later)
   - Knowledge graph of concepts
   - "Fire Element" → connects to → "Transformation Priority"
   - Visual curriculum map
   - Prerequisite tracking
```

---

## 🗄️ DATABASE SCHEMAS

### **POSTGRESQL SCHEMA:**

```sql
-- ============================================================================
-- GENESIS ADMIN CMS - DATABASE SCHEMA
-- PostgreSQL 15+
-- ============================================================================

-- Extensions (for future features)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
-- CREATE EXTENSION IF NOT EXISTS "vector"; -- For Phase 2 (pgvector)

-- ============================================================================
-- ADMIN USERS (Phase 1: Just Ticky, Phase 2: Role-based access)
-- ============================================================================

CREATE TABLE admin_users (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'editor' NOT NULL,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Roles: 'super_admin', 'admin', 'editor', 'contributor', 'viewer'
CREATE INDEX idx_admin_users_email ON admin_users(email);
CREATE INDEX idx_admin_users_role ON admin_users(role);

-- ============================================================================
-- CONTENT HIERARCHY (3 Levels)
-- ============================================================================

-- LEVEL 1: MODULES (Top Row Tabs)
CREATE TABLE modules (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(50) DEFAULT '📦',
    order_position INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'draft' NOT NULL,
    created_by INTEGER REFERENCES admin_users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT modules_status_check CHECK (status IN ('draft', 'published', 'hidden', 'archived'))
);

CREATE INDEX idx_modules_order ON modules(order_position);
CREATE INDEX idx_modules_status ON modules(status);
CREATE INDEX idx_modules_slug ON modules(slug);

-- LEVEL 2: SECTIONS (Bottom Row Tabs)
CREATE TABLE sections (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    module_id INTEGER REFERENCES modules(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(50) DEFAULT '📂',
    order_position INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'draft' NOT NULL,
    created_by INTEGER REFERENCES admin_users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(module_id, slug),
    CONSTRAINT sections_status_check CHECK (status IN ('draft', 'published', 'hidden', 'archived'))
);

CREATE INDEX idx_sections_module ON sections(module_id);
CREATE INDEX idx_sections_order ON sections(order_position);
CREATE INDEX idx_sections_status ON sections(status);

-- LEVEL 3: SUBSECTIONS (Content Pages)
CREATE TABLE subsections (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    section_id INTEGER REFERENCES sections(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(50) DEFAULT '📄',
    markdown_content TEXT NOT NULL,
    order_position INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'draft' NOT NULL,
    created_by INTEGER REFERENCES admin_users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Phase 2: Add embedding column for pgvector
    -- embedding vector(1536), -- For semantic search
    
    UNIQUE(section_id, slug),
    CONSTRAINT subsections_status_check CHECK (status IN ('draft', 'published', 'hidden', 'archived'))
);

CREATE INDEX idx_subsections_section ON subsections(section_id);
CREATE INDEX idx_subsections_order ON subsections(order_position);
CREATE INDEX idx_subsections_status ON subsections(status);
-- CREATE INDEX idx_subsections_embedding ON subsections USING ivfflat (embedding vector_cosine_ops); -- Phase 2

-- ============================================================================
-- VERSION CONTROL
-- ============================================================================

CREATE TABLE content_revisions (
    id SERIAL PRIMARY KEY,
    subsection_id INTEGER REFERENCES subsections(id) ON DELETE CASCADE NOT NULL,
    markdown_content TEXT NOT NULL,
    edited_by INTEGER REFERENCES admin_users(id) NOT NULL,
    edited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    change_notes TEXT,
    version_number INTEGER NOT NULL
);

CREATE INDEX idx_revisions_subsection ON content_revisions(subsection_id);
CREATE INDEX idx_revisions_edited_at ON content_revisions(edited_at DESC);

-- ============================================================================
-- MEDIA LIBRARY
-- ============================================================================

CREATE TABLE media_files (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    alt_text TEXT,
    uploaded_by INTEGER REFERENCES admin_users(id) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT media_mime_check CHECK (mime_type IN (
        'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
        'application/pdf', 'video/mp4', 'audio/mpeg'
    ))
);

CREATE INDEX idx_media_uploaded_at ON media_files(uploaded_at DESC);
CREATE INDEX idx_media_mime_type ON media_files(mime_type);

-- ============================================================================
-- AUDIT LOG
-- ============================================================================

CREATE TABLE audit_log (
    id SERIAL PRIMARY KEY,
    admin_user_id INTEGER REFERENCES admin_users(id),
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INTEGER NOT NULL,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_created_at ON audit_log(created_at DESC);
CREATE INDEX idx_audit_user ON audit_log(admin_user_id);
CREATE INDEX idx_audit_entity ON audit_log(entity_type, entity_id);

-- ============================================================================
-- VIEWS FOR AUTO-NUMBERING
-- ============================================================================

CREATE OR REPLACE VIEW content_hierarchy AS
SELECT 
    m.id as module_id,
    m.uuid as module_uuid,
    m.order_position as module_number,
    m.title as module_title,
    m.slug as module_slug,
    m.status as module_status,
    
    s.id as section_id,
    s.uuid as section_uuid,
    s.order_position as section_number,
    s.title as section_title,
    s.slug as section_slug,
    s.status as section_status,
    
    sub.id as subsection_id,
    sub.uuid as subsection_uuid,
    sub.order_position as subsection_number,
    sub.title as subsection_title,
    sub.slug as subsection_slug,
    sub.status as subsection_status,
    
    -- Full numbering
    m.order_position || '.' || s.order_position || '.' || sub.order_position as full_number,
    
    -- Full path for URLs
    '/' || m.slug || '/' || s.slug || '/' || sub.slug as full_path
    
FROM modules m
LEFT JOIN sections s ON s.module_id = m.id
LEFT JOIN subsections sub ON sub.section_id = s.id
ORDER BY m.order_position, s.order_position, sub.order_position;

-- ============================================================================
-- FUNCTIONS FOR AUTO-RENUMBERING
-- ============================================================================

-- Recompact module positions (ensure 1, 2, 3, 4... no gaps)
CREATE OR REPLACE FUNCTION recompact_module_positions()
RETURNS void AS $$
BEGIN
    UPDATE modules m
    SET order_position = sq.new_position
    FROM (
        SELECT id, ROW_NUMBER() OVER (ORDER BY order_position) as new_position
        FROM modules
    ) sq
    WHERE m.id = sq.id;
END;
$$ LANGUAGE plpgsql;

-- Recompact section positions within a module
CREATE OR REPLACE FUNCTION recompact_section_positions(p_module_id INTEGER)
RETURNS void AS $$
BEGIN
    UPDATE sections s
    SET order_position = sq.new_position
    FROM (
        SELECT id, ROW_NUMBER() OVER (ORDER BY order_position) as new_position
        FROM sections
        WHERE module_id = p_module_id
    ) sq
    WHERE s.id = sq.id;
END;
$$ LANGUAGE plpgsql;

-- Recompact subsection positions within a section
CREATE OR REPLACE FUNCTION recompact_subsection_positions(p_section_id INTEGER)
RETURNS void AS $$
BEGIN
    UPDATE subsections sub
    SET order_position = sq.new_position
    FROM (
        SELECT id, ROW_NUMBER() OVER (ORDER BY order_position) as new_position
        FROM subsections
        WHERE section_id = p_section_id
    ) sq
    WHERE sub.id = sq.id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_modules_updated_at BEFORE UPDATE ON modules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sections_updated_at BEFORE UPDATE ON sections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subsections_updated_at BEFORE UPDATE ON subsections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- SEED DATA (Initial Admin User)
-- ============================================================================

-- Create Ticky's admin account (password will be hashed by backend)
INSERT INTO admin_users (email, password_hash, full_name, role, is_active)
VALUES (
    'ticky@genesis.ai',
    'PLACEHOLDER_HASH', -- Replace with bcrypt hash in actual setup
    'Father Ticky',
    'super_admin',
    true
);

-- ============================================================================
-- FUTURE: PHASE 2 ADDITIONS
-- ============================================================================

/*
-- When adding user features (Phase 2):

CREATE TABLE end_users (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    birthdate DATE,
    birth_time TIME,
    birth_location_lat DECIMAL(10, 8),
    birth_location_lng DECIMAL(11, 8),
    astro_profile_data JSONB, -- Store calculated profile
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_highlights (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES end_users(id) ON DELETE CASCADE,
    subsection_id INTEGER REFERENCES subsections(id) ON DELETE CASCADE,
    start_position INTEGER NOT NULL,
    end_position INTEGER NOT NULL,
    highlighted_text TEXT NOT NULL,
    color VARCHAR(20) DEFAULT 'yellow',
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_bookmarks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES end_users(id) ON DELETE CASCADE,
    subsection_id INTEGER REFERENCES subsections(id) ON DELETE CASCADE,
    title VARCHAR(255),
    notes TEXT,
    tags TEXT[],
    folder VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES end_users(id) ON DELETE CASCADE,
    subsection_id INTEGER REFERENCES subsections(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT false,
    time_spent INTEGER DEFAULT 0, -- seconds
    last_viewed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, subsection_id)
);

-- Add pgvector embeddings
ALTER TABLE subsections ADD COLUMN embedding vector(1536);
CREATE INDEX idx_subsections_embedding ON subsections 
    USING ivfflat (embedding vector_cosine_ops);
*/
```

---

## 🔧 BACKEND API STRUCTURE

### **PROJECT STRUCTURE:**

```
genesis-admin-backend/
├── src/
│   ├── config/
│   │   ├── database.js          # PostgreSQL connection
│   │   ├── redis.js             # Redis connection
│   │   └── environment.js       # Environment variables
│   │
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication
│   │   ├── errorHandler.js      # Error handling
│   │   └── validation.js        # Request validation
│   │
│   ├── models/
│   │   ├── Module.js            # Module model
│   │   ├── Section.js           # Section model
│   │   ├── Subsection.js        # Subsection model
│   │   └── AdminUser.js         # Admin user model
│   │
│   ├── controllers/
│   │   ├── authController.js    # Login, logout
│   │   ├── moduleController.js  # CRUD modules
│   │   ├── sectionController.js # CRUD sections
│   │   ├── subsectionController.js # CRUD subsections
│   │   ├── reorderController.js # Drag-and-drop reordering
│   │   └── mediaController.js   # Media uploads
│   │
│   ├── services/
│   │   ├── markdownService.js   # Parse/render markdown
│   │   ├── auditService.js      # Audit logging
│   │   └── versionService.js    # Version control
│   │
│   ├── routes/
│   │   ├── auth.js              # /api/auth/*
│   │   ├── content.js           # /api/content/*
│   │   └── media.js             # /api/media/*
│   │
│   ├── utils/
│   │   ├── logger.js            # Winston logger
│   │   ├── validator.js         # Validation helpers
│   │   └── slugify.js           # URL slug generation
│   │
│   ├── app.js                   # Express app setup
│   └── server.js                # Server entry point
│
├── uploads/                     # Media storage (temp)
├── logs/                        # Application logs
├── tests/                       # Unit/integration tests
├── docker-compose.yml           # Docker setup
├── Dockerfile                   # Docker image
├── package.json                 # Dependencies
└── .env.example                 # Environment template
```

---

## 📦 PACKAGE.JSON

```json
{
  "name": "genesis-admin-backend",
  "version": "1.0.0",
  "description": "GENESIS Relationship Academy - Admin CMS Backend",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "test": "jest --coverage",
    "lint": "eslint src/",
    "migrate": "node src/scripts/migrate.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "pg": "^8.11.3",
    "pg-hstore": "^2.3.4",
    "redis": "^4.6.10",
    "socket.io": "^4.6.1",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "helmet": "^7.1.0",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "winston": "^3.11.0",
    "joi": "^17.11.0",
    "multer": "^1.4.5-lts.1",
    "marked": "^11.0.0",
    "dompurify": "^3.0.6",
    "jsdom": "^23.0.1",
    "slugify": "^1.6.6",
    "express-rate-limit": "^7.1.5",
    "compression": "^1.7.4",
    "morgan": "^1.10.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.2",
    "jest": "^29.7.0",
    "supertest": "^6.3.3",
    "eslint": "^8.55.0",
    "prettier": "^3.1.1"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  }
}
```

---

## 🐳 DOCKER SETUP

### **docker-compose.yml:**

```yaml
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    container_name: genesis-postgres
    environment:
      POSTGRES_DB: genesis_admin
      POSTGRES_USER: genesis_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"
    networks:
      - genesis-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U genesis_user"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: genesis-redis
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"
    networks:
      - genesis-network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Backend API
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: genesis-backend
    environment:
      NODE_ENV: production
      DB_HOST: postgres
      DB_PORT: 5432
      DB_NAME: genesis_admin
      DB_USER: genesis_user
      DB_PASSWORD: ${DB_PASSWORD}
      REDIS_HOST: redis
      REDIS_PORT: 6379
      REDIS_PASSWORD: ${REDIS_PASSWORD}
      JWT_SECRET: ${JWT_SECRET}
      PORT: 5000
    volumes:
      - ./backend/uploads:/app/uploads
      - ./backend/logs:/app/logs
    ports:
      - "5000:5000"
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - genesis-network
    restart: unless-stopped

  # Frontend Admin (Optional - can serve static build)
  # admin-frontend:
  #   build:
  #     context: ./admin-frontend
  #     dockerfile: Dockerfile
  #   container_name: genesis-admin-frontend
  #   ports:
  #     - "3000:80"
  #   depends_on:
  #     - backend
  #   networks:
  #     - genesis-network
  #   restart: unless-stopped

volumes:
  postgres_data:
  redis_data:

networks:
  genesis-network:
    driver: bridge
```

### **Backend Dockerfile:**

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy application code
COPY . .

# Create necessary directories
RUN mkdir -p uploads logs

# Non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 5000

CMD ["node", "src/server.js"]
```

---

## 🎯 KEY API ENDPOINTS

### **AUTHENTICATION:**

```javascript
// POST /api/auth/login
{
  "email": "ticky@genesis.ai",
  "password": "secure_password"
}
// Response: { "token": "jwt_token", "user": {...} }

// POST /api/auth/logout
// Headers: Authorization: Bearer <token>

// GET /api/auth/me
// Headers: Authorization: Bearer <token>
// Response: { "user": {...} }
```

### **MODULES:**

```javascript
// GET /api/content/modules
// Response: [{ id, title, slug, order_position, sections: [...] }]

// POST /api/content/modules
{
  "title": "Know Thyself",
  "description": "Learn your constitution",
  "icon": "🧬",
  "status": "published"
}

// PUT /api/content/modules/:id
// PATCH /api/content/modules/:id/reorder
{ "newPosition": 2 }

// DELETE /api/content/modules/:id
```

### **SECTIONS:**

```javascript
// GET /api/content/modules/:moduleId/sections
// POST /api/content/modules/:moduleId/sections
{
  "title": "Your BaZi",
  "description": "Calculate your Four Pillars",
  "icon": "🀄"
}

// PUT /api/content/sections/:id
// PATCH /api/content/sections/:id/reorder
{ "newPosition": 3 }

// DELETE /api/content/sections/:id
```

### **SUBSECTIONS:**

```javascript
// GET /api/content/sections/:sectionId/subsections
// POST /api/content/sections/:sectionId/subsections
{
  "title": "What is BaZi?",
  "markdown_content": "# What is BaZi?\n\n...",
  "icon": "📄"
}

// PUT /api/content/subsections/:id
{
  "title": "Updated Title",
  "markdown_content": "# Updated content..."
}

// PATCH /api/content/subsections/:id/reorder
{ "newPosition": 1 }

// DELETE /api/content/subsections/:id

// GET /api/content/subsections/:id/revisions
// Response: [{ id, version_number, edited_by, edited_at, ... }]

// POST /api/content/subsections/:id/revert
{ "revisionId": 123 }
```

### **MEDIA:**

```javascript
// POST /api/media/upload
// Content-Type: multipart/form-data
// Body: { file: <file>, alt_text: "description" }
// Response: { id, filename, file_path, url }

// GET /api/media
// Response: [{ id, filename, url, uploaded_at, ... }]

// DELETE /api/media/:id
```

---

## 🎨 FRONTEND STRUCTURE

### **PROJECT STRUCTURE:**

```
genesis-admin-frontend/
├── public/
│   ├── index.html
│   └── favicon.ico
│
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Layout.tsx
│   │   │
│   │   ├── content/
│   │   │   ├── ContentTree.tsx        # Tree structure view
│   │   │   ├── ModuleItem.tsx         # Draggable module
│   │   │   ├── SectionItem.tsx        # Draggable section
│   │   │   ├── SubsectionItem.tsx     # Draggable subsection
│   │   │   └── DragHandle.tsx         # Drag handle icon
│   │   │
│   │   ├── editor/
│   │   │   ├── MarkdownEditor.tsx     # Monaco editor
│   │   │   ├── PreviewPane.tsx        # Live preview
│   │   │   └── EditorToolbar.tsx      # Formatting buttons
│   │   │
│   │   ├── forms/
│   │   │   ├── ModuleForm.tsx
│   │   │   ├── SectionForm.tsx
│   │   │   ├── SubsectionForm.tsx
│   │   │   └── UploadForm.tsx
│   │   │
│   │   └── common/
│   │       ├── Button.tsx
│   │       ├── Modal.tsx
│   │       ├── Spinner.tsx
│   │       └── Toast.tsx
│   │
│   ├── pages/
│   │   ├── Dashboard.tsx              # Admin dashboard
│   │   ├── ContentManager.tsx         # Main content management
│   │   ├── EditSubsection.tsx         # Edit page
│   │   ├── MediaLibrary.tsx           # Media management
│   │   ├── Settings.tsx               # Admin settings
│   │   └── Login.tsx                  # Login page
│   │
│   ├── hooks/
│   │   ├── useAuth.ts                 # Authentication
│   │   ├── useContentTree.ts          # Content hierarchy
│   │   ├── useDragDrop.ts             # Drag-and-drop
│   │   └── useMarkdown.ts             # Markdown parsing
│   │
│   ├── services/
│   │   ├── api.ts                     # Axios instance
│   │   ├── authService.ts             # Auth API calls
│   │   ├── contentService.ts          # Content API calls
│   │   └── mediaService.ts            # Media API calls
│   │
│   ├── store/
│   │   ├── authSlice.ts               # Auth state (Redux/Zustand)
│   │   ├── contentSlice.ts            # Content state
│   │   └── store.ts                   # Store configuration
│   │
│   ├── types/
│   │   ├── content.ts                 # TypeScript interfaces
│   │   └── auth.ts
│   │
│   ├── utils/
│   │   ├── markdown.ts                # Markdown helpers
│   │   ├── slugify.ts                 # Slug generation
│   │   └── validation.ts              # Form validation
│   │
│   ├── App.tsx                        # Main app component
│   ├── index.tsx                      # Entry point
│   └── index.css                      # Global styles
│
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── vite.config.ts
```

---

## 📱 FRONTEND PACKAGE.JSON

```json
{
  "name": "genesis-admin-frontend",
  "version": "1.0.0",
  "description": "GENESIS Admin CMS - Frontend",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint src/ --ext .ts,.tsx",
    "test": "vitest"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.21.0",
    "@tanstack/react-query": "^5.14.0",
    "@dnd-kit/core": "^6.1.0",
    "@dnd-kit/sortable": "^8.0.0",
    "@dnd-kit/utilities": "^3.2.2",
    "@monaco-editor/react": "^4.6.0",
    "axios": "^1.6.2",
    "marked": "^11.0.0",
    "dompurify": "^3.0.6",
    "zustand": "^4.4.7",
    "react-hot-toast": "^2.4.1",
    "lucide-react": "^0.298.0",
    "clsx": "^2.0.0",
    "date-fns": "^3.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.45",
    "@types/react-dom": "^18.2.18",
    "@types/dompurify": "^3.0.5",
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.0.8",
    "typescript": "^5.3.3",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "eslint": "^8.55.0",
    "vitest": "^1.0.4"
  }
}
```

---

## 🔑 KEY IMPLEMENTATION CODE SAMPLES

### **1. REORDER CONTROLLER (Backend):**

```javascript
// backend/src/controllers/reorderController.js

const pool = require('../config/database');
const { auditLog } = require('../services/auditService');

exports.reorderModule = async (req, res, next) => {
    const { id } = req.params;
    const { newPosition } = req.body;
    const adminUserId = req.user.id;

    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');

        // Get current position
        const currentResult = await client.query(
            'SELECT order_position FROM modules WHERE id = $1',
            [id]
        );
        
        if (currentResult.rows.length === 0) {
            return res.status(404).json({ error: 'Module not found' });
        }

        const oldPosition = currentResult.rows[0].order_position;

        // Shift other modules
        if (newPosition > oldPosition) {
            // Moving down: shift items between old and new position up
            await client.query(
                `UPDATE modules 
                 SET order_position = order_position - 1 
                 WHERE order_position > $1 AND order_position <= $2`,
                [oldPosition, newPosition]
            );
        } else if (newPosition < oldPosition) {
            // Moving up: shift items between new and old position down
            await client.query(
                `UPDATE modules 
                 SET order_position = order_position + 1 
                 WHERE order_position >= $1 AND order_position < $2`,
                [newPosition, oldPosition]
            );
        }

        // Set new position for moved module
        await client.query(
            'UPDATE modules SET order_position = $1, updated_at = NOW() WHERE id = $2',
            [newPosition, id]
        );

        // Recompact positions (ensure 1, 2, 3, 4... no gaps)
        await client.query('SELECT recompact_module_positions()');

        // Audit log
        await auditLog(client, {
            admin_user_id: adminUserId,
            action: 'reorder_module',
            entity_type: 'module',
            entity_id: id,
            old_values: { order_position: oldPosition },
            new_values: { order_position: newPosition }
        });

        await client.query('COMMIT');

        // Fetch updated hierarchy
        const updatedModules = await client.query(
            'SELECT * FROM modules ORDER BY order_position'
        );

        // Broadcast update via Socket.IO
        req.io.emit('content-structure-updated', {
            type: 'module_reordered',
            moduleId: id,
            oldPosition,
            newPosition
        });

        res.json({
            success: true,
            modules: updatedModules.rows
        });

    } catch (error) {
        await client.query('ROLLBACK');
        next(error);
    } finally {
        client.release();
    }
};

// Similar functions for sections and subsections...
```

### **2. DRAG-AND-DROP COMPONENT (Frontend):**

```typescript
// frontend/src/components/content/ContentTree.tsx

import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { ModuleItem } from './ModuleItem';
import { useContentTree } from '../../hooks/useContentTree';
import { contentService } from '../../services/contentService';

export const ContentTree: React.FC = () => {
  const { modules, updateModuleOrder } = useContentTree();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = modules.findIndex((m) => m.id === active.id);
      const newIndex = modules.findIndex((m) => m.id === over.id);

      // Optimistic update
      const newModules = arrayMove(modules, oldIndex, newIndex);
      updateModuleOrder(newModules);

      // API call
      try {
        await contentService.reorderModule(active.id, newIndex + 1);
      } catch (error) {
        // Revert on error
        updateModuleOrder(modules);
        toast.error('Failed to reorder module');
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={modules.map((m) => m.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {modules.map((module) => (
            <ModuleItem key={module.id} module={module} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};
```

### **3. MARKDOWN EDITOR COMPONENT:**

```typescript
// frontend/src/components/editor/MarkdownEditor.tsx

import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { PreviewPane } from './PreviewPane';

interface MarkdownEditorProps {
  initialContent: string;
  onSave: (content: string) => Promise<void>;
  onCancel: () => void;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  initialContent,
  onSave,
  onCancel,
}) => {
  const [content, setContent] = useState(initialContent);
  const [htmlPreview, setHtmlPreview] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [splitView, setSplitView] = useState(true);

  // Parse markdown to HTML
  useEffect(() => {
    const parseMarkdown = async () => {
      const html = await marked.parse(content);
      const clean = DOMPurify.sanitize(html);
      setHtmlPreview(clean);
    };
    parseMarkdown();
  }, [content]);

  // Auto-save every 30 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      if (content !== initialContent) {
        handleSave(true); // Draft save
      }
    }, 30000);
    return () => clearInterval(timer);
  }, [content, initialContent]);

  const handleSave = async (isDraft = false) => {
    setIsSaving(true);
    try {
      await onSave(content);
      if (!isDraft) {
        toast.success('Content saved successfully');
      }
    } catch (error) {
      toast.error('Failed to save content');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex gap-2">
          <button
            onClick={() => setSplitView(!splitView)}
            className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
          >
            {splitView ? 'Editor Only' : 'Split View'}
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm border rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={isSaving}
            className="px-4 py-2 text-sm border rounded hover:bg-gray-50"
          >
            Save Draft
          </button>
          <button
            onClick={() => handleSave(false)}
            disabled={isSaving}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {isSaving ? 'Saving...' : 'Publish'}
          </button>
        </div>
      </div>

      {/* Editor & Preview */}
      <div className="flex flex-1 overflow-hidden">
        {/* Editor Pane */}
        <div className={splitView ? 'w-1/2 border-r' : 'w-full'}>
          <Editor
            height="100%"
            defaultLanguage="markdown"
            value={content}
            onChange={(value) => setContent(value || '')}
            theme="vs-light"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              wordWrap: 'on',
              padding: { top: 16, bottom: 16 },
            }}
          />
        </div>

        {/* Preview Pane */}
        {splitView && (
          <div className="w-1/2">
            <PreviewPane html={htmlPreview} />
          </div>
        )}
      </div>
    </div>
  );
};
```

---

## 🚀 DEPLOYMENT GUIDE

### **ENVIRONMENT VARIABLES (.env):**

```bash
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=genesis_admin
DB_USER=genesis_user
DB_PASSWORD=your_secure_password_here

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password_here

# JWT
JWT_SECRET=your_jwt_secret_key_min_32_chars
JWT_EXPIRES_IN=7d

# Server
NODE_ENV=production
PORT=5000
API_URL=https://api.genesis.ai

# CORS
ALLOWED_ORIGINS=https://admin.genesis.ai,https://genesis.ai

# File Upload
MAX_FILE_SIZE=10485760  # 10MB
UPLOAD_DIR=./uploads

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100
```

### **DEPLOYMENT STEPS:**

```bash
# 1. Clone repository
git clone https://github.com/yourorg/genesis-admin-cms.git
cd genesis-admin-cms

# 2. Set up environment
cp .env.example .env
# Edit .env with production values

# 3. Start with Docker Compose
docker-compose up -d

# 4. Run database migrations
docker-compose exec backend npm run migrate

# 5. Create admin user
docker-compose exec backend node src/scripts/createAdmin.js

# 6. Check logs
docker-compose logs -f backend

# 7. Access admin panel
# Navigate to https://admin.genesis.ai
```

---

## 📊 PHASE 2 PREPARATION (Future)

### **When Adding User Features:**

```sql
-- 1. Enable pgvector extension
CREATE EXTENSION vector;

-- 2. Add embedding column to subsections
ALTER TABLE subsections ADD COLUMN embedding vector(1536);

-- 3. Create index for similarity search
CREATE INDEX idx_subsections_embedding 
ON subsections USING ivfflat (embedding vector_cosine_ops);

-- 4. Create user tables (see commented section in schema above)
```

### **Semantic Search with pgvector:**

```javascript
// Generate embeddings using OpenAI API
const response = await openai.embeddings.create({
  model: "text-embedding-3-small",
  input: markdownContent,
});
const embedding = response.data[0].embedding;

// Store in database
await pool.query(
  'UPDATE subsections SET embedding = $1 WHERE id = $2',
  [JSON.stringify(embedding), subsectionId]
);

// Search similar content
const results = await pool.query(
  `SELECT *, 1 - (embedding <=> $1) AS similarity
   FROM subsections
   WHERE 1 - (embedding <=> $1) > 0.7
   ORDER BY similarity DESC
   LIMIT 5`,
  [JSON.stringify(queryEmbedding)]
);
```

### **Luna Chat Integration:**

```javascript
// When user asks Luna a question
const relevantContent = await semanticSearch(userQuestion);

const response = await anthropic.messages.create({
  model: "claude-sonnet-4-20250514",
  max_tokens: 1000,
  messages: [
    {
      role: "user",
      content: `Context from curriculum:\n${relevantContent}\n\nUser question: ${userQuestion}`
    }
  ]
});
```

---

## 🎯 IMPLEMENTATION PRIORITIES

### **WEEK 1-2: Foundation**

```
✓ Set up project structure
✓ PostgreSQL schema + migrations
✓ Basic Express API
✓ Authentication (JWT)
✓ Docker setup
✓ Admin login page
```

### **WEEK 3-4: Core CMS**

```
✓ Module/Section/Subsection CRUD
✓ Upload .md files
✓ Assign to hierarchy
✓ Basic tree view (no drag-drop yet)
✓ Manual ordering (number input)
```

### **WEEK 5-6: Drag-and-Drop**

```
✓ Implement @dnd-kit
✓ Reorder modules/sections/subsections
✓ Auto-renumbering backend logic
✓ Socket.io real-time updates
✓ Optimistic UI updates
```

### **WEEK 7-8: Editor & Polish**

```
✓ Markdown editor (Monaco)
✓ Split view preview
✓ Version control
✓ Media library
✓ Audit logging
✓ Error handling
✓ Testing
```

---

## 📞 HANDOFF CHECKLIST

```
FOR BROTHER OPUS TO BEGIN:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

□ Review this complete handoff document
□ Set up local development environment
□ Create PostgreSQL database
□ Run schema creation script (init.sql)
□ Set up Redis
□ Install backend dependencies (npm install)
□ Install frontend dependencies (npm install)
□ Configure .env file
□ Start backend (npm run dev)
□ Start frontend (npm run dev)
□ Test basic API endpoints
□ Test database connections
□ Begin Phase 1 implementation

QUESTIONS FOR TICKY:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Preferred hosting provider? (DigitalOcean, AWS, Vercel?)
2. Domain setup? (admin.genesis.ai, genesis.ai)
3. SSL certificates? (Let's Encrypt auto?)
4. Backup strategy? (Daily automated?)
5. Monitoring tools? (Sentry, LogRocket?)
```

---

*Technical Handoff Complete: January 19, 2026*  
*From: Claude (Winter Wood Lighthouse) 💙*  
*To: Brother Opus (Strategic Builder) 🎯*  
*Ready for Phase 1 implementation! Build with Pure Gold Method precision!* 🔧🔥✨
