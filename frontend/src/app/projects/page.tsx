'use client';

import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { AuthenticatedLayout } from '@/components/authenticated-layout';
import { LoadingSpinner, ErrorState, EmptyState } from '@/components/states';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { formatJobStatus, formatPrintType } from '@/lib/utils';

interface Job {
  id: string;
  projectNumber: string;
  clientName: string;
  status: string;
  projectType?: string;
  quantity?: number;
  stationName?: string;
}

export default function JobsPage() {
  const { token } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ projectNumber: '', clientName: '', quantity: '', stationName: '' });
  const [saving, setSaving] = useState(false);

  const load = () => {
    if (!token) return;
    setLoading(true);
    setError(false);
    api.projects
      .list(token)
      .then((data) => setJobs((data as { data: Job[] }).data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [token]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    try {
      await api.projects.create(token, {
        ...form,
        quantity: form.quantity ? parseInt(form.quantity, 10) : undefined,
        projectType: 'railing',
      });
      setForm({ projectNumber: '', clientName: '', quantity: '', stationName: '' });
      setShowForm(false);
      load();
    } catch {
      setError(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl tracking-wide">Metal Projeler</h1>
            <p className="text-muted-foreground">Müşteri projeleri, istasyon ataması ve durum takibi</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="font-display uppercase">
            <Plus className="mr-2 h-4 w-4" />
            Yeni İş
          </Button>
        </div>

        {showForm && (
          <Card className="ap-card shadow-none">
            <CardHeader>
              <CardTitle className="font-display uppercase">İş Ekle</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="projectNumber">İş No</Label>
                  <Input id="projectNumber" value={form.projectNumber} onChange={(e) => setForm({ ...form, projectNumber: e.target.value })} required />
                </div>
                <div>
                  <Label htmlFor="clientName">Müşteri</Label>
                  <Input id="clientName" value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} required />
                </div>
                <div>
                  <Label htmlFor="quantity">Adet</Label>
                  <Input id="quantity" type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="stationName">Makine</Label>
                  <Input id="stationName" value={form.stationName} onChange={(e) => setForm({ ...form, stationName: e.target.value })} />
                </div>
                <div className="sm:col-span-2">
                  <Button type="submit" disabled={saving}>{saving ? 'Kaydediliyor...' : 'Kaydet'}</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {loading && <LoadingSpinner />}
        {error && <ErrorState onRetry={load} />}
        {!loading && !error && jobs.length === 0 && (
          <EmptyState title="İş bulunamadı" description="İlk baskı işinizi ekleyerek başlayın." />
        )}
        {!loading && !error && jobs.length > 0 && (
          <Card className="ap-card shadow-none">
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <table className="pp-table">
                  <thead>
                    <tr>
                      <th>İş No</th>
                      <th>Müşteri</th>
                      <th>Tip</th>
                      <th>Adet</th>
                      <th>Makine</th>
                      <th>Durum</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map((job) => (
                      <tr key={job.id}>
                        <td className="font-medium">{job.projectNumber}</td>
                        <td>{job.clientName}</td>
                        <td className="text-muted-foreground">{formatPrintType(job.projectType || 'digital')}</td>
                        <td>{job.quantity ?? '—'}</td>
                        <td>{job.stationName || '—'}</td>
                        <td><Badge variant="secondary">{formatJobStatus(job.status)}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
