'use client';

import { useEffect, useState } from 'react';
import { AuthenticatedLayout } from '@/components/authenticated-layout';
import { LoadingSpinner, ErrorState, EmptyState } from '@/components/states';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { formatCurrency, formatSurfaceStatus } from '@/lib/utils';

interface Finish {
  id: string;
  title: string;
  surfaceCategory: string;
  pricePerSqm: number;
  leadDays?: number;
  status: string;
}

export default function FinishesPage() {
  const { token } = useAuth();
  const [finishes, setFinishes] = useState<Finish[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = () => {
    if (!token) return;
    setLoading(true);
    api.surfaceFinishes
      .list(token)
      .then((data) => setFinishes((data as { data: Finish[] }).data))
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
          <h1 className="font-display text-3xl font-bold uppercase">Bitirme İşlemleri</h1>
          <p className="text-muted-foreground">Laminasyon, ciltleme ve kaplama hizmetleri</p>
        </div>

        {loading && <LoadingSpinner />}
        {error && <ErrorState onRetry={load} />}
        {!loading && !error && finishes.length === 0 && (
          <EmptyState title="Bitirme hizmeti yok" description="Bitirme işlemi tanımlayın." />
        )}
        {!loading && !error && finishes.length > 0 && (
          <Card className="ap-card shadow-none">
            <CardContent className="pt-6">
              <table className="pp-table">
                <thead>
                  <tr>
                    <th>Hizmet</th>
                    <th>Kategori</th>
                    <th>Birim Fiyat</th>
                    <th>Kurulum (dk)</th>
                    <th>Durum</th>
                  </tr>
                </thead>
                <tbody>
                  {finishes.map((finish) => (
                    <tr key={finish.id}>
                      <td className="font-medium">{finish.title}</td>
                      <td className="text-muted-foreground">{finish.surfaceCategory}</td>
                      <td>{formatCurrency(finish.pricePerSqm)}</td>
                      <td>{finish.leadDays ?? '—'}</td>
                      <td><Badge variant="secondary">{formatSurfaceStatus(finish.status)}</Badge></td>
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
