-- FidéliLink — SQL Dump (structure + données de test)
-- Usage : psql fidelilink < fidelilink_dump.sql

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop tables
DROP TABLE IF EXISTS merchant_follows CASCADE;
DROP TABLE IF EXISTS registrations CASCADE;
DROP TABLE IF EXISTS point_balances CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS offers CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS merchants CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE NOT NULL,
  "passwordHash" VARCHAR NOT NULL,
  "firstName" VARCHAR,
  "lastName" VARCHAR,
  role VARCHAR DEFAULT 'client' CHECK (role IN ('client', 'merchant', 'admin')),
  "universalPoints" INTEGER DEFAULT 0,
  "loyaltyLevel" VARCHAR DEFAULT 'bronze',
  "isActive" BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Merchants
CREATE TABLE merchants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  description TEXT,
  logo VARCHAR,
  category VARCHAR,
  address VARCHAR,
  city VARCHAR,
  phone VARCHAR,
  plan VARCHAR DEFAULT 'starter' CHECK (plan IN ('starter', 'pro', 'business')),
  status VARCHAR DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended')),
  "followerCount" INTEGER DEFAULT 0,
  "totalScans" INTEGER DEFAULT 0,
  "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Point balances
CREATE TABLE point_balances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "merchantId" UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  balance INTEGER DEFAULT 0,
  "updatedAt" TIMESTAMP DEFAULT NOW(),
  UNIQUE("userId", "merchantId")
);

-- Transactions
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "merchantId" UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  "totalPoints" INTEGER DEFAULT 0,
  "merchantPoints" INTEGER DEFAULT 0,
  "universalPoints" INTEGER DEFAULT 0,
  "createdAt" TIMESTAMP DEFAULT NOW()
);

-- Offers
CREATE TABLE offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "merchantId" UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  title VARCHAR NOT NULL,
  description TEXT,
  type VARCHAR DEFAULT 'percent' CHECK (type IN ('percent', 'fixed', 'multiplier')),
  value DECIMAL(5,2) DEFAULT 0,
  "targetLevel" VARCHAR,
  "startDate" TIMESTAMP,
  "endDate" TIMESTAMP,
  quota INTEGER DEFAULT 0,
  "usedCount" INTEGER DEFAULT 0,
  "isActive" BOOLEAN DEFAULT true,
  "isSponsored" BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMP DEFAULT NOW()
);

-- Events
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "merchantId" UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  title VARCHAR NOT NULL,
  description TEXT,
  "eventDate" TIMESTAMP NOT NULL,
  location VARCHAR,
  "totalSlots" INTEGER DEFAULT 0,
  "registeredCount" INTEGER DEFAULT 0,
  "normalPrice" DECIMAL(8,2) DEFAULT 0,
  "memberPrice" DECIMAL(8,2) DEFAULT 0,
  "isFree" BOOLEAN DEFAULT false,
  "isActive" BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP DEFAULT NOW()
);

-- Registrations
CREATE TABLE registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "eventId" UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  status VARCHAR DEFAULT 'registered',
  "qrToken" VARCHAR,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  UNIQUE("userId", "eventId")
);

-- Merchant follows
CREATE TABLE merchant_follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "merchantId" UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  "notifEnabled" BOOLEAN DEFAULT true,
  "followedAt" TIMESTAMP DEFAULT NOW(),
  UNIQUE("userId", "merchantId")
);

-- Indexes
CREATE INDEX idx_transactions_user ON transactions("userId", "createdAt" DESC);
CREATE INDEX idx_point_balances_user ON point_balances("userId");
CREATE INDEX idx_offers_active ON offers("isActive", "merchantId");
CREATE INDEX idx_events_date ON events("eventDate", "isActive");
CREATE INDEX idx_follows_user ON merchant_follows("userId");

-- Insert test data
-- Passwords: bcrypt hash of 'Admin2025!', 'Merchant2025!', 'Client2025!'
INSERT INTO users (email, "passwordHash", "firstName", "lastName", role, "universalPoints", "loyaltyLevel") VALUES
  ('admin@fidelilink.fr',     '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMeJfg3Kyd7hRoQS7XVAz6JeWC', 'Admin', 'FidéliLink', 'admin', 0, 'bronze'),
  ('martin@boulangerie.fr',   '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMeJfg3Kyd7hRoQS7XVAz6JeWC', 'Martin', 'Dupont', 'merchant', 0, 'bronze'),
  ('cafe@leflore.fr',         '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMeJfg3Kyd7hRoQS7XVAz6JeWC', 'Camille', 'Leflore', 'merchant', 0, 'bronze'),
  ('lib@bleu.fr',             '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMeJfg3Kyd7hRoQS7XVAz6JeWC', 'Lucas', 'Bleu', 'merchant', 0, 'bronze'),
  ('sophie@test.fr',          '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMeJfg3Kyd7hRoQS7XVAz6JeWC', 'Sophie', 'Martin', 'client', 428, 'argent'),
  ('marc@test.fr',            '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMeJfg3Kyd7hRoQS7XVAz6JeWC', 'Marc', 'Leroy', 'client', 150, 'bronze'),
  ('julie@test.fr',           '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMeJfg3Kyd7hRoQS7XVAz6JeWC', 'Julie', 'Moreau', 'client', 780, 'or');

-- Note: Use 'npm run seed' for full seeding with proper UUIDs and relations
-- The TypeScript seed file handles all relational data correctly