-- GENESIS ADMIN CMS DATABASE SCHEMA
-- Khan Academy for Relationships - Content Management System

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================
-- CORE CONTENT TABLES
-- ==============================================

-- Modules (Top-level content containers)
CREATE TABLE IF NOT EXISTS modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  color VARCHAR(20),
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_by UUID,
  updated_by UUID
);

-- Sections (Children of Modules)
CREATE TABLE IF NOT EXISTS sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  slug VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_by UUID,
  updated_by UUID,
  UNIQUE(module_id, slug)
);

-- Subsections (Children of Sections - actual content)
CREATE TABLE IF NOT EXISTS subsections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_id UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  slug VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT, -- Markdown content
  content_type VARCHAR(50) DEFAULT 'markdown' CHECK (content_type IN ('markdown', 'video', 'quiz', 'exercise')),
  video_url VARCHAR(500),
  duration_minutes INTEGER,
  difficulty VARCHAR(20) CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_by UUID,
  updated_by UUID,
  UNIQUE(section_id, slug)
);

-- ==============================================
-- TRANSLATION TABLES
-- ==============================================

-- Supported Languages
CREATE TABLE IF NOT EXISTS languages (
  code VARCHAR(10) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  native_name VARCHAR(100) NOT NULL,
  flag VARCHAR(10),
  is_active BOOLEAN DEFAULT true,
  is_rtl BOOLEAN DEFAULT false
);

-- Module Translations
CREATE TABLE IF NOT EXISTS module_translations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  language_code VARCHAR(10) NOT NULL REFERENCES languages(code),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  translated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  translated_by VARCHAR(50), -- 'claude', 'human', 'deepseek'
  reviewed BOOLEAN DEFAULT false,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID,
  UNIQUE(module_id, language_code)
);

-- Section Translations
CREATE TABLE IF NOT EXISTS section_translations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_id UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  language_code VARCHAR(10) NOT NULL REFERENCES languages(code),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  translated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  translated_by VARCHAR(50),
  reviewed BOOLEAN DEFAULT false,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID,
  UNIQUE(section_id, language_code)
);

-- Subsection Translations
CREATE TABLE IF NOT EXISTS subsection_translations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subsection_id UUID NOT NULL REFERENCES subsections(id) ON DELETE CASCADE,
  language_code VARCHAR(10) NOT NULL REFERENCES languages(code),
  title VARCHAR(255) NOT NULL,
  content TEXT,
  translated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  translated_by VARCHAR(50),
  reviewed BOOLEAN DEFAULT false,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID,
  UNIQUE(subsection_id, language_code)
);

-- ==============================================
-- ADMIN USER TABLES
-- ==============================================

CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  display_name VARCHAR(100),
  role VARCHAR(20) DEFAULT 'editor' CHECK (role IN ('admin', 'editor', 'reviewer', 'translator')),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================
-- INDEXES
-- ==============================================

CREATE INDEX IF NOT EXISTS idx_modules_status ON modules(status);
CREATE INDEX IF NOT EXISTS idx_modules_sort_order ON modules(sort_order);
CREATE INDEX IF NOT EXISTS idx_sections_module_id ON sections(module_id);
CREATE INDEX IF NOT EXISTS idx_sections_status ON sections(status);
CREATE INDEX IF NOT EXISTS idx_subsections_section_id ON subsections(section_id);
CREATE INDEX IF NOT EXISTS idx_subsections_status ON subsections(status);
CREATE INDEX IF NOT EXISTS idx_module_translations_lang ON module_translations(language_code);
CREATE INDEX IF NOT EXISTS idx_section_translations_lang ON section_translations(language_code);
CREATE INDEX IF NOT EXISTS idx_subsection_translations_lang ON subsection_translations(language_code);

-- ==============================================
-- SEED DATA - Languages
-- ==============================================

INSERT INTO languages (code, name, native_name, flag, is_active, is_rtl) VALUES
  ('en', 'English', 'English', '🇺🇸', true, false),
  ('zh', 'Chinese', '中文', '🇨🇳', true, false),
  ('es', 'Spanish', 'Español', '🇪🇸', true, false),
  ('ja', 'Japanese', '日本語', '🇯🇵', true, false),
  ('ko', 'Korean', '한국어', '🇰🇷', true, false),
  ('fr', 'French', 'Français', '🇫🇷', true, false),
  ('de', 'German', 'Deutsch', '🇩🇪', true, false),
  ('pt', 'Portuguese', 'Português', '🇧🇷', true, false),
  ('ru', 'Russian', 'Русский', '🇷🇺', true, false),
  ('ar', 'Arabic', 'العربية', '🇸🇦', true, true),
  ('hi', 'Hindi', 'हिन्दी', '🇮🇳', true, false),
  ('th', 'Thai', 'ไทย', '🇹🇭', true, false),
  ('vi', 'Vietnamese', 'Tiếng Việt', '🇻🇳', true, false)
ON CONFLICT (code) DO NOTHING;

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_modules_updated_at
  BEFORE UPDATE ON modules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_sections_updated_at
  BEFORE UPDATE ON sections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_subsections_updated_at
  BEFORE UPDATE ON subsections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
