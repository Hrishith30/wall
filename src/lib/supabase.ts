import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabaseInstance: SupabaseClient | null = null

export const getSupabaseClient = (): SupabaseClient => {
  if (!supabaseInstance) {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      console.error('Supabase client cannot be initialized on the server side')
      return createMockClient()
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase environment variables')
      return createMockClient()
    }
    
    try {
      supabaseInstance = createClient(supabaseUrl, supabaseKey)
    } catch (error) {
      console.error('Failed to create Supabase client:', error)
      return createMockClient()
    }
  }
  
  return supabaseInstance
}

const createMockClient = () => {
  return {
    from: (table: string) => ({
      select: (columns?: string) => ({
        order: (column: string, options?: { ascending?: boolean }) => 
          Promise.resolve({ data: [], error: { message: 'Supabase not configured' } })
      }),
      insert: (data: any) => ({
        select: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } })
      })
    }),
    storage: {
      from: (bucket: string) => ({
        upload: (path: string, file: File) => 
          Promise.resolve({ error: { message: 'Supabase not configured' } }),
        getPublicUrl: (path: string) => ({ data: { publicUrl: '' } })
      })
    },
    channel: (name: string) => ({
      on: (event: string, filter: any, callback: any) => ({
        subscribe: () => ({})
      })
    }),
    removeChannel: (channel: any) => {}
  } as any
}

// Export a function that returns the client instead of the client directly
export const supabase = getSupabaseClient

export interface Post {
  id: string
  user_id: string | null
  body: string
  image_url?: string | null
  created_at: string
} 