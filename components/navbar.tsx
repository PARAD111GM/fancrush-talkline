"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useSupabase } from "./supabase-provider"

export function NavBar() {
  const pathname = usePathname()
  const { supabase } = useSupabase()
  
  const signOut = async () => {
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex">
          <Link href="/" className="flex items-center mr-6">
            <span className="font-bold text-xl">Fancrush</span>
            <span className="ml-2 text-sm text-muted-foreground">Talkline</span>
          </Link>
          <nav className="flex items-center space-x-4 lg:space-x-6 hidden md:flex">
            <Link
              href="/influencers"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/influencers"
                  ? "text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              Influencers
            </Link>
            <Link
              href="/pricing"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/pricing"
                  ? "text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/about"
                  ? "text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              About
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <Link href="/login">
              <Button variant="outline" className="hidden md:flex">
                Sign in
              </Button>
            </Link>
            <Button>
              <Link href="/register">Get Started</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
} 