# FidéliLink — Dossier de rendu

## URL publique
- Frontend : (a completer apres deploiement Vercel)
- API : (a completer apres deploiement Railway)

## URL depot Git
https://github.com/TON_USERNAME/fidelilink2

## Identifiants de test
| Role       | Email                 | Mot de passe  |
|------------|-----------------------|---------------|
| Admin      | admin@fidelilink.fr   | Admin2025!    |
| Commercant | martin@boulangerie.fr | Merchant2025! |
| Client     | sophie@test.fr        | Client2025!   |

## Acces admin backoffice
URL : /app/admin
Email : admin@fidelilink.fr
Mot de passe : Admin2025!

## Base de donnees
Host : localhost | Port : 5432 | DB : fidelilink | User : charles

## Prerequis
Node.js >= 18, PostgreSQL >= 16, npm

## Installation backend
cd backend && npm install && cp .env.example .env && npm run start:dev

## Installation frontend
cd frontend && npm install && cp .env.example .env.local && npm run dev

## Seed donnees de test
cd backend && npm run seed

## Navigateurs testes
Chrome, Safari, Firefox
