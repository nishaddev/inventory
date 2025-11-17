'use client'

import { useState } from 'react'
import { Trash2, Edit2, Plus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { getCategories, saveCategory, deleteCategory, getProducts } from '@/lib/data-service'
import { Category } from '@/lib/types'
import { AddCategoryForm } from '@/components/forms/add-category-form'

const ICONS = ['Zap', 'Shield', 'Package', 'Battery', 'Headphones', 'Square', 'Mountain', 'Users']
const COLORS = ['#3B82F6', '#A855F7', '#EC4899', '#F97316', '#22C55E', '#06B6D4', '#8B5CF6', '#EAB308', '#EF4444', '#14B8A6']

export function Categories() {
  const [categories, setCategories] = useState(() => getCategories())
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<Category>>({})
  const products = getProducts()

  const getCategoryProductCount = (categoryId: string) => {
    return products.filter(p => p.categoryId === categoryId && !p.isArchived).length
  }

  const handleEdit = (category: Category) => {
    setEditingId(category.id)
    setEditForm(category)
  }

  const handleSaveEdit = () => {
    if (editingId && editForm.name) {
      saveCategory({ ...editForm, id: editingId } as Category)
      setCategories(getCategories())
      setEditingId(null)
      setEditForm({})
    }
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this category? Products using this category will need reassignment.')) {
      deleteCategory(id)
      setCategories(getCategories())
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Category Management</h1>
          <p className="text-muted-foreground">Manage your product categories ({categories.length} total)</p>
        </div>
        <AddCategoryForm onCategoryAdded={() => setCategories(getCategories())} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map(category => {
          const productCount = getCategoryProductCount(category.id)
          return (
            <Card key={category.id} className="hover:shadow-lg transition-all duration-300 hover:border-blue-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: category.color }}
                    >
                      {category.icon.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                      <CardDescription className="text-xs">{category.icon}</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Products</span>
                  <Badge variant="secondary">{productCount}</Badge>
                </div>

                <div className="flex gap-2 pt-2 border-t">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-2"
                        onClick={() => handleEdit(category)}
                      >
                        <Edit2 className="h-4 w-4" />
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Edit Category</DialogTitle>
                        <DialogDescription>Update category details</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Category Name</Label>
                          <Input
                            value={editForm.name || ''}
                            onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Color</Label>
                          <div className="grid grid-cols-5 gap-2">
                            {COLORS.map(color => (
                              <button
                                key={color}
                                onClick={() => setEditForm(prev => ({ ...prev, color }))}
                                className={`h-10 rounded-lg border-2 transition-all ${
                                  editForm.color === color ? 'border-gray-800 scale-105' : 'border-transparent'
                                }`}
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-2 justify-end pt-4">
                          <Button variant="outline" onClick={() => setEditingId(null)}>Cancel</Button>
                          <Button onClick={handleSaveEdit} className="bg-gradient-to-r from-blue-500 to-blue-600">Save</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex-1 gap-2"
                    onClick={() => handleDelete(category.id)}
                    disabled={productCount > 0}
                    title={productCount > 0 ? 'Cannot delete category with products' : ''}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {categories.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Plus className="h-12 w-12 text-muted-foreground mb-3" />
            <h3 className="font-semibold">No categories yet</h3>
            <p className="text-sm text-muted-foreground">Create your first category to get started</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
