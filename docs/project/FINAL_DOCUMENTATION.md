# AnvilPulse — Final Documentation

## Özet

AnvilPulse, ferforje ve metal işleme atölyeleri için operasyon SaaS platformudur. NestJS + Prisma + PostgreSQL backend ve Next.js + Tailwind frontend ile geliştirilmiştir.

## Demo

- URL: CI sağlama sonrası güncellenecek
- E-posta: demo@istanbuldemiratolyesi.com
- Şifre: demo123456

## Artefakt Konumu

`project-artifacts/anvilpulse/`

## Kuyruk

`projects/project-queue/anvilpulse.json`

## Modüller

| Modül | Endpoint | Açıklama |
|-------|----------|----------|
| Projects | /api/projects | Metal imalat projeleri |
| Materials | /api/materials | Malzeme stok |
| Site Visits | /api/site-visits | Saha ölçüm ziyaretleri |
| Welding | /api/welding | Kaynak görevleri |
| Surface Finishes | /api/surface-finishes | Kaplama kataloğu |
| Workshop | /api/workshop | Atölye profili |
| Dashboard | /api/dashboard/stats | Özet istatistikler |

## Tasarım

Premium Industrial — sol ikon rayı, forge orange + slate palet

## Teslimat

Fabrika PR merge → GitHub Actions provision-new-project workflow
