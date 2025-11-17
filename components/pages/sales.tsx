'use client'

import { useState } from 'react'
import { ShoppingCart, Eye, FileText, Download, RotateCcw, MoreHorizontal, Plus, Archive, TrendingDown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AddSaleForm } from '@/components/forms/add-sale-form'
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
import { getSales, getProducts, getCategories, archiveSale } from '@/lib/data-service'

export function Sales() {
  const [sales, setSales] = useState(() => getSales())
  const products = getProducts()
  const categories = getCategories()

  const getProductName = (id: string) => products.find(p => p.id === id)?.name || 'Unknown'
  const getProductCategory = (id: string) => {
    const product = products.find(p => p.id === id)
    return categories.find(c => c.id === product?.categoryId)?.name || 'Unknown'
  }

  const todaySales = sales.filter(s => s.date.startsWith('2024-11-16')).reduce((sum, s) => sum + s.totalAmount, 0)
  const thisMonthSales = sales.reduce((sum, s) => sum + s.totalAmount, 0)
  const pendingPayments = sales.filter(s => s.paymentStatus === 'pending').reduce((sum, s) => sum + s.totalAmount, 0)
  
  const totalProfit = sales.reduce((sum, s) => {
    const product = products.find(p => p.id === s.productId)
    if (!product) return sum
    const cost = s.quantity * product.purchasePrice
    const revenue = s.totalAmount
    return sum + (revenue - cost)
  }, 0)

  const getPaymentStatusBadge = (status: string) => {
    if (status === 'paid') return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    if (status === 'pending') return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
  }

  const handleArchiveSale = (id: string) => {
    archiveSale(id)
    setSales(getSales())
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sales & Revenue</h1>
          <p className="text-muted-foreground">Track all sales transactions and profits</p>
        </div>
        <AddSaleForm onSaleAdded={() => setSales(getSales())} />
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          label="Today's Sales"
          value={`$${todaySales.toLocaleString()}`}
          subtext={`${sales.filter(s => s.date.startsWith('2024-11-16')).length} sales today`}
        />
        <SummaryCard
          label="This Month Revenue"
          value={`$${thisMonthSales.toLocaleString()}`}
          subtext={`${sales.length} total sales`}
        />
        <SummaryCard
          label="Pending Payments"
          value={`$${pendingPayments.toLocaleString()}`}
          subtext={`${sales.filter(s => s.paymentStatus === 'pending').length} invoices`}
          alert
        />
        <SummaryCard
          label="Total Profit"
          value={`$${(totalProfit / 1000).toFixed(1)}K`}
          subtext={`${thisMonthSales > 0 ? ((totalProfit / thisMonthSales) * 100).toFixed(1) : '0'}% profit margin`}
          profit
        />
      </div>

      {/* Sales Table */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Invoice</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Cost</TableHead>
                  <TableHead className="text-right">Profit</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sales.map((sale) => {
                  const product = products.find(p => p.id === sale.productId)
                  const cost = sale.quantity * (product?.purchasePrice || 0)
                  const profit = sale.totalAmount - cost
                  const profitMargin = sale.totalAmount > 0 ? ((profit / sale.totalAmount) * 100).toFixed(1) : '0'

                  return (
                    <TableRow key={sale.id} className="hover:bg-muted/50">
                      <TableCell className="font-mono text-sm font-semibold">{sale.invoiceNo}</TableCell>
                      <TableCell className="text-sm">{sale.date}</TableCell>
                      <TableCell>{getProductName(sale.productId)}</TableCell>
                      <TableCell className="text-sm">{sale.customer}</TableCell>
                      <TableCell>{sale.quantity}</TableCell>
                      <TableCell className="text-right text-sm">${sale.unitPrice.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-semibold">${sale.totalAmount.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-sm text-red-600">${cost.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-semibold text-green-600">${profit.toLocaleString()} ({profitMargin}%)</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getPaymentStatusBadge(sale.paymentStatus)}>
                          {sale.paymentStatus === 'paid' ? '✓ Paid' : sale.paymentStatus === 'pending' ? '⏳ Pending' : '◑ Partial'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm capitalize">{sale.paymentMethod.replace('_', ' ')}</TableCell>
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
                              <FileText className="h-4 w-4 mr-2" />
                              View Invoice
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Download PDF
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-orange-600"
                              onClick={() => handleArchiveSale(sale.id)}
                            >
                              <Archive className="h-4 w-4 mr-2" />
                              Archive Sale
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

          {sales.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mb-3" />
              <h3 className="font-semibold">No sales recorded yet</h3>
              <p className="text-sm text-muted-foreground">Record your first sale to see it here</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function SummaryCard({ label, value, subtext, alert, profit }: any) {
  return (
    <Card className={alert ? 'border-yellow-500/30 bg-yellow-500/5' : profit ? 'border-green-500/30 bg-green-500/5' : ''}>
      <CardContent className="pt-6">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className={`text-2xl font-bold mt-2 ${profit ? 'text-green-600' : ''}`}>{value}</p>
        <p className="text-xs text-muted-foreground mt-1">{subtext}</p>
      </CardContent>
    </Card>
  )
}
