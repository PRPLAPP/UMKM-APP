import React, { useEffect, useState } from 'react';
import { Bell, LogOut, Menu, X, Users, Store, Activity, CheckCircle, XCircle, Loader2, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import ThemeToggle from '../ThemeToggle';
import { toast } from 'sonner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '@/hooks/useAuth';
import { NotificationMenu } from '../notifications/NotificationMenu';
import {
  createNews,
  createTourismSpot,
  deleteNews,
  deleteTourismSpot,
  fetchAdminDashboard,
  fetchCommunityHome,
  updateMsmeStatus,
  type AdminDashboardResponse,
  type CommunityHomeResponse
} from '@/lib/api';

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState<AdminDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [communityData, setCommunityData] = useState<CommunityHomeResponse | null>(null);
  const [communityLoading, setCommunityLoading] = useState(true);
  const [isNewsDialogOpen, setIsNewsDialogOpen] = useState(false);
  const [isTourismDialogOpen, setIsTourismDialogOpen] = useState(false);
  const [newsForm, setNewsForm] = useState({
    title: '',
    summary: '',
    type: 'event' as 'event' | 'business' | 'announcement',
    publishedAt: ''
  });
  const [tourismForm, setTourismForm] = useState({
    name: '',
    description: '',
    imageUrl: '',
    location: ''
  });
  const [isSubmittingNews, setIsSubmittingNews] = useState(false);
  const [isSubmittingTourism, setIsSubmittingTourism] = useState(false);
  const { token, user } = useAuth();

  const loadDashboard = async (authToken = token) => {
    if (!authToken) return;
    setLoading(true);
    try {
      const data = await fetchAdminDashboard(authToken);
      setDashboardData(data);
    } catch (error) {
      toast.error('Unable to load admin metrics', {
        description: error instanceof Error ? error.message : undefined
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    void loadDashboard(token);
  }, [token]);

  const loadCommunityData = async () => {
    setCommunityLoading(true);
    try {
      const data = await fetchCommunityHome();
      setCommunityData(data);
    } catch (error) {
      toast.error('Unable to load community data', {
        description: error instanceof Error ? error.message : undefined
      });
    } finally {
      setCommunityLoading(false);
    }
  };

  useEffect(() => {
    loadCommunityData();
  }, []);

  const handleApprove = async (id: string, name: string) => {
    if (!token) return;
    try {
      await updateMsmeStatus(id, 'approved', token);
      toast.success(`${name} approved`);
      await loadDashboard(token);
    } catch (error) {
      toast.error(`Failed to approve ${name}`, {
        description: error instanceof Error ? error.message : undefined
      });
    }
  };

  const handleReject = async (id: string, name: string) => {
    if (!token) return;
    try {
      await updateMsmeStatus(id, 'rejected', token);
      toast.success(`${name} rejected`);
      await loadDashboard(token);
    } catch (error) {
      toast.error(`Failed to reject ${name}`, {
        description: error instanceof Error ? error.message : undefined
      });
    }
  };

  const populationEntries = dashboardData?.population.entries ?? [];

  const resetNewsForm = () => {
    setNewsForm({ title: '', summary: '', type: 'event', publishedAt: '' });
  };

  const resetTourismForm = () => {
    setTourismForm({ name: '', description: '', imageUrl: '', location: '' });
  };

  const submitNews = async () => {
    if (!token) return;
    try {
      setIsSubmittingNews(true);
      const payload = {
        ...newsForm,
        publishedAt: newsForm.publishedAt ? new Date(newsForm.publishedAt).toISOString() : undefined
      };
      await createNews(payload, token);
      toast.success('Update published');
      setIsNewsDialogOpen(false);
      resetNewsForm();
      loadCommunityData();
    } catch (error) {
      toast.error('Unable to publish update', {
        description: error instanceof Error ? error.message : undefined
      });
    } finally {
      setIsSubmittingNews(false);
    }
  };

  const submitTourism = async () => {
    if (!token) return;
    try {
      setIsSubmittingTourism(true);
      await createTourismSpot(tourismForm, token);
      toast.success('Tourism spot created');
      setIsTourismDialogOpen(false);
      resetTourismForm();
      loadCommunityData();
    } catch (error) {
      toast.error('Unable to create tourism spot', {
        description: error instanceof Error ? error.message : undefined
      });
    } finally {
      setIsSubmittingTourism(false);
    }
  };

  const handleDeleteNews = async (id: string, title: string) => {
    if (!token) return;
    if (!window.confirm(`Delete "${title}"?`)) return;
    try {
      await deleteNews(id, token);
      toast.success('Update deleted');
      loadCommunityData();
    } catch (error) {
      toast.error('Unable to delete update', {
        description: error instanceof Error ? error.message : undefined
      });
    }
  };

  const handleDeleteTourism = async (id: string, name: string) => {
    if (!token) return;
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await deleteTourismSpot(id, token);
      toast.success('Tourism spot deleted');
      loadCommunityData();
    } catch (error) {
      toast.error('Unable to delete tourism spot', {
        description: error instanceof Error ? error.message : undefined
      });
    }
  };

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
            <NotificationMenu />
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
                            <Button size="sm" variant="default" className="gap-1" onClick={() => handleApprove(request.id, request.name)}>
                              <CheckCircle className="h-3 w-3" />
                              Approve
                            </Button>
                            <Button size="sm" variant="destructive" className="gap-1" onClick={() => handleReject(request.id, request.name)}>
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
          <CardHeader className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <CardTitle>Community Content</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsNewsDialogOpen(true)}>
                + New Update
              </Button>
              <Button variant="outline" onClick={() => setIsTourismDialogOpen(true)}>
                + Tourism Spot
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">Latest News & Events</h4>
                <span className="text-xs text-muted-foreground">Showing {communityData?.news.length ?? 0} items</span>
              </div>
              {communityLoading ? (
                <SkeletonMessage />
              ) : communityData?.news.length ? (
                <div className="space-y-2">
                  {communityData.news.map((item) => (
                    <div key={item.id} className="flex items-start justify-between rounded-lg border border-border p-3">
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-xs text-muted-foreground capitalize">{item.type}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(item.publishedAt).toLocaleString()}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteNews(item.id, item.title)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No news yet.</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">Tourism Spots</h4>
                <span className="text-xs text-muted-foreground">Showing {communityData?.tourismSpots.length ?? 0} items</span>
              </div>
              {communityLoading ? (
                <SkeletonMessage />
              ) : communityData?.tourismSpots.length ? (
                <div className="space-y-2">
                  {communityData.tourismSpots.map((spot) => (
                    <div key={spot.id} className="flex items-start justify-between rounded-lg border border-border p-3">
                      <div>
                        <p className="font-medium">{spot.name}</p>
                        <p className="text-xs text-muted-foreground">{spot.location}</p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteTourism(spot.id, spot.name)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No tourism spots yet.</p>
              )}
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
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      setNewsForm((prev) => ({ ...prev, type: 'event' }));
                      setIsNewsDialogOpen(true);
                    }}
                  >
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

      <Dialog open={isNewsDialogOpen} onOpenChange={(open) => {
        setIsNewsDialogOpen(open);
        if (!open) resetNewsForm();
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Publish Update</DialogTitle>
            <DialogDescription>Share an event, announcement, or MSME highlight.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="news-title">Title</Label>
              <Input id="news-title" value={newsForm.title} onChange={(e) => setNewsForm((prev) => ({ ...prev, title: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="news-summary">Summary</Label>
              <Textarea id="news-summary" value={newsForm.summary} onChange={(e) => setNewsForm((prev) => ({ ...prev, summary: e.target.value }))} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={newsForm.type} onValueChange={(value: 'event' | 'business' | 'announcement') => setNewsForm((prev) => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="event">Event</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="announcement">Announcement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="news-date">Publish Date</Label>
                <Input
                  id="news-date"
                  type="datetime-local"
                  value={newsForm.publishedAt}
                  onChange={(e) => setNewsForm((prev) => ({ ...prev, publishedAt: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Button className="flex-1" onClick={submitNews} disabled={isSubmittingNews}>
                {isSubmittingNews ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  'Publish'
                )}
              </Button>
              <Button variant="outline" onClick={() => setIsNewsDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isTourismDialogOpen} onOpenChange={(open) => {
        setIsTourismDialogOpen(open);
        if (!open) resetTourismForm();
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Tourism Spot</DialogTitle>
            <DialogDescription>Highlight a destination for villagers to explore.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="spot-name">Name</Label>
              <Input id="spot-name" value={tourismForm.name} onChange={(e) => setTourismForm((prev) => ({ ...prev, name: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="spot-location">Location</Label>
              <Input id="spot-location" value={tourismForm.location} onChange={(e) => setTourismForm((prev) => ({ ...prev, location: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="spot-image">Image URL</Label>
              <Input id="spot-image" value={tourismForm.imageUrl} onChange={(e) => setTourismForm((prev) => ({ ...prev, imageUrl: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="spot-description">Description</Label>
              <Textarea id="spot-description" value={tourismForm.description} onChange={(e) => setTourismForm((prev) => ({ ...prev, description: e.target.value }))} />
            </div>
            <div className="flex gap-3">
              <Button className="flex-1" onClick={submitTourism} disabled={isSubmittingTourism}>
                {isSubmittingTourism ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Spot'
                )}
              </Button>
              <Button variant="outline" onClick={() => setIsTourismDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
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
