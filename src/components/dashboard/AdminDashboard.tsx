import React, { useState } from 'react';
import { Bell, LogOut, Menu, X, Users, Store, TrendingUp, Activity, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import ThemeToggle from '../ThemeToggle';
import { toast } from 'sonner@2.0.3';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AdminDashboardProps {
  onLogout: () => void;
}

const growthData = [
  { month: 'Jan', users: 120, msmes: 15, transactions: 245 },
  { month: 'Feb', users: 180, msmes: 22, transactions: 389 },
  { month: 'Mar', users: 240, msmes: 28, transactions: 512 },
  { month: 'Apr', users: 310, msmes: 35, transactions: 678 },
  { month: 'May', users: 405, msmes: 42, transactions: 892 },
  { month: 'Jun', users: 520, msmes: 51, transactions: 1124 },
];

const verificationRequests = [
  { id: 1, name: 'Toko Berkah', type: 'MSME', category: 'Grocery', date: '2 hours ago', status: 'pending' },
  { id: 2, name: 'Warung Makan Sederhana', type: 'MSME', category: 'Food', date: '5 hours ago', status: 'pending' },
  { id: 3, name: 'Kerajinan Tangan', type: 'MSME', category: 'Handicrafts', date: '1 day ago', status: 'pending' },
];

const villageData = {
  population: [
    { category: 'Total Population', value: '12,450', change: '+2.3%' },
    { category: 'Households', value: '3,125', change: '+1.8%' },
    { category: 'Working Age', value: '7,890', change: '+3.1%' },
    { category: 'Students', value: '2,340', change: '+4.2%' },
  ],
  msmes: [
    { category: 'Food & Beverage', count: 18 },
    { category: 'Handicrafts', count: 12 },
    { category: 'Grocery', count: 8 },
    { category: 'Services', count: 13 },
  ],
};

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleApprove = (name: string) => {
    toast.success(`${name} has been approved!`);
  };

  const handleReject = (name: string) => {
    toast.error(`${name} has been rejected!`);
  };

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
            <h1 className="text-xl">Karya Desa - Admin</h1>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full" />
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10 text-primary">AD</AvatarFallback>
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
          <h2 className="text-3xl">Admin Dashboard</h2>
          <p className="text-muted-foreground">Monitor and manage your village community</p>
        </div>

        {/* Overview Analytics */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-muted-foreground">Total Users</div>
                <Users className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl mb-1">10,245</div>
              <div className="flex items-center gap-1 text-xs text-green-600">
                <TrendingUp className="h-3 w-3" />
                +15.2% this month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-muted-foreground">Active MSMEs</div>
                <Store className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl mb-1">51</div>
              <div className="flex items-center gap-1 text-xs text-green-600">
                <TrendingUp className="h-3 w-3" />
                +9 this month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-muted-foreground">Total Transactions</div>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl mb-1">1,124</div>
              <div className="flex items-center gap-1 text-xs text-green-600">
                <TrendingUp className="h-3 w-3" />
                +23.8% this month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-muted-foreground">Pending Requests</div>
                <Bell className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl mb-1">3</div>
              <div className="text-xs text-muted-foreground">
                Awaiting verification
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Growth Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="month"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={2}
                    name="Users"
                  />
                  <Line
                    type="monotone"
                    dataKey="msmes"
                    stroke="hsl(var(--chart-2))"
                    strokeWidth={2}
                    name="MSMEs"
                  />
                  <Line
                    type="monotone"
                    dataKey="transactions"
                    stroke="hsl(var(--chart-3))"
                    strokeWidth={2}
                    name="Transactions"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Verification Requests */}
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
                    <TableHead>Type</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {verificationRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>{request.name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{request.type}</Badge>
                      </TableCell>
                      <TableCell>{request.category}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {request.date}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="default"
                            className="gap-1"
                            onClick={() => handleApprove(request.name)}
                          >
                            <CheckCircle className="h-3 w-3" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="gap-1"
                            onClick={() => handleReject(request.name)}
                          >
                            <XCircle className="h-3 w-3" />
                            Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Village Data Management */}
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
                  {villageData.population.map((item, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg border border-border hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">
                            {item.category}
                          </p>
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
                  {villageData.msmes.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg border border-border hover:shadow-md transition-shadow"
                    >
                      <p className="text-sm">{item.category}</p>
                      <Badge>{item.count} businesses</Badge>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="events" className="space-y-4">
                <div className="text-center py-12 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No upcoming events</p>
                  <Button variant="outline" className="mt-4">
                    Create Event
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="reports" className="space-y-4">
                <div className="text-center py-12 text-muted-foreground">
                  <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Generate custom reports</p>
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

function Calendar({ className }: { className?: string }) {
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
