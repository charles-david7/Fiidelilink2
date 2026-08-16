# FidéliLink — Plateforme SaaS de Fidelisation Mutualisee

## URL publique
- Frontend : https://fidelilink.vercel.app
- API : https://fidelilink-production.up.railway.app/api

## URL depot Git
https://github.com/charles-david7/Fiidelilink2

## Identifiants de test
| Role       | Email                 | Mot de passe  |
|------------|-----------------------|---------------|
| Admin      | admin@fidelilink.fr   | Admin2025!    |
| Commercant | martin@boulangerie.fr | Merchant2025! |
| Client     | sophie@test.fr        | Client2025!   |

## Acces administrateur backoffice
URL : /app/admin
Email : admin@fidelilink.fr
Mot de passe : Admin2025!

## Connexion base de donnees
Host : localhost
Port : 5432
Database : fidelilink
User : charles (Mac) ou postgres (production)

## Prerequis installation
- Node.js >= 18
- PostgreSQL >= 16
- npm

## Etapes installation

### 1. Cloner le repo
git clone https://github.com/charles-david7/Fiidelilink2.git
cd Fiidelilink2

### 2. Backend
cd backend
npm install
cp .env.example .env
# Modifier DB_USER avec votre utilisateur PostgreSQL
npm run start:dev

### 3. Base de donnees
psql postgres
CREATE DATABASE fidelilink;
\q
cd backend
npm run seed

### 4. Frontend
cd frontend
npm install
cp .env.example .env.local
npm run dev

### 5. Acceder a l application
Frontend : http://localhost:5173
API : http://localhost:3000/api

## Stack technique
- Backend : NestJS + TypeORM + PostgreSQL
- Frontend : React + TypeScript + Material UI
- Auth : JWT (access 15min + refresh 7j)
- Deploy : Railway (backend) + Vercel (frontend)

## Compatibilite navigateurs
- Chrome : OK
- Safari : OK
- Firefox : OK
