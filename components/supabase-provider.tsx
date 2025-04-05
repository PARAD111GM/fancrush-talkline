'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase-browser'
import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/lib/supabase-types'

type SupabaseContext = {
  supabase: SupabaseClient<Database>
}

const Context = createContext<SupabaseContext | undefined>(undefined)

export default function SupabaseProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [supabase] = useState(() => createBrowserSupabaseClient())

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      // Refresh the page on auth state change
      // This is a simple approach - in a real app you might want to
      // be more selective about which parts of the UI to update
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  return (
    <Context.Provider value={{ supabase }}>
      {children}
    </Context.Provider>
  )
}

export const useSupabase = () => {
  const context = useContext(Context)
  if (context === undefined) {
    throw new Error('useSupabase must be used inside SupabaseProvider')
  }
  return context
} 