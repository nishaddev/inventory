'use client'

import { useState, useEffect } from 'react'
import { AppShell } from '@/components/layout/app-shell'
import { Dashboard } from '@/components/pages/dashboard'
import { Products } from '@/components/pages/products'
import { Sales } from '@/components/pages/sales'
import { Warehouses } from '@/components/pages/warehouses'
import { Reports } from '@/components/pages/reports'
import { Archive } from '@/components/pages/archive'
import { Categories } from '@/components/pages/categories'
import { SettingsPage } from '@/components/pages/settings'
import { initializeData } from '@/lib/data-service'

export default function Home() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [mounted, setMounted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      initializeData()
      setMounted(true)
    } catch (err) {
      setError(`Error initializing: ${err}`)
      setMounted(true)
    }
  }, [])

  if (!mounted) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-xl font-semibold">Loading InventoryPro...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-background">
        <div className="text-center text-red-500">
          <p className="text-lg font-semibold">{error}</p>
        </div>
      </div>
    )
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />
      case 'products':
        return <Products />
      case 'sales':
        return <Sales />
      case 'warehouses':
        return <Warehouses />
      case 'categories':
        return <Categories />
      case 'reports':
        return <Reports />
      case 'archive':
        return <Archive />
      case 'settings':
        return <SettingsPage />
      default:
        return <Dashboard />
    }
  }

  return (
    <AppShell currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </AppShell>
  )
}
