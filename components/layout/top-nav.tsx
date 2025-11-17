'use client'

import { Menu, Search, Bell, Sun, Moon, ChevronRight, LogOut, User, HelpCircle, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useState, useEffect } from 'react'

interface TopNavProps {
  onMobileMenuClick?: () => void
}

export function TopNav({ onMobileMenuClick }: TopNavProps) {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const isDarkMode = document.documentElement.classList.contains('dark')
    setIsDark(isDarkMode)
  }, [])

  const toggleTheme = () => {
    if (!mounted) return
    const html = document.documentElement
    html.classList.toggle('dark')
    setIsDark(!isDark)
  }

  return (
    <div className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 animate-fadeIn">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        {/* Left Side */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden transition-smooth hover:bg-muted"
            onClick={onMobileMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="hidden md:flex items-center gap-1 text-sm text-muted-foreground">
            <span>Home</span>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium">Dashboard</span>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden md:block relative">
            <Input
              placeholder="Search... ⌘K"
              className="w-64 pl-10 transition-smooth focus:ring-2 focus:ring-primary"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="relative transition-smooth hover:bg-muted">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-info animate-pulse-slow">
                  12
                </Badge>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 animate-scaleIn">
              <div className="space-y-4">
                <h4 className="font-semibold">Notifications</h4>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {[
                    { title: 'Low Stock Alert', description: 'Phone Case Blue is below reorder level', type: 'warning' },
                    { title: 'Sale Recorded', description: 'Invoice INV-20241116-045 completed', type: 'success' },
                    { title: 'Stock Added', description: '50 units added to Screen Protector', type: 'info' },
                  ].map((notif, i) => (
                    <div key={i} className="p-3 rounded-lg hover:bg-muted cursor-pointer transition-smooth border border-transparent hover:border-border animate-slideUp" style={{animationDelay: `${i * 50}ms`}}>
                      <p className="text-sm font-medium">{notif.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{notif.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="transition-smooth hover:bg-muted"
          >
            {isDark ? (
              <Sun className="h-5 w-5 transition-transform duration-300 rotate-0" />
            ) : (
              <Moon className="h-5 w-5 transition-transform duration-300 rotate-0" />
            )}
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2 transition-smooth hover:bg-muted">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground text-xs font-semibold">
                    AD
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="animate-scaleIn">
              <DropdownMenuItem className="transition-smooth">
                <User className="h-4 w-4 mr-2" />
                View Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="transition-smooth">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="transition-smooth">
                <HelpCircle className="h-4 w-4 mr-2" />
                Help
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive transition-smooth">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
