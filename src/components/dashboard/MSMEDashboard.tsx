import React, { useEffect, useMemo, useState } from 'react';
import { Bell, LogOut, Menu, X, Plus, Edit, Trash2, TrendingUp, ShoppingBag, Star, DollarSign, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import ThemeToggle from '../ThemeToggle';
import { toast } from 'sonner@2.0.3';
import { createProduct, fetchOrders, fetchProducts, fetchSalesSummary, type Order, type Product, type SalesSummary } from '@/lib/api';

interface MSMEDashboardProps {
  onLogout: () => void;
}

const currencyFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR'
});

const formatCurrency = (value: number) => currencyFormatter.format(value);

const defaultProductForm = {
  name: '',
  price: '',
  stock: '',
  description: '',
  category: ''
};

export default function MSMEDashboard({ onLogout }: MSMEDashboardProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [salesSummary, setSalesSummary] = useState<SalesSummary | null>(null);
  const [productForm, setProductForm] = useState(defaultProductForm);
  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [isLoadingSummary, setIsLoadingSummary] = useState(true);

  const loadProducts = async () => {
    setIsLoadingProducts(true);
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (error) {
      toast.error('Failed to load products', { description: (error as Error).message });
    } finally {
      setIsLoadingProducts(false);
    }
  };

  useEffect(() => {
    loadProducts();
    loadOrders();
    loadSalesSummary();
  }, []);

  const loadOrders = async () => {
    setIsLoadingOrders(true);
    try {
      const data = await fetchOrders();
      setOrders(data);
    } catch (error) {
      toast.error('Failed to load orders', { description: (error as Error).message });
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const loadSalesSummary = async () => {
    setIsLoadingSummary(true);
    try {
      const summary = await fetchSalesSummary();
      setSalesSummary(summary);
    } catch (error) {
      toast.error('Failed to load sales summary', { description: (error as Error).message });
    } finally {
      setIsLoadingSummary(false);
    }
  };

  const handleAddProduct = () => {
    void submitProduct();
  };

  const submitProduct = async () => {
    try {
      setIsSubmittingProduct(true);
      const payload = {
        name: productForm.name.trim(),
        description: productForm.description.trim(),
        price: Number(productForm.price),
        stock: Number(productForm.stock),
        category: productForm.category.trim()
      };

      if (!payload.name || !payload.description || !payload.category) {
        throw new Error('Please fill in all required fields');
      }

      if (Number.isNaN(payload.price) || Number.isNaN(payload.stock)) {
        throw new Error('Price and stock must be valid numbers');
      }

      const product = await createProduct(payload);
      setProducts((prev) => [...prev, product]);
      toast.success('Product added successfully!');
      setIsAddProductOpen(false);
      setProductForm(defaultProductForm);
    } catch (error) {
      toast.error('Unable to add product', { description: (error as Error).message });
    } finally {
      setIsSubmittingProduct(false);
    }
  };

  const activeProductCount = useMemo(() => products.filter((product) => product.stock > 0).length, [products]);

  const handleFormChange = (field: keyof typeof productForm) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = event.target.value;
    setProductForm((prev) => ({ ...prev, [field]: value }));
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
            <h1 className="text-xl">Karya Desa - MSME</h1>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full" />
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10 text-primary">WS</AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="icon" onClick={onLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Store Profile Banner */}
        <Card className="overflow-hidden">
          <div className="h-32 bg-gradient-to-br from-primary to-accent" />
          <CardContent className="relative pt-0 pb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-12">
              <div className="h-24 w-24 rounded-xl bg-card border-4 border-background shadow-lg flex items-center justify-center">
                <ShoppingBag className="h-12 w-12 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl mb-1">Warung Sari</h2>
                <p className="text-sm text-muted-foreground mb-3">
                  Traditional handicrafts and local products from our village
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Verified</Badge>
                  <Badge variant="outline">Handicrafts</Badge>
                  <Badge variant="outline">Local Products</Badge>
                </div>
              </div>
              <Button>Edit Profile</Button>
            </div>
          </CardContent>
        </Card>

        {/* Analytics Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-muted-foreground">Total Sales</div>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl mb-1">
                {isLoadingSummary ? 'Loading...' : formatCurrency(salesSummary?.totalRevenue ?? 0)}
              </div>
              <div className="text-xs text-muted-foreground">
                {salesSummary?.lastOrderAt
                  ? `Last order ${new Date(salesSummary.lastOrderAt).toLocaleString('id-ID')}`
                  : 'No orders yet'}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-muted-foreground">Total Orders</div>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl mb-1">
                {isLoadingSummary ? '—' : salesSummary?.ordersCount ?? 0}
              </div>
              <div className="flex items-center gap-1 text-xs text-green-600">
                <TrendingUp className="h-3 w-3" />
                Live from backend
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-muted-foreground">Average Rating</div>
                <Star className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl mb-1">4.8</div>
              <div className="text-xs text-muted-foreground">
                From 125 reviews
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-muted-foreground">Active Products</div>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl mb-1">{isLoadingProducts ? '—' : activeProductCount}</div>
              <div className="text-xs text-muted-foreground">
                {products.length - activeProductCount} out of stock
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Product Management */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Product Management</CardTitle>
            <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                  <DialogDescription>
                    Add a new product to your store inventory
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="product-name">Product Name</Label>
                    <Input
                      id="product-name"
                      placeholder="Enter product name"
                      value={productForm.name}
                      onChange={handleFormChange('name')}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price (Rp)</Label>
                      <Input
                        id="price"
                        type="number"
                        placeholder="0"
                        value={productForm.price}
                        onChange={handleFormChange('price')}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stock">Stock</Label>
                      <Input
                        id="stock"
                        type="number"
                        placeholder="0"
                        value={productForm.stock}
                        onChange={handleFormChange('stock')}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      placeholder="e.g. Handicrafts"
                      value={productForm.category}
                      onChange={handleFormChange('category')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Product description"
                      value={productForm.description}
                      onChange={handleFormChange('description')}
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={handleAddProduct} className="flex-1" disabled={isSubmittingProduct}>
                      {isSubmittingProduct ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        'Add Product'
                      )}
                    </Button>
                    <Button variant="outline" onClick={() => setIsAddProductOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Added</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingProducts ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-sm text-muted-foreground">
                        Loading products...
                      </TableCell>
                    </TableRow>
                  ) : products.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-sm text-muted-foreground">
                        No products yet. Add your first product to get started.
                      </TableCell>
                    </TableRow>
                  ) : (
                    products.map((product) => {
                      const status = product.stock > 0 ? 'active' : 'out_of_stock';
                      return (
                        <TableRow key={product.id}>
                          <TableCell>{product.name}</TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell>{formatCurrency(product.price)}</TableCell>
                          <TableCell>{product.stock}</TableCell>
                          <TableCell>
                            <Badge variant={status === 'active' ? 'default' : 'destructive'}>
                              {status === 'active' ? 'Active' : 'Out of Stock'}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(product.createdAt).toLocaleDateString('id-ID')}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" onClick={() => toast.success('Edit product')}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => toast.success('Product deleted')}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Manage Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {isLoadingOrders ? (
                <p className="text-sm text-muted-foreground">Loading orders...</p>
              ) : orders.length === 0 ? (
                <p className="text-sm text-muted-foreground">No orders yet.</p>
              ) : (
                orders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:shadow-md transition-shadow"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <p className="text-sm">Order #{order.id.slice(0, 8)}</p>
                        <Badge
                          variant={
                            order.status === 'completed'
                              ? 'default'
                              : order.status === 'processing'
                              ? 'secondary'
                              : 'outline'
                          }
                        >
                          {order.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {order.customerName} • {order.customerEmail}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {order.items.length} item(s)
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">{formatCurrency(order.total)}</p>
                      {order.status !== 'completed' && (
                        <Button size="sm" variant="link" className="h-auto p-0 text-xs">
                          Process Order
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
