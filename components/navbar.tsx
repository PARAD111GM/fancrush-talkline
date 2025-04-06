"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useSupabase } from "./supabase-provider"

export function NavBar() {
  const pathname = usePathname()
  const { supabase } = useSupabase()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setIsLoggedIn(!!session)
      setLoading(false)
    }
    
    checkAuth()
  }, [supabase])
  
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
            {!loading && (
              <>
                {isLoggedIn ? (
                  <>
                    <Link href="/account">
                      <Button variant="outline" className="hidden md:flex">
                        My Account
                      </Button>
                    </Link>
                    <Button variant="secondary" onClick={signOut}>
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login">
                      <Button variant="outline" className="hidden md:flex">
                        Sign in
                      </Button>
                    </Link>
                    <Button>
                      <Link href="/register">Get Started</Link>
                    </Button>
                  </>
                )}
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
} 