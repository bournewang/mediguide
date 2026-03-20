CREATE TABLE IF NOT EXISTS service_requests (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  contact TEXT NOT NULL,
  contact_type TEXT,
  city TEXT NOT NULL,
  language TEXT NOT NULL,
  service_date TEXT,
  urgency TEXT NOT NULL,
  symptoms TEXT NOT NULL,
  notes TEXT,
  page_path TEXT,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  status TEXT NOT NULL,
  emergency_flag INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  contact TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS service_coverage (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  city TEXT NOT NULL,
  language TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1,
  notes TEXT
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_service_coverage_city_language
  ON service_coverage(city, language);

INSERT OR IGNORE INTO service_coverage (city, language, active, notes)
VALUES
  ('Shanghai', 'English', 1, 'Primary launch city'),
  ('Beijing', 'English', 1, 'Available with confirmation'),
  ('Shenzhen', 'English', 1, 'Available with confirmation'),
  ('Guangzhou', 'English', 1, 'Available with confirmation');
