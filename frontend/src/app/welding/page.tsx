'use client';

import { useEffect, useState } from 'react';
import { AuthenticatedLayout } from '@/components/authenticated-layout';
import { LoadingSpinner, ErrorState, EmptyState } from '@/components/states';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { formatDateTime, formatWeldingStatus } from '@/lib/utils';

interface MaintenanceItem {
  id: string;
  title: string;
  category: string;
  stationName?: string;
  scheduledAt: string;
  status: string;
}

export default function MaintenancePage() {
  const { token } = useAuth();
  const [items, setItems] = useState<MaintenanceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = () => {
    if (!token) return;
    setLoading(true);
    api.welding
      .list(token)
      .then((data) => setItems((data as { data: MaintenanceItem[] }).data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [token]);

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold uppercase">Makine Bakımı</h1>
          <p className="text-muted-foreground">Kalibrasyon, temizlik ve bakım planları</p>
        </div>

        {loading && <LoadingSpinner />}
        {error && <ErrorState onRetry={load} />}
        {!loading && !error && items.length === 0 && (
          <EmptyState title="Bakım kaydı yok" description="Makine bakım planı ekleyin." />
        )}
        {!loading && !error && items.length > 0 && (
          <Card className="ap-card shadow-none">
            <CardContent className="pt-6">
              <table className="pp-table">
                <thead>
                  <tr>
                    <th>Başlık</th>
                    <th>Kategori</th>
                    <th>Makine</th>
                    <th>Planlanan</th>
                    <th>Durum</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td className="font-medium">{item.title}</td>
                      <td className="text-muted-foreground">{item.category}</td>
                      <td>{item.stationName || '—'}</td>
                      <td>{formatDateTime(item.scheduledAt)}</td>
                      <td><Badge variant="secondary">{formatWeldingStatus(item.status)}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
