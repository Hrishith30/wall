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
    from: () => ({
      select: () => Promise.resolve({ data: [], error: null }),
      insert: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      order: () => Promise.resolve({ data: [], error: null })
    }),
    storage: {
      from: () => ({
        upload: () => Promise.resolve({ error: { message: 'Supabase not configured' } }),
        getPublicUrl: () => ({ data: { publicUrl: '' } })
      })
    },
    channel: () => ({
      on: () => ({
        subscribe: () => ({})
      })
    }),
    removeChannel: () => {}
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