'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
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
import { recordSale, getProducts, getWarehouses } from '@/lib/data-service'
import { Sale } from '@/lib/types'

interface AddSaleFormProps {
  onSaleAdded?: () => void
}

export function AddSaleForm({ onSaleAdded }: AddSaleFormProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const products = getProducts()
  const warehouses = getWarehouses()

  const [formData, setFormData] = useState({
    productId: '',
    warehouseId: '',
    quantity: '',
    customer: '',
    saleType: 'retail',
    paymentMethod: 'cash',
    paymentStatus: 'paid',
  })

  const selectedProduct = products.find(p => p.id === formData.productId)
  const unitPrice = formData.saleType === 'wholesale' ? selectedProduct?.wholesalePrice : selectedProduct?.retailPrice

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
    if (!formData.productId || !formData.quantity || !formData.customer) {
      alert('Please fill in all required fields')
      setLoading(false)
      return
    }

    const qty = parseInt(formData.quantity)
    if (selectedProduct && qty > selectedProduct.quantity) {
      alert(`Insufficient stock. Available: ${selectedProduct.quantity}`)
      setLoading(false)
      return
    }

    const totalAmount = (unitPrice || 0) * qty

    const newSale: Sale = {
      id: `SALE-${Date.now()}`,
      invoiceNo: `INV-${new Date().toISOString().slice(0,10).replace(/-/g, '')}-${Math.random().toString(36).substr(2, 3).toUpperCase()}`,
      date: new Date().toLocaleString(),
      productId: formData.productId,
      customer: formData.customer,
      saleType: formData.saleType as 'retail' | 'wholesale',
      quantity: qty,
      unitPrice: unitPrice || 0,
      totalAmount,
      paymentMethod: formData.paymentMethod as 'cash' | 'card' | 'bank_transfer',
      paymentStatus: formData.paymentStatus as 'paid' | 'pending' | 'partial',
      warehouseId: formData.warehouseId || (selectedProduct?.warehouseId || ''),
      isArchived: false,
    }

    recordSale(newSale)

    // Reset form
    setFormData({
      productId: '',
      warehouseId: '',
      quantity: '',
      customer: '',
      saleType: 'retail',
      paymentMethod: 'cash',
      paymentStatus: 'paid',
    })

    setLoading(false)
    setOpen(false)
    onSaleAdded?.()
    alert('Sale recorded successfully!')
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Record New Sale
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Record New Sale</DialogTitle>
          <DialogDescription>
            Record a new sale transaction and update inventory
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Sale Items */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Sale Details</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="productId">Product *</Label>
                <Select value={formData.productId} onValueChange={(value) => handleSelectChange('productId', value)}>
                  <SelectTrigger id="productId">
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map(prod => (
                      <SelectItem key={prod.id} value={prod.id}>
                        {prod.name} (Stock: {prod.quantity})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="saleType">Sale Type *</Label>
                <Select value={formData.saleType} onValueChange={(value) => handleSelectChange('saleType', value)}>
                  <SelectTrigger id="saleType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="wholesale">Wholesale</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="quantity">Quantity *</Label>
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

              {selectedProduct && (
                <div className="col-span-2 p-3 bg-muted rounded-lg">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Unit Price</p>
                      <p className="font-semibold">${unitPrice?.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Available Stock</p>
                      <p className="font-semibold">{selectedProduct.quantity}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total Amount</p>
                      <p className="font-semibold text-green-600">${((unitPrice || 0) * parseInt(formData.quantity || 0)).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Customer Information</h3>
            
            <div>
              <Label htmlFor="customer">Customer Name *</Label>
              <Input
                id="customer"
                name="customer"
                placeholder="e.g., John Doe or Tech Store LLC"
                value={formData.customer}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Payment Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Payment Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="paymentMethod">Payment Method *</Label>
                <Select value={formData.paymentMethod} onValueChange={(value) => handleSelectChange('paymentMethod', value)}>
                  <SelectTrigger id="paymentMethod">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="paymentStatus">Payment Status *</Label>
                <Select value={formData.paymentStatus} onValueChange={(value) => handleSelectChange('paymentStatus', value)}>
                  <SelectTrigger id="paymentStatus">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="partial">Partial</SelectItem>
                  </SelectContent>
                </Select>
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
              {loading ? 'Recording...' : 'Record Sale'}
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
