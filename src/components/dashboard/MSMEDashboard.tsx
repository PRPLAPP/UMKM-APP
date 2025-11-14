import React, { useEffect, useMemo, useState } from 'react';
import { LogOut, Menu, X, Plus, Edit, Trash2, TrendingUp, ShoppingBag, Star, DollarSign, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import ThemeToggle from '../ThemeToggle';
import { toast } from 'sonner@2.0.3';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { NotificationMenu } from '../notifications/NotificationMenu';
import {
  createProduct,
  createOrder,
  deleteProduct,
  fetchOrders,
  fetchMsmeProfile,
  fetchProducts,
  fetchSalesSummary,
  updateMsmeProfile,
  updateOrderStatus,
  updateProduct,
  type Order,
  type Product,
  type SalesSummary,
  type MsmeProfile
} from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

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
  const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [salesSummary, setSalesSummary] = useState<SalesSummary | null>(null);
  const [profile, setProfile] = useState<MsmeProfile | null>(null);
  const [productForm, setProductForm] = useState(defaultProductForm);
  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [isLoadingSummary, setIsLoadingSummary] = useState(true);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({
    storeName: '',
    category: '',
    description: '',
    location: '',
    distanceKm: ''
  });
  const [orderForm, setOrderForm] = useState({
    customerName: '',
    customerEmail: '',
    items: [{ productId: '', quantity: 1 }]
  });

  const { user, token } = useAuth();

  const loadProducts = async (authToken = token) => {
    if (!authToken) {
      return;
    }
    setIsLoadingProducts(true);
    try {
      const data = await fetchProducts(authToken);
      setProducts(data);
    } catch (error) {
      toast.error('Failed to load products', { description: (error as Error).message });
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const loadOrders = async (authToken = token) => {
    if (!authToken) {
      return;
    }
    setIsLoadingOrders(true);
    try {
      const data = await fetchOrders(authToken);
      setOrders(data);
    } catch (error) {
      toast.error('Failed to load orders', { description: (error as Error).message });
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const loadProfile = async (authToken = token) => {
    if (!authToken) return;
    try {
      const data = await fetchMsmeProfile(authToken);
      setProfile(data);
    } catch (error) {
      toast.error('Failed to load profile', { description: (error as Error).message });
    }
  };

  useEffect(() => {
    if (!token) return;
    loadProducts(token);
    loadOrders(token);
    loadSalesSummary();
    loadProfile(token);
  }, [token]);

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

  const openCreateProductDialog = () => {
    setCurrentProduct(null);
    setProductForm(defaultProductForm);
    setIsAddProductOpen(true);
  };

  const openEditProductDialog = (product: Product) => {
    setCurrentProduct(product);
    setProductForm({
      name: product.name,
      price: String(product.price),
      stock: String(product.stock),
      description: product.description,
      category: product.category
    });
    setIsAddProductOpen(true);
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsAddProductOpen(open);
    if (!open) {
      setCurrentProduct(null);
      setProductForm(defaultProductForm);
    }
  };

  const submitProduct = async () => {
    try {
      if (!token) {
        throw new Error('You are not authenticated.');
      }
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

      if (currentProduct) {
        const product = await updateProduct(currentProduct.id, payload, token);
        setProducts((prev) => prev.map((item) => (item.id === product.id ? product : item)));
        toast.success('Product updated successfully!');
      } else {
        const product = await createProduct(payload, token);
        setProducts((prev) => [product, ...prev]);
        toast.success('Product added successfully!');
      }
      setIsAddProductOpen(false);
      setProductForm(defaultProductForm);
      setCurrentProduct(null);
    } catch (error) {
      toast.error('Unable to save product', { description: (error as Error).message });
    } finally {
      setIsSubmittingProduct(false);
    }
  };

  const handleDeleteProduct = async (product: Product) => {
    if (!token) {
      toast.error('You are not authenticated.');
      return;
    }
    const confirmed = window.confirm(`Delete "${product.name}"? This action cannot be undone.`);
    if (!confirmed) return;
    try {
      await deleteProduct(product.id, token);
      setProducts((prev) => prev.filter((item) => item.id !== product.id));
      toast.success('Product deleted');
    } catch (error) {
      toast.error('Unable to delete product', { description: (error as Error).message });
    }
  };

  const openProfileDialog = () => {
    if (!profile) return;
    setProfileForm({
      storeName: profile.storeName,
      category: profile.category,
      description: profile.description,
      location: profile.location,
      distanceKm: String(profile.distanceKm)
    });
    setIsProfileDialogOpen(true);
  };

  const handleProfileChange = (field: keyof typeof profileForm) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = event.target.value;
    setProfileForm((prev) => ({ ...prev, [field]: value }));
  };

  const submitProfile = async () => {
    if (!token) return;
    try {
      const payload = {
        storeName: profileForm.storeName.trim(),
        category: profileForm.category.trim(),
        description: profileForm.description.trim(),
        location: profileForm.location.trim(),
        distanceKm: Number(profileForm.distanceKm)
      };
      if (!payload.storeName || !payload.category || !payload.description || !payload.location) {
        throw new Error('Please complete all fields.');
      }
      if (Number.isNaN(payload.distanceKm)) {
        throw new Error('Distance must be a number.');
      }
      const updated = await updateMsmeProfile(payload, token);
      setProfile(updated);
      toast.success('Profile updated');
      setIsProfileDialogOpen(false);
    } catch (error) {
      toast.error('Unable to update profile', { description: (error as Error).message });
    }
  };

  const resetOrderForm = () => {
    setOrderForm({
      customerName: '',
      customerEmail: '',
      items: [{ productId: '', quantity: 1 }]
    });
  };

  const handleOrderFieldChange = (field: 'customerName' | 'customerEmail') => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setOrderForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleOrderItemChange = (index: number, field: 'productId' | 'quantity', value: string) => {
    setOrderForm((prev) => {
      const items = [...prev.items];
      items[index] = {
        ...items[index],
        [field]: field === 'quantity' ? Number(value) : value
      };
      return { ...prev, items };
    });
  };

  const addOrderItem = () => {
    setOrderForm((prev) => ({
      ...prev,
      items: [...prev.items, { productId: '', quantity: 1 }]
    }));
  };

  const removeOrderItem = (index: number) => {
    setOrderForm((prev) => {
      if (prev.items.length === 1) {
        return prev;
      }
      return {
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      };
    });
  };

  const submitOrder = async () => {
    if (!token) {
      toast.error('You must be signed in to create orders.');
      return;
    }
    try {
      setIsSubmittingOrder(true);
      if (!orderForm.customerName.trim() || !orderForm.customerEmail.trim()) {
        throw new Error('Customer information is required.');
      }
      const items = orderForm.items
        .filter((item) => item.productId && item.quantity > 0)
        .map((item) => ({
          productId: item.productId,
          quantity: item.quantity
        }));

      if (items.length === 0) {
        throw new Error('Add at least one product to the order.');
      }

      const order = await createOrder(
        {
          customerName: orderForm.customerName.trim(),
          customerEmail: orderForm.customerEmail.trim(),
          items
        },
        token
      );

      setOrders((prev) => [order, ...prev]);
      toast.success('Order created successfully!');
      setIsCreateOrderOpen(false);
      resetOrderForm();
      loadSalesSummary();
      loadOrders(token);
    } catch (error) {
      toast.error('Unable to create order', { description: (error as Error).message });
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const getNextStatus = (status: Order['status']) => {
    if (status === 'pending') return 'processing';
    if (status === 'processing') return 'completed';
    return null;
  };

  const handleAdvanceOrderStatus = async (order: Order) => {
    if (!token) return;
    const nextStatus = getNextStatus(order.status);
    if (!nextStatus) return;
    try {
      const updated = await updateOrderStatus(order.id, nextStatus, token);
      setOrders((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      toast.success(`Order marked as ${updated.status}`);
      loadSalesSummary();
    } catch (error) {
      toast.error('Unable to update order', { description: (error as Error).message });
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
            <NotificationMenu />
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10 text-primary">
                {user?.name?.slice(0, 2).toUpperCase() ?? 'MS'}
              </AvatarFallback>
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
                <h2 className="text-2xl mb-1">{profile?.storeName ?? 'Your Store Name'}</h2>
                <p className="text-sm text-muted-foreground mb-3">
                  {profile?.description ?? 'Tell customers about your business.'}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{profile?.status ?? 'pending'}</Badge>
                  {profile?.category ? <Badge variant="outline">{profile.category}</Badge> : null}
                  {profile ? (
                    <Badge variant="outline">
                      {profile.distanceKm.toFixed(1)} km • {profile.location}
                    </Badge>
                  ) : null}
                </div>
              </div>
              <Button onClick={openProfileDialog}>Edit Profile</Button>
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
              <div className="text-2xl mb-1">
                {profile ? profile.rating.toFixed(1) : '—'}
              </div>
              <div className="text-xs text-muted-foreground">
                {orders.length
                  ? `From ${orders.length} order${orders.length === 1 ? '' : 's'}`
                  : 'No orders yet'}
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
            <Dialog open={isAddProductOpen} onOpenChange={handleDialogOpenChange}>
              <Button className="gap-2" onClick={openCreateProductDialog}>
                <Plus className="h-4 w-4" />
                Add Product
              </Button>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{currentProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                  <DialogDescription>
                    {currentProduct ? 'Update the details of your product.' : 'Add a new product to your store inventory.'}
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
                    <Button onClick={submitProduct} className="flex-1" disabled={isSubmittingProduct}>
                      {isSubmittingProduct ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        currentProduct ? 'Save Changes' : 'Add Product'
                      )}
                    </Button>
                    <Button variant="outline" onClick={() => handleDialogOpenChange(false)}>
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
                          <Button variant="ghost" size="icon" onClick={() => openEditProductDialog(product)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteProduct(product)}>
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
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Orders</CardTitle>
            <Dialog
              open={isCreateOrderOpen}
              onOpenChange={(open) => {
                setIsCreateOrderOpen(open);
                if (!open) resetOrderForm();
              }}
            >
              <Button variant="outline" onClick={() => setIsCreateOrderOpen(true)}>
                + Create Order
              </Button>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Order</DialogTitle>
                  <DialogDescription>Record a manual order for bookkeeping.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="customer-name">Customer Name</Label>
                    <Input id="customer-name" value={orderForm.customerName} onChange={handleOrderFieldChange('customerName')} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer-email">Customer Email</Label>
                    <Input id="customer-email" type="email" value={orderForm.customerEmail} onChange={handleOrderFieldChange('customerEmail')} />
                  </div>
                  <div className="space-y-3">
                    <Label>Items</Label>
                    {orderForm.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Select value={item.productId} onValueChange={(value) => handleOrderItemChange(index, 'productId', value)}>
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Select product" />
                          </SelectTrigger>
                          <SelectContent>
                            {products.map((product) => (
                              <SelectItem key={product.id} value={product.id}>
                                {product.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          type="number"
                          min={1}
                          className="w-24"
                          value={item.quantity}
                          onChange={(event) => handleOrderItemChange(index, 'quantity', event.target.value)}
                        />
                        {orderForm.items.length > 1 && (
                          <Button variant="ghost" size="icon" onClick={() => removeOrderItem(index)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button type="button" variant="outline" onClick={addOrderItem}>
                      + Add Item
                    </Button>
                  </div>
                  <div className="flex gap-3">
                    <Button className="flex-1" disabled={isSubmittingOrder} onClick={submitOrder}>
                      {isSubmittingOrder ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        'Save Order'
                      )}
                    </Button>
                    <Button variant="outline" onClick={() => setIsCreateOrderOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
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
                      {getNextStatus(order.status) && (
                        <Button size="sm" variant="link" className="h-auto p-0 text-xs" onClick={() => handleAdvanceOrderStatus(order)}>
                          Mark {getNextStatus(order.status)}
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
      <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Store Profile</DialogTitle>
            <DialogDescription>Update how your store appears to villagers and admins.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="profile-name">Store Name</Label>
              <Input id="profile-name" value={profileForm.storeName} onChange={handleProfileChange('storeName')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-category">Category</Label>
              <Input id="profile-category" value={profileForm.category} onChange={handleProfileChange('category')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-description">Description</Label>
              <Textarea id="profile-description" value={profileForm.description} onChange={handleProfileChange('description')} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="profile-location">Location</Label>
                <Input id="profile-location" value={profileForm.location} onChange={handleProfileChange('location')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-distance">Distance (km)</Label>
                <Input
                  id="profile-distance"
                  type="number"
                  min="0"
                  step="0.1"
                  value={profileForm.distanceKm}
                  onChange={handleProfileChange('distanceKm')}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Button className="flex-1" onClick={submitProfile} disabled={!token}>
                Save Profile
              </Button>
              <Button variant="outline" onClick={() => setIsProfileDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
