# AnvilPulse QA Report

**Tarih:** 2026-06-18  
**Durum:** PASS (yerel build)

## Unit Tests

```
DashboardService — 1/1 passed
```

## Build Validation

| Paket | Komut | Sonuç |
|-------|-------|-------|
| Backend | npm ci && npm run build && npm test | ✅ PASS |
| Frontend | npm ci && NEXT_PUBLIC_API_URL=... npm run build | ✅ PASS |

## Integration Tests

PostgreSQL yerel ortamda mevcut değil — integration.sh hazır, CI'da çalıştırılacak (14 test).

## Manual Checklist

- [x] Sol ikon rayı navigasyon
- [x] Premium Industrial renkler (forge orange / slate)
- [x] Bebas Neue + Inter fontları
- [x] Türkçe UI metinleri
- [x] Demo credentials seed'de tanımlı
- [x] Tüm route'lar erişilebilir

## Bilinen Sınırlamalar

- Production deploy doğrulanmadı (org secrets CI'da)
- E2E browser testleri henüz yok
