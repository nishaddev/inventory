'use client'

import { BarChart3, TrendingUp, ShoppingCart, RotateCw, Download, Calendar, Filter } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getSales, getProducts, getCategories, getWarehouses } from '@/lib/data-service'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function Reports() {
  const sales = getSales()
  const products = getProducts()
  const categories = getCategories()
  const warehouses = getWarehouses()

  // Calculate metrics
  const totalRevenue = sales.reduce((sum, s) => sum + s.totalAmount, 0)
  const totalProfit = sales.reduce((sum, s) => {
    const product = products.find(p => p.id === s.productId)
    if (!product) return sum
    const cost = s.quantity * product.purchasePrice
    return sum + (s.totalAmount - cost)
  }, 0)
  const itemsSold = sales.reduce((sum, s) => sum + s.quantity, 0)
  const avgMargin = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : '0'
  const avgOrderValue = sales.length > 0 ? (totalRevenue / sales.length).toFixed(2) : '0'

  // Sales by type
  const salesByType = [
    {
      name: 'Wholesale',
      value: sales.filter(s => s.saleType === 'wholesale').reduce((sum, s) => sum + s.totalAmount, 0),
      count: sales.filter(s => s.saleType === 'wholesale').length,
    },
    {
      name: 'Retail',
      value: sales.filter(s => s.saleType === 'retail').reduce((sum, s) => sum + s.totalAmount, 0),
      count: sales.filter(s => s.saleType === 'retail').length,
    },
  ]

  // Category performance
  const categoryPerformance = categories.map(cat => {
    const catSales = sales.filter(s => {
      const product = products.find(p => p.id === s.productId)
      return product?.categoryId === cat.id
    })
    const revenue = catSales.reduce((sum, s) => sum + s.totalAmount, 0)
    return { name: cat.name, value: revenue, count: catSales.length }
  }).filter(c => c.value > 0).sort((a, b) => b.value - a.value)

  // Top products
  const topProducts = products
    .map(p => {
      const productSales = sales.filter(s => s.productId === p.id)
      const revenue = productSales.reduce((sum, s) => sum + s.totalAmount, 0)
      return { name: p.name, revenue, units: productSales.reduce((sum, s) => sum + s.quantity, 0) }
    })
    .filter(p => p.revenue > 0)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)

  // Warehouse performance
  const warehousePerformance = warehouses.map(wh => {
    const whSales = sales.filter(s => s.warehouseId === wh.id)
    const revenue = whSales.reduce((sum, s) => sum + s.totalAmount, 0)
    return { name: wh.code, value: revenue, count: whSales.length }
  }).filter(w => w.value > 0).sort((a, b) => b.value - a.value)

  return (
    <div className="space-y-6 p-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">Comprehensive business insights and performance metrics</p>
        </div>
        <Button className="gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-slideUp">
        <MetricCard
          label="Total Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          icon={ShoppingCart}
          trend={12}
          color="blue"
        />
        <MetricCard
          label="Total Profit"
          value={`$${(totalProfit / 1000).toFixed(0)}K`}
          icon={TrendingUp}
          trend={8}
          color="green"
        />
        <MetricCard
          label="Items Sold"
          value={itemsSold.toString()}
          icon={ShoppingCart}
          trend={15}
          color="purple"
        />
        <MetricCard
          label="Profit Margin"
          value={`${avgMargin}%`}
          icon={RotateCw}
          trend={3}
          color="orange"
        />
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 animate-slideUp">
          {/* Summary Stats Table */}
          <Card>
            <CardHeader>
              <CardTitle>Summary Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-4">
                {[
                  { label: 'Total Orders', value: sales.length },
                  { label: 'Avg Order Value', value: `$${avgOrderValue}` },
                  { label: 'Total Units Sold', value: itemsSold },
                  { label: 'Avg Margin', value: `${avgMargin}%` },
                ].map((stat, i) => (
                  <div key={i} className="p-4 rounded border border-border hover:bg-muted/50 transition-colors">
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-xl font-semibold mt-1">{stat.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sales by Type */}
          <Card>
            <CardHeader>
              <CardTitle>Sales by Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                {salesByType.map((type, idx) => (
                  <div key={idx} className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-smooth">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{type.name} Sales</p>
                        <p className="text-2xl font-bold mt-1">${type.value.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground mt-1">{type.count} transactions</p>
                      </div>
                      <Badge className={idx === 0 ? 'bg-blue-500' : 'bg-purple-500'}>{type.count}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-6 animate-slideUp">
          <Card>
            <CardHeader>
              <CardTitle>Top 5 Products by Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded border border-border hover:bg-muted/50 transition-smooth" style={{animationDelay: `${idx * 50}ms`}}>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="w-8 text-center">{idx + 1}</Badge>
                      <div>
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.units} units sold</p>
                      </div>
                    </div>
                    <p className="font-semibold">${product.revenue.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6 animate-slideUp">
          <Card>
            <CardHeader>
              <CardTitle>Revenue by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {categoryPerformance.map((cat, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded border border-border hover:bg-muted/50 transition-smooth" style={{animationDelay: `${idx * 50}ms`}}>
                    <div>
                      <p className="font-medium text-sm">{cat.name}</p>
                      <p className="text-xs text-muted-foreground">{cat.count} transactions</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${cat.value.toLocaleString()}</p>
                      <p className="text-xs text-success">+{((cat.value / totalRevenue) * 100).toFixed(1)}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6 animate-slideUp">
          <Card>
            <CardHeader>
              <CardTitle>Warehouse Sales Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {warehousePerformance.map((wh, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded border border-border hover:bg-muted/50 transition-smooth" style={{animationDelay: `${idx * 50}ms`}}>
                    <div>
                      <p className="font-medium text-sm">{wh.name}</p>
                      <p className="text-xs text-muted-foreground">{wh.count} sales</p>
                    </div>
                    <p className="font-semibold">${wh.value.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function MetricCard({ label, value, icon: Icon, trend, color }: any) {
  const colorClasses: any = {
    blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    green: 'bg-green-500/10 text-green-600 dark:text-green-400',
    purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    orange: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold mt-2">{value}</p>
            <p className="text-xs text-green-600 mt-1">↑ {trend}% from last period</p>
          </div>
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
