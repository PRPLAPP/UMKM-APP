import React, { useEffect, useMemo, useState } from 'react';
import { MessageCircle, LogOut, Menu, X, MapPin, Calendar, Store, TrendingUp, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import ThemeToggle from '../ThemeToggle';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useAuth } from '@/hooks/useAuth';
import { fetchCommunityHome, type CommunityHomeResponse } from '@/lib/api';
import { toast } from 'sonner';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { NotificationMenu } from '../notifications/NotificationMenu';

interface VillagerDashboardProps {
  onLogout: () => void;
}

export default function VillagerDashboard({ onLogout }: VillagerDashboardProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [data, setData] = useState<CommunityHomeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDirectoryOpen, setIsDirectoryOpen] = useState(false);
  const [directorySearch, setDirectorySearch] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    let active = true;
    setLoading(true);

    fetchCommunityHome()
      .then((payload) => {
        if (active) setData(payload);
      })
      .catch((error) => {
        toast.error('Unable to load community feed', {
          description: error instanceof Error ? error.message : undefined
        });
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const stats = data?.stats;
  const filteredMsmes = useMemo(() => {
    if (!data?.msmes) return [];
    const query = directorySearch.trim().toLowerCase();
    if (!query) return data.msmes;
    return data.msmes.filter(
      (msme) =>
        msme.name.toLowerCase().includes(query) ||
        msme.category.toLowerCase().includes(query) ||
        msme.location.toLowerCase().includes(query)
    );
  }, [data?.msmes, directorySearch]);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <h1 className="text-xl">Karya Desa</h1>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <NotificationMenu />
            <Button variant="ghost" size="icon" onClick={() => toast.info('Messaging coming soon')}>
              <MessageCircle className="h-5 w-5" />
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10 text-primary">
                {user?.name?.slice(0, 2).toUpperCase() ?? 'KD'}
              </AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="icon" onClick={onLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        <div className="space-y-2">
          <h2 className="text-3xl">Hello, {user?.name ?? 'Neighbor'} 👋</h2>
          <p className="text-muted-foreground">Welcome back to your village community</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Upcoming Events" icon={<Calendar className="h-6 w-6 text-blue-600" />} value={stats?.eventsCount} color="blue" />
          <StatCard label="Local Businesses" icon={<Store className="h-6 w-6 text-blue-600" />} value={stats?.businessesCount} color="blue" />
          <StatCard label="Tourism Spots" icon={<MapPin className="h-6 w-6 text-amber-600" />} value={stats?.tourismSpotsCount} color="amber" />
          <StatCard label="Active Members" icon={<TrendingUp className="h-6 w-6 text-purple-600" />} value={stats?.activeMembers} color="purple" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Local News & Updates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {loading ? (
                  <LoadingMessage message="Loading news..." />
                ) : data?.news.length ? (
                  data.news.map((item) => (
                    <div key={item.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="truncate">{item.title}</p>
                          <Badge variant="secondary" className="flex-shrink-0 text-xs capitalize">
                            {item.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.summary}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(item.publishedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No updates yet.</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Discover Tourism Spots</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <LoadingMessage message="Loading destinations..." />
                ) : (
                  <div className="grid sm:grid-cols-3 gap-4">
                    {data?.tourismSpots.map((spot) => (
                      <div key={spot.id} className="group cursor-pointer">
                        <div className="aspect-video rounded-lg overflow-hidden mb-2">
                          <ImageWithFallback
                            src={spot.imageUrl}
                            alt={spot.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <p className="text-sm font-medium">{spot.name}</p>
                        <p className="text-xs text-muted-foreground">{spot.location}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Nearby MSMEs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {loading ? (
                  <LoadingMessage message="Loading MSMEs..." />
                ) : data?.msmes.length ? (
                  data.msmes.map((msme) => (
                    <div key={msme.id} className="p-4 rounded-lg border border-border hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-sm mb-1">{msme.name}</p>
                          <p className="text-xs text-muted-foreground">{msme.category}</p>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          ⭐ {msme.rating.toFixed(1)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {msme.distanceKm.toFixed(1)} km • {msme.location}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No MSMEs nearby yet.</p>
                )}
                <Button variant="outline" className="w-full" onClick={() => setIsDirectoryOpen(true)}>
                  View All Businesses
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      {isDirectoryOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4" role="dialog" aria-modal>
          <div className="w-full max-w-3xl bg-background rounded-xl shadow-2xl max-h-[90vh] overflow-hidden">
            <div className="border-b border-border px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Business Directory</h3>
                <p className="text-sm text-muted-foreground">Browse all verified MSMEs in your community.</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsDirectoryOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1 space-y-1">
                  <Label htmlFor="directory-search">Search</Label>
                  <Input
                    id="directory-search"
                    placeholder="Search by name, category, or location"
                    value={directorySearch}
                    onChange={(e) => setDirectorySearch(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
                {loading ? (
                  <LoadingMessage message="Loading businesses..." />
                ) : filteredMsmes.length ? (
                  filteredMsmes.map((msme) => (
                    <div key={msme.id} className="flex items-center justify-between p-4 rounded-lg border border-border">
                      <div>
                        <p className="font-medium">{msme.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">{msme.category}</p>
                        <p className="text-xs text-muted-foreground">
                          {msme.distanceKm.toFixed(1)} km • {msme.location}
                        </p>
                      </div>
                      <Badge variant="secondary">⭐ {msme.rating.toFixed(1)}</Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No businesses match your search.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, icon, value, color }: { label: string; icon: React.ReactNode; value?: number; color: 'blue' | 'green' | 'amber' | 'purple' }) {
  const colorMap = {
    blue: 'bg-blue-500/10',
    green: 'bg-blue-500/10',
    amber: 'bg-amber-500/10',
    purple: 'bg-purple-500/10'
  };

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-6 flex items-center gap-4">
        <div className={`h-12 w-12 rounded-xl ${colorMap[color]} flex items-center justify-center`}>{icon}</div>
        <div>
          <div className="text-sm text-muted-foreground">{label}</div>
          <div className="text-2xl">{value ?? '—'}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function LoadingMessage({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin" />
      {message}
    </div>
  );
}
