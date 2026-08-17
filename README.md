# FidéliLink — Plateforme SaaS de Fidelisation Mutualisee

## URL publique
- Frontend : https://fiidelilink2.vercel.app
- API : https://fiidelilink2-production.up.railway.app/api

## URL depot Git
https://github.com/charles-david7/Fiidelilink2

## Identifiants de test
| Role       | Email                 | Mot de passe  |
|------------|-----------------------|---------------|
| Admin      | admin@fidelilink.fr   | Admin2025!    |
| Commercant | martin@boulangerie.fr | Merchant2025! |
| Client     | sophie@test.fr        | Client2025!   |

## Acces admin backoffice
URL : https://fiidelilink2.vercel.app/app/admin
Email : admin@fidelilink.fr
Mot de passe : Admin2025!

## Base de donnees
Railway PostgreSQL - connexion via DATABASE_URL

## Prerequis
Node.js >= 18, PostgreSQL >= 16, npm

## Installation locale

### Backend
cd backend
npm install
cp .env.example .env
npm run start:dev

### Frontend
cd frontend
npm install
cp .env.example .env.local
npm run dev

### Seed
cd backend && npm run seed

## Navigateurs testes
Chrome, Safari, Firefox
