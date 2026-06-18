'use client';

import { useEffect, useState } from 'react';
import { AuthenticatedLayout } from '@/components/authenticated-layout';
import { LoadingSpinner, ErrorState } from '@/components/states';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';

interface WorkshopProfile {
  name: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  totalStations: number;
  timezone: string;
}

export default function PrintshopPage() {
  const { token } = useAuth();
  const [workshop, setPrintshop] = useState<WorkshopProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const load = () => {
    if (!token) return;
    setLoading(true);
    api.workshop
      .get(token)
      .then((data) => setPrintshop(data as WorkshopProfile))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [token]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !workshop) return;
    setSaving(true);
    setSuccess(false);
    try {
      await api.workshop.update(token, workshop as unknown as Record<string, unknown>);
      setSuccess(true);
    } catch {
      setError(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AuthenticatedLayout>
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold uppercase">Atölye Profili</h1>
          <p className="text-muted-foreground">Baskı atölyesi bilgileri ve makine kapasitesi</p>
        </div>

        {loading && <LoadingSpinner />}
        {error && <ErrorState onRetry={load} />}
        {workshop && !loading && (
          <Card className="ap-card shadow-none">
            <CardHeader>
              <CardTitle className="font-display uppercase">Atölye Bilgileri</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-4">
                {success && (
                  <div className="border-2 border-success bg-success/10 p-3 text-sm text-success">Ayarlar kaydedildi.</div>
                )}
                <div className="space-y-2">
                  <Label>Atölye Adı</Label>
                  <Input value={workshop.name} onChange={(e) => setPrintshop({ ...workshop, name: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Telefon</Label>
                  <Input value={workshop.phone || ''} onChange={(e) => setPrintshop({ ...workshop, phone: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Adres</Label>
                  <Input value={workshop.address || ''} onChange={(e) => setPrintshop({ ...workshop, address: e.target.value })} />
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Şehir</Label>
                    <Input value={workshop.city || ''} onChange={(e) => setPrintshop({ ...workshop, city: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Bölge</Label>
                    <Input value={workshop.state || ''} onChange={(e) => setPrintshop({ ...workshop, state: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Posta Kodu</Label>
                    <Input value={workshop.zipCode || ''} onChange={(e) => setPrintshop({ ...workshop, zipCode: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Toplam Makine Kapasitesi</Label>
                  <Input
                    type="number"
                    value={workshop.totalStations}
                    onChange={(e) => setPrintshop({ ...workshop, totalStations: parseInt(e.target.value, 10) })}
                  />
                </div>
                <Button type="submit" disabled={saving} className="font-display uppercase">
                  {saving ? 'Kaydediliyor...' : 'Kaydet'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
