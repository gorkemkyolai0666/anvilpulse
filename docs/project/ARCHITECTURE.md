# AnvilPulse Architecture

## Genel Bakış

```
┌─────────────┐     HTTPS/CORS      ┌──────────────────┐
│  Next.js    │ ◄──────────────────►│  NestJS API      │
│  :3022      │   JWT Bearer         │  :4022           │
└─────────────┘                      └────────┬─────────┘
                                              │
                                     ┌────────▼─────────┐
                                     │  PostgreSQL 16   │
                                     └──────────────────┘
```

## Backend Modülleri

| Modül | Route | Açıklama |
|-------|-------|----------|
| HealthModule | GET /api/health | DB bağlantı kontrolü |
| AuthModule | /api/auth/* | JWT register/login/me |
| PrintshopModule | /api/printshop | Tenant profil |
| ProjectsModule | /api/jobs | FabricationProject CRUD |
| MaterialsModule | /api/paper-stock | Kağıt stok CRUD |
| SiteVisitsModule | /api/proofs | SiteVisit CRUD |
| WeldingModule | /api/maintenance | Bakım CRUD |
| SurfaceFinishesModule | /api/finishes | Bitirme CRUD |
| DashboardModule | /api/dashboard/stats | Aggregated stats |

## Multi-Tenancy

Her kayıt `workshopId` ile tenant'a bağlı. JWT payload `{ sub, email, workshopId }`.

## Frontend Yapısı

- App Router (Next.js 14)
- `AuthenticatedLayout` — split-panel + stats rail
- `api.ts` — typed fetch wrapper
- shadcn/ui primitives (Button, Input, Card, Badge)

## Domain Mapping (HivePulse → AnvilPulse)

| HivePulse | AnvilPulse |
|-----------|------------|
| Apiary | Workshop |
| Hive | FabricationProject |
| Harvest | MaterialStock |
| Inspection | SiteVisit |
| Treatment | WeldingTask |
| HoneyVariety | SurfaceFinish |
