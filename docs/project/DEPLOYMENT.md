# AnvilPulse Deployment

## Demo Hesabı

- **E-posta:** demo@istanbuldemiratolyesi.com
- **Şifre:** demo123456

## Ortam Değişkenleri

### Backend (`backend/.env.example`)

- `DATABASE_URL` — PostgreSQL bağlantı dizesi
- `JWT_SECRET` — JWT imzalama anahtarı
- `FRONTEND_URL` — Virgülle ayrılmış frontend origin listesi
- `PORT` — API portu (varsayılan 4022)

### Frontend (`frontend/.env.example`)

- `NEXT_PUBLIC_API_URL` — Backend API kök URL'si

## Sağlama

```bash
npm run provision
```

GitHub Actions `provision-new-project.yml` workflow'u `projects/project-queue/anvilpulse.json` eklendiğinde tetiklenir.

## Beklenen Org Secrets

- `GH_PAT`
- `RAILWAY_API_TOKEN`
- `VERCEL_TOKEN`

## Smoke Testler

1. `GET /api/health` → 200
2. Demo login → 200 + token
3. `GET /api/dashboard/stats` → 200
4. CRUD `/api/projects` → 201/200/200

## Portlar

- Backend: 4022
- Frontend: 3022

## Durum

MVP hazır — CI sağlama bekleniyor (cloud agent org repo oluşturamaz).
