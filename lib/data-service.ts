import { Category, Warehouse, Product, Sale, InventoryTransaction, RestockOrder } from './types'

const STORAGE_KEYS = {
  PRODUCTS: 'inventory:products',
  SALES: 'inventory:sales',
  WAREHOUSES: 'inventory:warehouses',
  CATEGORIES: 'inventory:categories',
  INVENTORY_TRANSACTIONS: 'inventory:transactions',
  RESTOCK_ORDERS: 'inventory:restock-orders',
  ARCHIVED_PRODUCTS: 'inventory:archived-products',
  ARCHIVED_SALES: 'inventory:archived-sales',
  ARCHIVED_WAREHOUSES: 'inventory:archived-warehouses',
}

export function initializeData() {
  if (typeof window === 'undefined') return

  // Initialize categories - Mobile Accessories focused
  if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
    const categories: Category[] = [
      { id: '1', name: 'Chargers & Cables', color: '#3B82F6', icon: 'Zap' },
      { id: '2', name: 'Screen Protectors', color: '#A855F7', icon: 'Shield' },
      { id: '3', name: 'Phone Cases', color: '#EC4899', icon: 'Package' },
      { id: '4', name: 'Power Banks', color: '#F97316', icon: 'Battery' },
      { id: '5', name: 'Audio Accessories', color: '#22C55E', icon: 'Headphones' },
      { id: '6', name: 'Tempered Glass', color: '#06B6D4', icon: 'Square' },
      { id: '7', name: 'Phone Stands', color: '#8B5CF6', icon: 'Mountain' },
      { id: '8', name: 'Adapters & Hubs', color: '#EAB308', icon: 'Zap' },
    ]
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories))
  }

  // Initialize warehouses
  if (!localStorage.getItem(STORAGE_KEYS.WAREHOUSES)) {
    const warehouses: Warehouse[] = [
      {
        id: 'WH-001',
        name: 'Main Store',
        code: 'MS-001',
        location: 'Downtown',
        address: '123 Mobile Plaza, Tech City',
        manager: 'Ahmed Hassan',
        phone: '+1-555-0101',
        email: 'ahmed@store.com',
        capacity: 5000,
        used: 3245,
        isArchived: false,
      },
      {
        id: 'WH-002',
        name: 'Secondary Store',
        code: 'SS-002',
        location: 'Mall',
        address: '456 Tech Mall, Shopping Center',
        manager: 'Fatima Khan',
        phone: '+1-555-0102',
        email: 'fatima@store.com',
        capacity: 3000,
        used: 1890,
        isArchived: false,
      },
      {
        id: 'WH-003',
        name: 'Warehouse',
        code: 'WH-003',
        location: 'Industrial Area',
        address: '789 Logistics St, Business Zone',
        manager: 'Mike Johnson',
        phone: '+1-555-0103',
        email: 'mike@store.com',
        capacity: 8000,
        used: 4108,
        isArchived: false,
      },
    ]
    localStorage.setItem(STORAGE_KEYS.WAREHOUSES, JSON.stringify(warehouses))
  }

  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    const products: Product[] = [
      { id: '1', name: 'USB-C Fast Charger 65W', categoryId: '1', warehouseId: 'WH-001', sku: 'UFC-65W-001', barcode: 'BAR001', purchasePrice: 15, wholesalePrice: 22, retailPrice: 35, quantity: 145, unit: 'Piece', date: '2024-11-15', reorderLevel: 50, costOfGoodsSold: 1500, unitsSold: 100, lastRestockDate: '2024-11-10', isArchived: false },
      { id: '2', name: 'Lightning Cable 2M', categoryId: '1', warehouseId: 'WH-001', sku: 'LC-2M-002', barcode: 'BAR002', purchasePrice: 3, wholesalePrice: 5, retailPrice: 8.99, quantity: 523, unit: 'Piece', date: '2024-11-14', reorderLevel: 200, costOfGoodsSold: 450, unitsSold: 150, lastRestockDate: '2024-11-08', isArchived: false },
      { id: '3', name: 'Screen Protector Tempered Glass', categoryId: '2', warehouseId: 'WH-002', sku: 'SP-TG-003', barcode: 'BAR003', purchasePrice: 1.5, wholesalePrice: 3, retailPrice: 5.99, quantity: 1200, unit: 'Pack', date: '2024-11-13', reorderLevel: 400, costOfGoodsSold: 600, unitsSold: 400, lastRestockDate: '2024-11-12', isArchived: false },
      { id: '4', name: 'Silicone Phone Case', categoryId: '3', warehouseId: 'WH-001', sku: 'SPC-001', barcode: 'BAR004', purchasePrice: 2.5, wholesalePrice: 4.5, retailPrice: 7.99, quantity: 890, unit: 'Piece', date: '2024-11-12', reorderLevel: 300, costOfGoodsSold: 1000, unitsSold: 400, lastRestockDate: '2024-11-09', isArchived: false },
      { id: '5', name: 'Power Bank 20000mAh', categoryId: '4', warehouseId: 'WH-003', sku: 'PB-20K-005', barcode: 'BAR005', purchasePrice: 18, wholesalePrice: 25, retailPrice: 39.99, quantity: 234, unit: 'Piece', date: '2024-11-11', reorderLevel: 75, costOfGoodsSold: 900, unitsSold: 50, lastRestockDate: '2024-11-07', isArchived: false },
      { id: '6', name: 'Wireless Earbuds', categoryId: '5', warehouseId: 'WH-002', sku: 'WEB-001', barcode: 'BAR006', purchasePrice: 25, wholesalePrice: 35, retailPrice: 54.99, quantity: 156, unit: 'Pair', date: '2024-11-10', reorderLevel: 40, costOfGoodsSold: 1500, unitsSold: 60, lastRestockDate: '2024-11-05', isArchived: false },
      { id: '7', name: 'Tempered Glass 9H', categoryId: '6', warehouseId: 'WH-001', sku: 'TG-9H-007', barcode: 'BAR007', purchasePrice: 2, wholesalePrice: 3.5, retailPrice: 6.99, quantity: 2100, unit: 'Pack', date: '2024-11-09', reorderLevel: 600, costOfGoodsSold: 800, unitsSold: 400, lastRestockDate: '2024-11-06', isArchived: false },
      { id: '8', name: 'Phone Stand Aluminum', categoryId: '7', warehouseId: 'WH-003', sku: 'PSA-001', barcode: 'BAR008', purchasePrice: 8, wholesalePrice: 12, retailPrice: 18.99, quantity: 267, unit: 'Piece', date: '2024-11-08', reorderLevel: 80, costOfGoodsSold: 400, unitsSold: 50, lastRestockDate: '2024-11-04', isArchived: false },
      { id: '9', name: 'USB-C Hub 7-in-1', categoryId: '8', warehouseId: 'WH-001', sku: 'UCH-7-009', barcode: 'BAR009', purchasePrice: 22, wholesalePrice: 32, retailPrice: 49.99, quantity: 89, unit: 'Piece', date: '2024-11-07', reorderLevel: 30, costOfGoodsSold: 660, unitsSold: 30, lastRestockDate: '2024-11-03', isArchived: false },
      { id: '10', name: 'Screen Protector (Glass) iPhone', categoryId: '2', warehouseId: 'WH-002', sku: 'SPG-IP-010', barcode: 'BAR010', purchasePrice: 2.5, wholesalePrice: 4, retailPrice: 7.99, quantity: 756, unit: 'Pack', date: '2024-11-06', reorderLevel: 250, costOfGoodsSold: 750, unitsSold: 300, lastRestockDate: '2024-11-02', isArchived: false },
      { id: '11', name: 'Leather Phone Case Premium', categoryId: '3', warehouseId: 'WH-003', sku: 'LPC-PM-011', barcode: 'BAR011', purchasePrice: 8, wholesalePrice: 12, retailPrice: 19.99, quantity: 178, unit: 'Piece', date: '2024-11-05', reorderLevel: 50, costOfGoodsSold: 560, unitsSold: 70, lastRestockDate: '2024-11-01', isArchived: false },
      { id: '12', name: 'Charging Dock Wireless', categoryId: '1', warehouseId: 'WH-001', sku: 'CDW-001', barcode: 'BAR012', purchasePrice: 20, wholesalePrice: 28, retailPrice: 44.99, quantity: 123, unit: 'Piece', date: '2024-11-04', reorderLevel: 40, costOfGoodsSold: 600, unitsSold: 30, lastRestockDate: '2024-10-31', isArchived: false },
      { id: '13', name: 'Phone Ring Stand', categoryId: '7', warehouseId: 'WH-002', sku: 'PRS-001', barcode: 'BAR013', purchasePrice: 3, wholesalePrice: 5, retailPrice: 8.99, quantity: 534, unit: 'Piece', date: '2024-11-03', reorderLevel: 150, costOfGoodsSold: 450, unitsSold: 150, lastRestockDate: '2024-10-29', isArchived: false },
      { id: '14', name: 'Type-C Data Cable', categoryId: '1', warehouseId: 'WH-003', sku: 'TCC-001', barcode: 'BAR014', purchasePrice: 2.5, wholesalePrice: 4, retailPrice: 6.99, quantity: 1245, unit: 'Piece', date: '2024-11-02', reorderLevel: 400, costOfGoodsSold: 750, unitsSold: 300, lastRestockDate: '2024-10-28', isArchived: false },
      { id: '15', name: 'Matte Screen Protector', categoryId: '2', warehouseId: 'WH-001', sku: 'MSP-001', barcode: 'BAR015', purchasePrice: 1.8, wholesalePrice: 3.2, retailPrice: 5.99, quantity: 890, unit: 'Pack', date: '2024-11-01', reorderLevel: 300, costOfGoodsSold: 540, unitsSold: 300, lastRestockDate: '2024-10-26', isArchived: false },
    ]
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products))
  }

  if (!localStorage.getItem(STORAGE_KEYS.SALES)) {
    const sales: Sale[] = [
      { id: '1', invoiceNo: 'INV-20241116-001', date: '2024-11-16 14:30', productId: '1', customer: 'Ali Khan', saleType: 'retail', quantity: 2, unitPrice: 35, totalAmount: 70, paymentMethod: 'cash', paymentStatus: 'paid', warehouseId: 'WH-001', isArchived: false },
      { id: '2', invoiceNo: 'INV-20241116-002', date: '2024-11-16 11:15', productId: '2', customer: 'Tech Store LLC', saleType: 'wholesale', quantity: 50, unitPrice: 5, totalAmount: 250, paymentMethod: 'card', paymentStatus: 'paid', warehouseId: 'WH-001', isArchived: false },
      { id: '3', invoiceNo: 'INV-20241116-003', date: '2024-11-16 09:45', productId: '3', customer: 'Mobile Mart', saleType: 'wholesale', quantity: 100, unitPrice: 3, totalAmount: 300, paymentMethod: 'bank_transfer', paymentStatus: 'paid', warehouseId: 'WH-002', isArchived: false },
      { id: '4', invoiceNo: 'INV-20241115-001', date: '2024-11-15 16:20', productId: '4', customer: 'Walk-in', saleType: 'retail', quantity: 5, unitPrice: 7.99, totalAmount: 39.95, paymentMethod: 'card', paymentStatus: 'paid', warehouseId: 'WH-001', isArchived: false },
      { id: '5', invoiceNo: 'INV-20241115-002', date: '2024-11-15 14:10', productId: '5', customer: 'City Electronics', saleType: 'wholesale', quantity: 20, unitPrice: 25, totalAmount: 500, paymentMethod: 'cash', paymentStatus: 'paid', warehouseId: 'WH-003', isArchived: false },
    ]
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales))
  }

  if (!localStorage.getItem(STORAGE_KEYS.INVENTORY_TRANSACTIONS)) {
    const transactions: InventoryTransaction[] = []
    localStorage.setItem(STORAGE_KEYS.INVENTORY_TRANSACTIONS, JSON.stringify(transactions))
  }

  if (!localStorage.getItem(STORAGE_KEYS.RESTOCK_ORDERS)) {
    const restockOrders: RestockOrder[] = []
    localStorage.setItem(STORAGE_KEYS.RESTOCK_ORDERS, JSON.stringify(restockOrders))
  }
}

export function getProducts(includeArchived = false): Product[] {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS)
  const products = data ? JSON.parse(data) : []
  if (includeArchived) return products
  return products.filter((p: Product) => p.isArchived !== true)
}

export function getSales(includeArchived = false): Sale[] {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(STORAGE_KEYS.SALES)
  const sales = data ? JSON.parse(data) : []
  if (includeArchived) return sales
  return sales.filter((s: Sale) => s.isArchived !== true)
}

export function getWarehouses(includeArchived = false): Warehouse[] {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(STORAGE_KEYS.WAREHOUSES)
  const warehouses = data ? JSON.parse(data) : []
  if (includeArchived) return warehouses
  return warehouses.filter((w: Warehouse) => w.isArchived !== true)
}

export function getCategories(): Category[] {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES)
  return data ? JSON.parse(data) : []
}

export function saveProduct(product: Product) {
  if (typeof window === 'undefined') return
  const products = getProducts()
  const index = products.findIndex(p => p.id === product.id)
  if (index >= 0) {
    products[index] = product
  } else {
    products.push(product)
  }
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products))
}

export function deleteProduct(id: string) {
  if (typeof window === 'undefined') return
  const products = getProducts()
  const filtered = products.filter(p => p.id !== id)
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(filtered))
}

export function saveSale(sale: Sale) {
  if (typeof window === 'undefined') return
  const sales = getSales()
  const index = sales.findIndex(s => s.id === sale.id)
  if (index >= 0) {
    sales[index] = sale
  } else {
    sales.push(sale)
  }
  localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales))
}

export function archiveSale(id: string) {
  if (typeof window === 'undefined') return
  const sales = getSales()
  const sale = sales.find(s => s.id === id)
  if (sale) {
    sale.isArchived = true
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales))
  }
}

export function getArchivedSales(): Sale[] {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(STORAGE_KEYS.SALES)
  const sales = data ? JSON.parse(data) : []
  return sales.filter((s: Sale) => s.isArchived === true)
}

export function unarchiveSale(id: string) {
  if (typeof window === 'undefined') return
  const sales = getSales()
  const sale = sales.find(s => s.id === id)
  if (sale) {
    sale.isArchived = false
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales))
  }
}

export function permanentlyDeleteSale(id: string) {
  if (typeof window === 'undefined') return
  const sales = getSales()
  const filtered = sales.filter(s => s.id !== id)
  localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(filtered))
}

export function archiveWarehouse(id: string) {
  if (typeof window === 'undefined') return
  const warehouses = getWarehouses()
  const warehouse = warehouses.find(w => w.id === id)
  if (warehouse) {
    warehouse.isArchived = true
    localStorage.setItem(STORAGE_KEYS.WAREHOUSES, JSON.stringify(warehouses))
  }
}

export function getArchivedWarehouses(): Warehouse[] {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(STORAGE_KEYS.WAREHOUSES)
  const warehouses = data ? JSON.parse(data) : []
  return warehouses.filter((w: Warehouse) => w.isArchived === true)
}

export function unarchiveWarehouse(id: string) {
  if (typeof window === 'undefined') return
  const warehouses = getWarehouses()
  const warehouse = warehouses.find(w => w.id === id)
  if (warehouse) {
    warehouse.isArchived = false
    localStorage.setItem(STORAGE_KEYS.WAREHOUSES, JSON.stringify(warehouses))
  }
}

export function permanentlyDeleteWarehouse(id: string) {
  if (typeof window === 'undefined') return
  const warehouses = getWarehouses()
  const filtered = warehouses.filter(w => w.id !== id)
  localStorage.setItem(STORAGE_KEYS.WAREHOUSES, JSON.stringify(filtered))
}

export function getAllProducts(includeArchived = false): Product[] {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS)
  const products = data ? JSON.parse(data) : []
  if (includeArchived) return products
  return products.filter((p: Product) => p.isArchived !== true)
}

export function getActiveProducts(): Product[] {
  return getAllProducts(false)
}

export function archiveProduct(id: string) {
  if (typeof window === 'undefined') return
  const products = getProducts(true) // Get all products including archived
  const product = products.find(p => p.id === id)
  if (product) {
    product.isArchived = true
    // Store all products (both active and archived)
    const allProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS)
    const allProdsArray = allProducts ? JSON.parse(allProducts) : []
    const index = allProdsArray.findIndex((p: Product) => p.id === id)
    if (index >= 0) {
      allProdsArray[index] = product
    }
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(allProdsArray))
  }
}

export function getArchivedProducts(): Product[] {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS)
  const products = data ? JSON.parse(data) : []
  return products.filter((p: Product) => p.isArchived === true)
}

export function unarchiveProduct(id: string) {
  if (typeof window === 'undefined') return
  const allProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS)
  const products = allProducts ? JSON.parse(allProducts) : []
  const product = products.find((p: Product) => p.id === id)
  if (product) {
    product.isArchived = false
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products))
  }
}

export function permanentlyDeleteProduct(id: string) {
  if (typeof window === 'undefined') return
  const allProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS)
  const products = allProducts ? JSON.parse(allProducts) : []
  const filtered = products.filter((p: Product) => p.id !== id)
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(filtered))
}

export function recordSale(sale: Sale) {
  if (typeof window === 'undefined') return

  // Save the sale
  const sales = getSales(true)
  sales.push(sale)
  localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales))

  // Update product quantity
  const products = getProducts(true)
  const product = products.find(p => p.id === sale.productId)
  if (product) {
    product.quantity -= sale.quantity
    product.unitsSold += sale.quantity
    product.costOfGoodsSold += sale.quantity * product.purchasePrice
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products))

    // Record inventory transaction
    recordInventoryTransaction({
      id: `TXN-${Date.now()}`,
      productId: sale.productId,
      type: 'sale',
      quantity: sale.quantity,
      unitPrice: product.purchasePrice,
      totalPrice: sale.quantity * product.purchasePrice,
      date: sale.date,
      reason: `Sale: ${sale.invoiceNo}`,
      relatedSaleId: sale.id,
    })
  }
}

export function recordInventoryTransaction(transaction: InventoryTransaction) {
  if (typeof window === 'undefined') return
  const transactions = getInventoryTransactions()
  transactions.push(transaction)
  localStorage.setItem(STORAGE_KEYS.INVENTORY_TRANSACTIONS, JSON.stringify(transactions))
}

export function getInventoryTransactions(): InventoryTransaction[] {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(STORAGE_KEYS.INVENTORY_TRANSACTIONS)
  return data ? JSON.parse(data) : []
}

export function restockProduct(productId: string, quantity: number, costPerUnit: number) {
  if (typeof window === 'undefined') return

  const products = getProducts(true)
  const product = products.find(p => p.id === productId)
  if (product) {
    const oldQuantity = product.quantity
    product.quantity += quantity
    product.lastRestockDate = new Date().toISOString().split('T')[0]
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products))

    recordInventoryTransaction({
      id: `TXN-${Date.now()}`,
      productId,
      type: 'purchase',
      quantity,
      unitPrice: costPerUnit,
      totalPrice: quantity * costPerUnit,
      date: new Date().toISOString().split('T')[0],
      reason: `Restock: ${oldQuantity} → ${product.quantity}`,
    })
  }
}

export function getLowStockItems(): Product[] {
  const products = getProducts()
  return products.filter(p => p.quantity <= p.reorderLevel)
}

export function getStockTurnover(productId: string): number {
  const product = getProducts(true).find(p => p.id === productId)
  if (!product || product.costOfGoodsSold === 0) return 0
  return product.costOfGoodsSold / (product.quantity * product.purchasePrice || 1)
}

// Category management functions
export function saveCategory(category: Category) {
  if (typeof window === 'undefined') return
  const categories = getCategories()
  const index = categories.findIndex(c => c.id === category.id)
  if (index >= 0) {
    categories[index] = category
  } else {
    categories.push(category)
  }
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories))
}

export function deleteCategory(id: string) {
  if (typeof window === 'undefined') return
  const categories = getCategories()
  const filtered = categories.filter(c => c.id !== id)
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(filtered))
}

export function getCategoryById(id: string): Category | undefined {
  const categories = getCategories()
  return categories.find(c => c.id === id)
}
