import React, { useEffect, useMemo, useState } from 'react';
import { Bell, LogOut, Menu, X, Users, Store, Activity, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import ThemeToggle from '../ThemeToggle';
import { toast } from 'sonner@2.0.3';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '@/hooks/useAuth';
import { fetchAdminDashboard, type AdminDashboardResponse } from '@/lib/api';

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState<AdminDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const { token, user } = useAuth();

  useEffect(() => {
    if (!token) return;
    let active = true;
    setLoading(true);

    fetchAdminDashboard(token)
      .then((data) => {
        if (active) setDashboardData(data);
      })
      .catch((error) => {
        toast.error('Unable to load admin metrics', {
          description: error instanceof Error ? error.message : undefined
        });
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [token]);

  const handleApprove = (name: string) => {
    toast.success(`${name} approved (mock)`);
  };

  const handleReject = (name: string) => {
    toast.error(`${name} rejected (mock)`);
  };

  const populationEntries = dashboardData?.population.entries ?? [];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <h1 className="text-xl">Karya Desa - Admin</h1>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full" />
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10 text-primary">
                {user?.name?.slice(0, 2).toUpperCase() ?? 'AD'}
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
          <h2 className="text-3xl">Admin Dashboard</h2>
          <p className="text-muted-foreground">Monitor and manage your village community</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard label="Total Users" icon={<Users className="h-4 w-4" />} value={dashboardData?.stats.totalUsers} />
          <MetricCard label="Active MSMEs" icon={<Store className="h-4 w-4" />} value={dashboardData?.stats.activeMsmes} />
          <MetricCard label="Total Orders" icon={<Activity className="h-4 w-4" />} value={dashboardData?.stats.totalOrders} />
          <MetricCard label="Pending Requests" icon={<Bell className="h-4 w-4" />} value={dashboardData?.stats.pendingRequests} helper="Awaiting verification" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Growth Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {loading ? (
                <SkeletonMessage />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dashboardData?.growth ?? []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} allowDecimals={false} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                    <Line type="monotone" dataKey="users" stroke="hsl(var(--chart-1))" strokeWidth={2} name="Users" />
                    <Line type="monotone" dataKey="msmes" stroke="hsl(var(--chart-2))" strokeWidth={2} name="MSMEs" />
                    <Line type="monotone" dataKey="orders" stroke="hsl(var(--chart-3))" strokeWidth={2} name="Orders" />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Verification Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Business Name</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-sm text-muted-foreground">
                        Loading requests...
                      </TableCell>
                    </TableRow>
                  ) : dashboardData?.verificationRequests.length ? (
                    dashboardData.verificationRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>{request.name}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{request.owner}</Badge>
                        </TableCell>
                        <TableCell>{request.category}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {new Date(request.submittedAt).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="default" className="gap-1" onClick={() => handleApprove(request.name)}>
                              <CheckCircle className="h-3 w-3" />
                              Approve
                            </Button>
                            <Button size="sm" variant="destructive" className="gap-1" onClick={() => handleReject(request.name)}>
                              <XCircle className="h-3 w-3" />
                              Reject
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-sm text-muted-foreground">
                        No pending requests.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Village Data Management</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="population" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="population">Population</TabsTrigger>
                <TabsTrigger value="msmes">MSMEs</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
              </TabsList>

              <TabsContent value="population" className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  {populationEntries.map((item) => (
                    <div key={item.category} className="p-4 rounded-lg border border-border hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">{item.category}</p>
                          <p className="text-2xl">{item.value}</p>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {item.change}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="msmes" className="space-y-4">
                <div className="space-y-3">
                  {dashboardData?.msmeCategories.length ? (
                    dashboardData.msmeCategories.map((item) => (
                      <div key={item.category} className="flex items-center justify-between p-4 rounded-lg border border-border hover:shadow-md transition-shadow">
                        <p className="text-sm">{item.category}</p>
                        <Badge>{item.count} businesses</Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No MSME categories yet.</p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="events" className="space-y-4">
                <div className="text-center py-12 text-muted-foreground">
                  <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Manage upcoming events from the community module.</p>
                  <Button variant="outline" className="mt-4">
                    Create Event
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="reports" className="space-y-4">
                <div className="text-center py-12 text-muted-foreground">
                  <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Generate custom reports from transactions and MSME performance.</p>
                  <Button variant="outline" className="mt-4">
                    Generate Report
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

function MetricCard({ label, icon, value, helper }: { label: string; icon: React.ReactNode; value?: number; helper?: string }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-muted-foreground">{label}</div>
          {icon}
        </div>
        <div className="text-2xl mb-1">{value ?? '—'}</div>
        {helper ? <div className="text-xs text-muted-foreground">{helper}</div> : null}
      </CardContent>
    </Card>
  );
}

function SkeletonMessage() {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin" />
      Loading chart...
    </div>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );
}
