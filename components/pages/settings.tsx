'use client'

import { useState } from 'react'
import { Settings, Save, Download, Upload, Bell, Eye, Lock, Database, BarChart3, Zap } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export function SettingsPage() {
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your inventory system preferences and configurations</p>
      </div>

      {/* Save Notification */}
      {saved && (
        <Alert className="bg-green-50 border-green-200">
          <Zap className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-900">Saved Successfully</AlertTitle>
          <AlertDescription className="text-green-700">Your settings have been updated</AlertDescription>
        </Alert>
      )}

      {/* Settings Tabs */}
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full max-w-2xl grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>Update your company details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="company">Company Name</Label>
                  <Input id="company" defaultValue="Mobile Accessories Pro" />
                </div>
                <div>
                  <Label htmlFor="owner">Owner Name</Label>
                  <Input id="owner" defaultValue="Ali Khan" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="admin@mobilepro.com" />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" defaultValue="+1-555-0100" />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" defaultValue="123 Mobile Plaza, Tech City" />
                </div>
              </div>
              <Button onClick={handleSave} className="gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Configure alert settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded border">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Low Stock Alerts</p>
                      <p className="text-xs text-muted-foreground">Get notified when inventory is low</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-3 rounded border">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Daily Reports</p>
                      <p className="text-xs text-muted-foreground">Receive daily sales summary</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Inventory Settings */}
        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Stock Management</CardTitle>
              <CardDescription>Configure inventory control settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="reorder">Default Reorder Level</Label>
                  <Input id="reorder" type="number" defaultValue="50" />
                  <p className="text-xs text-muted-foreground mt-1">Minimum quantity before alert</p>
                </div>
                <div>
                  <Label htmlFor="threshold">Low Stock Alert Threshold (%)</Label>
                  <Input id="threshold" type="number" defaultValue="20" />
                  <p className="text-xs text-muted-foreground mt-1">Alert when stock drops below this %</p>
                </div>
                <div>
                  <Label htmlFor="leadtime">Supplier Lead Time (days)</Label>
                  <Input id="leadtime" type="number" defaultValue="7" />
                </div>
                <div>
                  <Label htmlFor="safety">Safety Stock Level (%)</Label>
                  <Input id="safety" type="number" defaultValue="10" />
                </div>
              </div>
              <Button onClick={handleSave} className="gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing Rules</CardTitle>
              <CardDescription>Set default pricing configurations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label htmlFor="wholesale-markup">Wholesale Markup (%)</Label>
                  <Input id="wholesale-markup" type="number" defaultValue="45" />
                </div>
                <div>
                  <Label htmlFor="retail-markup">Retail Markup (%)</Label>
                  <Input id="retail-markup" type="number" defaultValue="100" />
                </div>
                <div>
                  <Label htmlFor="tax">Tax Rate (%)</Label>
                  <Input id="tax" type="number" defaultValue="0" />
                </div>
              </div>
              <Button onClick={handleSave} className="gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Display Preferences</CardTitle>
              <CardDescription>Customize how you view information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="theme">Color Scheme</Label>
                  <Select defaultValue="system">
                    <SelectTrigger id="theme">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="date-format">Date Format</Label>
                  <Select defaultValue="mdy">
                    <SelectTrigger id="date-format">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select defaultValue="usd">
                    <SelectTrigger id="currency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD ($)</SelectItem>
                      <SelectItem value="eur">EUR (€)</SelectItem>
                      <SelectItem value="gbp">GBP (£)</SelectItem>
                      <SelectItem value="pkr">PKR (₨)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleSave} className="gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Table View Options</CardTitle>
              <CardDescription>Configure table display settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded border">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Show Extended Pricing</p>
                      <p className="text-xs text-muted-foreground">Display profit calculations in tables</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-3 rounded border">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Show Performance Metrics</p>
                      <p className="text-xs text-muted-foreground">Display KPIs in dashboard</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Backup Settings */}
        <TabsContent value="backup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>Backup and restore your inventory data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="bg-blue-50 border-blue-200">
                <Database className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-900">Local Storage</AlertTitle>
                <AlertDescription className="text-blue-700">
                  All data is automatically saved to your browser's local storage. Export regularly for backups.
                </AlertDescription>
              </Alert>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Export All Data
                </Button>
                <Button variant="outline" className="gap-2">
                  <Upload className="h-4 w-4" />
                  Import Data
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Danger Zone</CardTitle>
              <CardDescription>Irreversible actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="bg-red-50 border-red-200">
                <AlertTitle className="text-red-900">Reset All Data</AlertTitle>
                <AlertDescription className="text-red-700">
                  This will permanently delete all inventory data. This action cannot be undone.
                </AlertDescription>
              </Alert>
              <Button variant="destructive" disabled>
                Reset All Data
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Application Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Application</span>
                <span className="font-semibold">Mobile Accessories Inventory</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Version</span>
                <Badge>2.0.0</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Updated</span>
                <span className="font-semibold">November 17, 2024</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
