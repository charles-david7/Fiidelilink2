# FidéliLink — Plateforme SaaS de Fidélisation Mutualisée

## Stack
- **Backend** : NestJS + TypeORM + PostgreSQL + Redis
- **Frontend** : React + TypeScript + Vite + Material UI
- **Auth** : JWT (access 15min + refresh 7j)
- **Deploy** : Backend → Railway / Render | Frontend → Vercel

## Démarrage rapide

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Remplir les variables dans .env
npm run start:dev
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

### Seed (données de test)
```bash
cd backend
npm run seed
```

## Comptes de test
- Admin : `admin@fidelilink.fr` / `Admin2025!`
- Commerçant : `martin@boulangerie.fr` / `Merchant2025!`
- Client : `sophie@test.fr` / `Client2025!`

## Déploiement

### Frontend (Vercel)
1. Importer le repo sur Vercel
2. Root directory : `frontend`
3. Variables d'env : `VITE_API_URL=https://votre-api.railway.app/api`

### Backend (Railway)
1. Nouveau projet Railway depuis le repo
2. Root directory : `backend`
3. Variables d'env : voir `.env.example`