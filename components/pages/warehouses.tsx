'use client'

import { useState } from 'react'
import { WarehouseIcon, MapPin, User, Phone, Mail, AlertTriangle, Plus, MoreHorizontal, Archive, TrendingUp, Package } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getWarehouses, getProducts, archiveWarehouse } from '@/lib/data-service'
import { AddWarehouseForm } from '@/components/forms/add-warehouse-form'
import { Warehouse } from '@/lib/types'

export function Warehouses() {
  const [warehouses, setWarehouses] = useState(() => getWarehouses())
  const products = getProducts()

  const handleArchiveWarehouse = (id: string) => {
    archiveWarehouse(id)
    setWarehouses(getWarehouses())
  }

  const handleAddWarehouse = (warehouse: Warehouse) => {
    const currentWarehouses = getWarehouses(true)
    currentWarehouses.push(warehouse)
    localStorage.setItem('inventory:warehouses', JSON.stringify(currentWarehouses))
    setWarehouses(getWarehouses())
  }

  const getWarehouseStats = (warehouseId: string) => {
    const warehouseProducts = products.filter(p => p.warehouseId === warehouseId && !p.isArchived)
    const stockValue = warehouseProducts.reduce((sum, p) => sum + (p.quantity * p.purchasePrice), 0)
    const lowStockItems = warehouseProducts.filter(p => p.quantity <= p.reorderLevel).length
    const totalSalesValue = warehouseProducts.reduce((sum, p) => sum + (p.unitsSold * p.retailPrice), 0)
    return { 
      stockValue, 
      lowStockItems, 
      productCount: warehouseProducts.length,
      totalSalesValue,
      totalUnits: warehouseProducts.reduce((sum, p) => sum + p.quantity, 0)
    }
  }

  const getCapacityColor = (percentage: number) => {
    if (percentage < 60) return 'bg-green-500'
    if (percentage < 80) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const totalInventoryValue = warehouses.reduce((sum, wh) => {
    const stats = getWarehouseStats(wh.id)
    return sum + stats.stockValue
  }, 0)

  const totalLowStockItems = warehouses.reduce((sum, wh) => {
    const stats = getWarehouseStats(wh.id)
    return sum + stats.lowStockItems
  }, 0)

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Warehouses</h1>
          <p className="text-muted-foreground">Manage warehouse locations and inventory distribution</p>
        </div>
        <AddWarehouseForm onWarehouseAdded={() => setWarehouses(getWarehouses())} onSubmit={handleAddWarehouse} />
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Warehouses</p>
                <p className="text-2xl font-bold mt-1">{warehouses.length}</p>
              </div>
              <div className="p-2.5 bg-blue-500/10 rounded-lg">
                <WarehouseIcon className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Inventory Value</p>
                <p className="text-2xl font-bold mt-1">${(totalInventoryValue / 1000).toFixed(0)}K</p>
              </div>
              <div className="p-2.5 bg-green-500/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Low Stock Alerts</p>
                <p className={`text-2xl font-bold mt-1 ${totalLowStockItems > 0 ? 'text-yellow-600' : 'text-green-600'}`}>
                  {totalLowStockItems}
                </p>
              </div>
              <div className={`p-2.5 rounded-lg ${totalLowStockItems > 0 ? 'bg-yellow-500/10' : 'bg-green-500/10'}`}>
                <AlertTriangle className={`h-5 w-5 ${totalLowStockItems > 0 ? 'text-yellow-600' : 'text-green-600'}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Warehouse Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {warehouses.map((warehouse) => {
          const stats = getWarehouseStats(warehouse.id)
          const utilizationPercent = (warehouse.used / warehouse.capacity) * 100

          return (
            <Card key={warehouse.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6 space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <WarehouseIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{warehouse.name}</p>
                      <Badge variant="outline" className="mt-1 text-xs">{warehouse.code}</Badge>
                    </div>
                  </div>
                  <Badge className="bg-green-500/20 text-green-700">Active</Badge>
                </div>

                {/* Location & Contact */}
                <div className="space-y-2 text-xs bg-muted/50 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-muted-foreground">{warehouse.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-muted-foreground">{warehouse.manager}</span>
                  </div>
                </div>

                {/* Capacity */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Capacity</span>
                    <span className="text-xs text-muted-foreground">
                      {warehouse.used.toLocaleString()} / {warehouse.capacity.toLocaleString()}
                    </span>
                  </div>
                  <Progress
                    value={utilizationPercent}
                    className="h-2"
                  />
                  <p className="text-xs text-muted-foreground">
                    {utilizationPercent.toFixed(0)}% utilized
                  </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t">
                  <div className="text-center">
                    <p className="text-lg font-semibold">{stats.productCount}</p>
                    <p className="text-xs text-muted-foreground">Products</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold">${(stats.stockValue / 1000).toFixed(0)}K</p>
                    <p className="text-xs text-muted-foreground">Value</p>
                  </div>
                  <div className="text-center">
                    <p className={`text-lg font-semibold ${stats.lowStockItems > 0 ? 'text-yellow-600' : 'text-green-600'}`}>
                      {stats.lowStockItems}
                    </p>
                    <p className="text-xs text-muted-foreground">Low Stock</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t">
                  <Button variant="outline" size="sm" className="flex-1 text-xs">
                    View Details
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="w-10 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        Edit Warehouse
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-orange-600 cursor-pointer"
                        onClick={() => handleArchiveWarehouse(warehouse.id)}
                      >
                        <Archive className="h-4 w-4 mr-2" />
                        Archive Warehouse
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
