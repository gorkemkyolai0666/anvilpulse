'use client';

import { useEffect, useState } from 'react';
import { AuthenticatedLayout } from '@/components/authenticated-layout';
import { LoadingSpinner, ErrorState, EmptyState } from '@/components/states';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { formatDate, formatProofStatus, formatMeasurementQuality } from '@/lib/utils';

interface Proof {
  id: string;
  visitedAt: string;
  status: string;
  measurementQuality: string;
  revisionNotes?: number;
  job?: { projectNumber: string; clientName: string };
}

export default function ProofsPage() {
  const { token } = useAuth();
  const [proofs, setProofs] = useState<Proof[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = () => {
    if (!token) return;
    setLoading(true);
    api.siteVisits
      .list(token)
      .then((data) => setProofs((data as { data: Proof[] }).data))
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
          <h1 className="font-display text-3xl font-bold uppercase">Provalar</h1>
          <p className="text-muted-foreground">Müşteri prova onayları ve revizyon takibi</p>
        </div>

        {loading && <LoadingSpinner />}
        {error && <ErrorState onRetry={load} />}
        {!loading && !error && proofs.length === 0 && (
          <EmptyState title="Prova bulunamadı" description="Henüz prova kaydı yok." />
        )}
        {!loading && !error && proofs.length > 0 && (
          <Card className="ap-card shadow-none">
            <CardContent className="pt-6">
              <table className="pp-table">
                <thead>
                  <tr>
                    <th>İş</th>
                    <th>Müşteri</th>
                    <th>Tarih</th>
                    <th>Kalite</th>
                    <th>Revizyon</th>
                    <th>Durum</th>
                  </tr>
                </thead>
                <tbody>
                  {proofs.map((proof) => (
                    <tr key={proof.id}>
                      <td className="font-medium">{proof.job?.projectNumber}</td>
                      <td>{proof.job?.clientName}</td>
                      <td>{formatDate(proof.visitedAt)}</td>
                      <td>{formatMeasurementQuality(proof.measurementQuality)}</td>
                      <td>{proof.revisionNotes ?? 0}</td>
                      <td><Badge variant="secondary">{formatProofStatus(proof.status)}</Badge></td>
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
