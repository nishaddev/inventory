'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { saveProduct, getCategories, getWarehouses } from '@/lib/data-service'
import { Product } from '@/lib/types'

interface AddProductFormProps {
  onProductAdded?: () => void
}

export function AddProductForm({ onProductAdded }: AddProductFormProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const categories = getCategories()
  const warehouses = getWarehouses()

  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    warehouseId: '',
    sku: '',
    barcode: '',
    purchasePrice: '',
    wholesalePrice: '',
    retailPrice: '',
    quantity: '',
    unit: 'Piece',
    reorderLevel: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Validation
    if (!formData.name || !formData.categoryId || !formData.warehouseId || !formData.sku) {
      alert('Please fill in all required fields')
      setLoading(false)
      return
    }

    const newProduct: Product = {
      id: `PROD-${Date.now()}`,
      name: formData.name,
      categoryId: formData.categoryId,
      warehouseId: formData.warehouseId,
      sku: formData.sku,
      barcode: formData.barcode,
      purchasePrice: parseFloat(formData.purchasePrice) || 0,
      wholesalePrice: parseFloat(formData.wholesalePrice) || 0,
      retailPrice: parseFloat(formData.retailPrice) || 0,
      quantity: parseInt(formData.quantity) || 0,
      unit: formData.unit,
      date: new Date().toISOString().split('T')[0],
      reorderLevel: parseInt(formData.reorderLevel) || 50,
      costOfGoodsSold: 0,
      unitsSold: 0,
      lastRestockDate: new Date().toISOString().split('T')[0],
      isArchived: false,
    }

    saveProduct(newProduct)
    
    // Reset form
    setFormData({
      name: '',
      categoryId: '',
      warehouseId: '',
      sku: '',
      barcode: '',
      purchasePrice: '',
      wholesalePrice: '',
      retailPrice: '',
      quantity: '',
      unit: 'Piece',
      reorderLevel: '',
    })

    setLoading(false)
    setOpen(false)
    onProductAdded?.()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Enter product details to add it to your inventory
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Product Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g., USB-C Fast Charger 65W"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="categoryId">Category *</Label>
                <Select value={formData.categoryId} onValueChange={(value) => handleSelectChange('categoryId', value)}>
                  <SelectTrigger id="categoryId">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="warehouseId">Warehouse *</Label>
                <Select value={formData.warehouseId} onValueChange={(value) => handleSelectChange('warehouseId', value)}>
                  <SelectTrigger id="warehouseId">
                    <SelectValue placeholder="Select warehouse" />
                  </SelectTrigger>
                  <SelectContent>
                    {warehouses.map(wh => (
                      <SelectItem key={wh.id} value={wh.id}>
                        {wh.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="sku">SKU *</Label>
                <Input
                  id="sku"
                  name="sku"
                  placeholder="e.g., UFC-65W-001"
                  value={formData.sku}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="barcode">Barcode</Label>
                <Input
                  id="barcode"
                  name="barcode"
                  placeholder="e.g., 1234567890"
                  value={formData.barcode}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label htmlFor="unit">Unit</Label>
                <Select value={formData.unit} onValueChange={(value) => handleSelectChange('unit', value)}>
                  <SelectTrigger id="unit">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Piece">Piece</SelectItem>
                    <SelectItem value="Pack">Pack</SelectItem>
                    <SelectItem value="Pair">Pair</SelectItem>
                    <SelectItem value="Set">Set</SelectItem>
                    <SelectItem value="Box">Box</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Pricing Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Pricing Information</h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="purchasePrice">Purchase Price ($) *</Label>
                <Input
                  id="purchasePrice"
                  name="purchasePrice"
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  value={formData.purchasePrice}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="wholesalePrice">Wholesale Price ($) *</Label>
                <Input
                  id="wholesalePrice"
                  name="wholesalePrice"
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  value={formData.wholesalePrice}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="retailPrice">Retail Price ($) *</Label>
                <Input
                  id="retailPrice"
                  name="retailPrice"
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  value={formData.retailPrice}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Stock Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Stock Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quantity">Initial Quantity *</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  placeholder="0"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="reorderLevel">Reorder Level (Low Stock Alert)</Label>
                <Input
                  id="reorderLevel"
                  name="reorderLevel"
                  type="number"
                  placeholder="50"
                  value={formData.reorderLevel}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Adding...' : 'Add Product'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
