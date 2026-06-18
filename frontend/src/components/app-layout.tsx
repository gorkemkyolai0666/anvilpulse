'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FolderKanban,
  Package,
  MapPin,
  Flame,
  Paintbrush,
  Factory,
  LogOut,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/dashboard', label: 'Panel', icon: LayoutDashboard },
  { href: '/projects', label: 'Projeler', icon: FolderKanban },
  { href: '/materials', label: 'Malzeme', icon: Package },
  { href: '/site-visits', label: 'Saha', icon: MapPin },
  { href: '/welding', label: 'Kaynak', icon: Flame },
  { href: '/surface-finishes', label: 'Kaplama', icon: Paintbrush },
  { href: '/workshop', label: 'Atölye', icon: Factory },
];

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const { workshop, user, logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="flex w-20 flex-col items-center border-r border-border bg-secondary py-6 text-secondary-foreground lg:w-24">
        <Link href="/dashboard" className="mb-8 font-display text-2xl leading-none text-primary">
          AP
        </Link>
        <nav className="flex flex-1 flex-col gap-2" aria-label="Ana menü">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                data-active={active}
                className="ap-nav-rail-link"
                aria-current={active ? 'page' : undefined}
                title={item.label}
              >
                <Icon className="h-5 w-5" aria-hidden />
                <span className="hidden lg:block">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className="mt-4 text-secondary-foreground/70 hover:bg-secondary-foreground/10 hover:text-secondary-foreground"
          aria-label="Çıkış yap"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border bg-card px-6 py-4">
          <div>
            <h1 className="font-display text-2xl tracking-wide text-foreground">
              Anvil<span className="text-primary">Pulse</span>
            </h1>
            <p className="text-sm text-muted-foreground">{workshop?.name}</p>
          </div>
          {user && (
            <p className="text-sm text-muted-foreground">
              {user.firstName} {user.lastName}
            </p>
          )}
        </header>
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
