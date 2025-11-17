'use client'

import { useState, useMemo } from 'react'
import { Package, Plus, Download, Eye, Pencil, Trash2, MoreHorizontal, Search, Filter, Archive, TrendingUp, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { getProducts, getCategories, getWarehouses, archiveProduct, getLowStockItems } from '@/lib/data-service'
import { AddProductForm } from '@/components/forms/add-product-form'

export function Products() {
  const [products, setProducts] = useState(() => getProducts())
  const categories = getCategories()
  const warehouses = getWarehouses()
  const lowStockItems = getLowStockItems()

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedWarehouse, setSelectedWarehouse] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [showLowStockOnly, setShowLowStockOnly] = useState(false)

  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.barcode.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = selectedCategory === 'all' || p.categoryId === selectedCategory
        const matchesWarehouse = selectedWarehouse === 'all' || p.warehouseId === selectedWarehouse
        const matchesLowStock = !showLowStockOnly || p.quantity <= p.reorderLevel

        return matchesSearch && matchesCategory && matchesWarehouse && matchesLowStock
      })
      .sort((a, b) => {
        let aVal = a[sortBy as keyof typeof a]
        let bVal = b[sortBy as keyof typeof b]
        
        if (sortOrder === 'asc') {
          return aVal > bVal ? 1 : -1
        }
        return aVal < bVal ? 1 : -1
      })
  }, [products, searchTerm, selectedCategory, selectedWarehouse, sortBy, sortOrder, showLowStockOnly])

  const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || 'Unknown'
  const getWarehouseName = (id: string) => warehouses.find(w => w.id === id)?.name || 'Unknown'
  const totalInventoryValue = products.reduce((sum, p) => sum + (p.quantity * p.purchasePrice), 0)
  const totalRetailValue = products.reduce((sum, p) => sum + (p.quantity * p.retailPrice), 0)

  const handleArchive = (id: string) => {
    archiveProduct(id)
    setProducts(getProducts())
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header with Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products Inventory</h1>
          <p className="text-muted-foreground">Mobile Accessories Management ({filteredProducts.length} active)</p>
        </div>
        <AddProductForm onProductAdded={() => setProducts(getProducts())} />
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Inventory Value</p>
            <p className="text-2xl font-bold mt-2">${(totalInventoryValue / 1000).toFixed(1)}K</p>
            <p className="text-xs text-muted-foreground mt-1">{products.length} SKUs</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Retail Value</p>
            <p className="text-2xl font-bold mt-2">${(totalRetailValue / 1000).toFixed(1)}K</p>
            <p className="text-xs text-green-600 mt-1">↑ ${((totalRetailValue - totalInventoryValue) / 1000).toFixed(1)}K potential margin</p>
          </CardContent>
        </Card>
        <Card className={lowStockItems.length > 0 ? 'border-yellow-500/30 bg-yellow-500/5' : ''}>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Low Stock Items</p>
            <p className="text-2xl font-bold mt-2">{lowStockItems.length}</p>
            <p className="text-xs text-yellow-600 mt-1">⚠️ {lowStockItems.length} need restocking</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, SKU, barcode..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
              <SelectTrigger>
                <SelectValue placeholder="Warehouse" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {warehouses.map(wh => (
                  <SelectItem key={wh.id} value={wh.id}>
                    {wh.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button 
              variant={showLowStockOnly ? "default" : "outline"} 
              size="sm"
              onClick={() => setShowLowStockOnly(!showLowStockOnly)}
              className="gap-2"
            >
              <AlertTriangle className="h-4 w-4" />
              Low Stock
            </Button>

            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardContent className="pt-6">
          <div className="rounded-lg border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-12">SL No.</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead className="text-right">Buy Price</TableHead>
                  <TableHead className="text-right">Wholesale</TableHead>
                  <TableHead className="text-right">Retail</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Total Cost</TableHead>
                  <TableHead className="text-right">Total Wholesale</TableHead>
                  <TableHead className="text-right">Total Retail</TableHead>
                  <TableHead className="text-right">W/S Profit</TableHead>
                  <TableHead className="text-right">Retail Profit</TableHead>
                  <TableHead className="text-right">Margin %</TableHead>
                  <TableHead className="w-12">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product, idx) => {
                  const totalCost = product.quantity * product.purchasePrice
                  const totalWholesale = product.quantity * product.wholesalePrice
                  const totalRetail = product.quantity * product.retailPrice
                  const wholesaleProfit = totalWholesale - totalCost
                  const retailProfit = totalRetail - totalCost
                  const marginPercent = totalRetail > 0 ? ((retailProfit / totalRetail) * 100).toFixed(1) : '0'
                  const isLowStock = product.quantity <= product.reorderLevel

                  return (
                    <TableRow key={product.id} className={isLowStock ? 'bg-yellow-500/5 hover:bg-yellow-500/10' : 'hover:bg-muted/50'}>
                      <TableCell className="font-medium text-sm">{idx + 1}</TableCell>
                      <TableCell className="text-sm">{product.date}</TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">{getCategoryName(product.categoryId)}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">{getWarehouseName(product.warehouseId)}</TableCell>
                      <TableCell className="text-sm">{product.unit}</TableCell>
                      <TableCell className="text-right text-sm">${product.purchasePrice.toFixed(2)}</TableCell>
                      <TableCell className="text-right text-sm">${product.wholesalePrice.toFixed(2)}</TableCell>
                      <TableCell className="text-right text-sm">${product.retailPrice.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant={isLowStock ? "destructive" : "secondary"} className="text-xs">
                          {product.quantity}
                          {isLowStock && ' ⚠️'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold text-sm">${totalCost.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</TableCell>
                      <TableCell className="text-right font-semibold text-sm">${totalWholesale.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</TableCell>
                      <TableCell className="text-right font-semibold text-sm">${totalRetail.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</TableCell>
                      <TableCell className="text-right text-sm text-blue-600">${wholesaleProfit.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</TableCell>
                      <TableCell className="text-right text-sm text-green-600">${retailProfit.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</TableCell>
                      <TableCell className="text-right font-semibold text-sm">{marginPercent}%</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit Product
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <TrendingUp className="h-4 w-4 mr-2" />
                              View History
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-orange-600"
                              onClick={() => handleArchive(product.id)}
                            >
                              <Archive className="h-4 w-4 mr-2" />
                              Archive Product
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Package className="h-12 w-12 text-muted-foreground mb-3" />
              <h3 className="font-semibold">No products found</h3>
              <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
