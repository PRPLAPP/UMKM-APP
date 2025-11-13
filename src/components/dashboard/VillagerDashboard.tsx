import React, { useState } from 'react';
import { Bell, MessageCircle, LogOut, Menu, X, MapPin, Calendar, Store, TrendingUp } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import ThemeToggle from '../ThemeToggle';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface VillagerDashboardProps {
  onLogout: () => void;
}

const newsItems = [
  { id: 1, title: 'Village Festival Next Week', date: '2 hours ago', type: 'event' },
  { id: 2, title: 'New MSME Added: Fresh Produce', date: '1 day ago', type: 'business' },
  { id: 3, title: 'Community Meeting on Saturday', date: '2 days ago', type: 'announcement' },
];

const nearbyMSMEs = [
  { id: 1, name: 'Warung Sari', category: 'Food & Beverage', distance: '0.5 km', rating: 4.8 },
  { id: 2, name: 'Toko Sejahtera', category: 'Grocery', distance: '1.2 km', rating: 4.5 },
  { id: 3, name: 'Kerajinan Desa', category: 'Handicrafts', distance: '0.8 km', rating: 4.9 },
];

const tourismSpots = [
  { id: 1, name: 'Air Terjun Indah', image: 'https://images.unsplash.com/photo-1760292424045-6c3669699efd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWxsYWdlJTIwY29tbXVuaXR5JTIwZGlnaXRhbHxlbnwxfHx8fDE3NjMwMjMxNzR8MA&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 2, name: 'Sawah Terrace', image: 'https://images.unsplash.com/photo-1737913785137-c2a957ae7565?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJrZXRwbGFjZSUyMGxvY2FsJTIwYnVzaW5lc3N8ZW58MXx8fHwxNzYzMDIzMTc1fDA&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 3, name: 'Kampung Tradisi', image: 'https://images.unsplash.com/photo-1576267423048-15c0040fec78?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwY29sbGFib3JhdGlvbiUyMGhhcHB5fGVufDF8fHx8MTc2Mjk4OTA3Nnww&ixlib=rb-4.1.0&q=80&w=1080' },
];

export default function VillagerDashboard({ onLogout }: VillagerDashboardProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full" />
            </Button>
            <Button variant="ghost" size="icon">
              <MessageCircle className="h-5 w-5" />
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10 text-primary">JD</AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="icon" onClick={onLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h2 className="text-3xl">Hello, John 👋</h2>
          <p className="text-muted-foreground">Welcome back to your village community</p>
        </div>

        {/* Quick Access Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Upcoming Events</div>
                <div className="text-2xl">5</div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                <Store className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Local Businesses</div>
                <div className="text-2xl">28</div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <MapPin className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Tourism Spots</div>
                <div className="text-2xl">12</div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Active Members</div>
                <div className="text-2xl">342</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - News & Events */}
          <div className="lg:col-span-2 space-y-6">
            {/* Local News */}
            <Card>
              <CardHeader>
                <CardTitle>Local News & Updates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {newsItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="truncate">{item.title}</p>
                        <Badge variant="secondary" className="flex-shrink-0 text-xs">
                          {item.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.date}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Tourism Spots */}
            <Card>
              <CardHeader>
                <CardTitle>Discover Tourism Spots</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-3 gap-4">
                  {tourismSpots.map((spot) => (
                    <div key={spot.id} className="group cursor-pointer">
                      <div className="aspect-video rounded-lg overflow-hidden mb-2">
                        <ImageWithFallback
                          src={spot.image}
                          alt={spot.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <p className="text-sm">{spot.name}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Nearby MSMEs */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Nearby MSMEs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {nearbyMSMEs.map((msme) => (
                  <div
                    key={msme.id}
                    className="p-4 rounded-lg border border-border hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-sm mb-1">{msme.name}</p>
                        <p className="text-xs text-muted-foreground">{msme.category}</p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        ⭐ {msme.rating}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {msme.distance}
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  View All Businesses
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
