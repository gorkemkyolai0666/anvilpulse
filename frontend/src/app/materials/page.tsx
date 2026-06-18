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
import { formatMaterialStockStatus, formatWeightKg } from '@/lib/utils';

interface MaterialStockItem {
  id: string;
  lotName: string;
  materialGrade?: string;
  quantityKg: number;
  materialUnit?: string;
  status: string;
}

export default function MaterialStockPage() {
  const { token } = useAuth();
  const [items, setItems] = useState<MaterialStockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ lotName: '', materialGrade: '', quantityKg: '' });
  const [saving, setSaving] = useState(false);

  const load = () => {
    if (!token) return;
    setLoading(true);
    api.materials
      .list(token)
      .then((data) => setItems((data as { data: MaterialStockItem[] }).data))
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
      await api.materials.create(token, {
        ...form,
        quantityKg: parseFloat(form.quantityKg),
      });
      setForm({ lotName: '', materialGrade: '', quantityKg: '' });
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
            <h1 className="font-display text-3xl font-bold uppercase">Kağıt Stok</h1>
            <p className="text-muted-foreground">Kağıt ve malzeme envanter takibi</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="font-display uppercase">
            <Plus className="mr-2 h-4 w-4" />
            Stok Ekle
          </Button>
        </div>

        {showForm && (
          <Card className="ap-card shadow-none">
            <CardHeader>
              <CardTitle className="font-display uppercase">Stok Ekle</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="lotName">Parti Adı</Label>
                  <Input id="lotName" value={form.lotName} onChange={(e) => setForm({ ...form, lotName: e.target.value })} required />
                </div>
                <div>
                  <Label htmlFor="materialGrade">Marka</Label>
                  <Input id="materialGrade" value={form.materialGrade} onChange={(e) => setForm({ ...form, materialGrade: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="quantityKg">Ağırlık (kg)</Label>
                  <Input id="quantityKg" type="number" step="0.1" value={form.quantityKg} onChange={(e) => setForm({ ...form, quantityKg: e.target.value })} required />
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
        {!loading && !error && items.length === 0 && (
          <EmptyState title="Stok bulunamadı" description="İlk kağıt stok kaydınızı ekleyin." />
        )}
        {!loading && !error && items.length > 0 && (
          <Card className="ap-card shadow-none">
            <CardContent className="pt-6">
              <table className="pp-table">
                <thead>
                  <tr>
                    <th>Parti</th>
                    <th>Marka</th>
                    <th>Ağırlık</th>
                    <th>Depo</th>
                    <th>Durum</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td className="font-medium">{item.lotName}</td>
                      <td>{item.materialGrade || '—'}</td>
                      <td>{formatWeightKg(item.quantityKg)}</td>
                      <td className="text-muted-foreground">{item.materialUnit || 'pallet'}</td>
                      <td><Badge variant="secondary">{formatMaterialStockStatus(item.status)}</Badge></td>
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
