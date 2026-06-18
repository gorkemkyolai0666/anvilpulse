import Link from 'next/link';
import { Hammer, Package, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: Hammer,
    title: 'Proje Takibi',
    description: 'Ferforje ve metal işleri projelerini istasyon ataması ve teslim tarihiyle yönetin.',
  },
  {
    icon: Package,
    title: 'Malzeme Stok',
    description: 'Profil, sac ve boru stoklarını parti bazında takip edin, düşük stok uyarıları alın.',
  },
  {
    icon: MapPin,
    title: 'Saha Ölçümü',
    description: 'Montaj öncesi saha ziyaretlerini ve ölçü revizyonlarını dijitalleştirin.',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="ap-hero-gradient text-cream">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <span className="font-display text-2xl tracking-wide">
            Anvil<span className="text-primary">Pulse</span>
          </span>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild className="text-cream hover:bg-cream/10">
              <Link href="/login">Giriş</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Ücretsiz Başla</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="ap-hero-gradient text-cream">
          <div className="mx-auto max-w-6xl px-6 py-24">
            <div className="max-w-2xl">
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
                Ferforje & Metal İşleme SaaS
              </p>
              <h1 className="font-display text-5xl leading-tight md:text-6xl">
                Demir atölyenizi dijitalleştirin
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-cream/80">
                Proje takibi, malzeme stok, kaynak istasyonu planlaması ve saha ölçümlerini
                Excel ve kağıt defterinden kurtarın. Türkiye&apos;deki KOBİ demir atölyeleri için tasarlandı.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button size="lg" asChild>
                  <Link href="/register">
                    14 Gün Ücretsiz Dene
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="border-cream/30 text-cream hover:bg-cream/10">
                  <Link href="/login">Demo Giriş</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="font-display text-3xl tracking-wide">Özellikler</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="ap-card">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-xl tracking-wide">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="border-t border-border bg-muted/30">
          <div className="mx-auto max-w-6xl px-6 py-12 text-center">
            <h2 className="font-display text-3xl tracking-wide">Atölyenizi kontrol altına alın</h2>
            <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
              AnvilPulse ile projelerinizi, malzeme stokunuzu ve saha süreçlerinizi kolayca yönetin.
            </p>
            <Button className="mt-6" size="lg" asChild>
              <Link href="/register">Hemen Başlayın</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} AnvilPulse — Ferforje & Metal İşleme Operasyon Platformu
      </footer>
    </div>
  );
}
