'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase, Post } from '@/lib/supabase'
import { Share, Image as ImageIcon, User, Calendar, MapPin, Heart, MessageCircle, Share2, X } from 'lucide-react'

// Force dynamic rendering to prevent static generation issues
export const dynamic = 'force-dynamic'

export default function Home() {
  const [message, setMessage] = useState('')
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Fetch posts on component mount
  useEffect(() => {
    fetchPosts().finally(() => {
      setIsPageLoading(false)
    })
  }, [])

  // Real-time subscription
  useEffect(() => {
    try {
      const client = supabase()
      const channel = client
        .channel('posts')
        .on('postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'posts' },
          (payload) => {
            setPosts(current => [payload.new as Post, ...current])
          }
        )
        .subscribe()

      return () => { 
        try {
          client.removeChannel(channel) 
        } catch (err) {
          console.error('Error removing channel:', err)
        }
      }
    } catch (err) {
      console.error('Error setting up real-time subscription:', err)
    }
  }, [])

  // Update current time every minute for time display
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 10000) // Update every minute

    return () => clearInterval(timer)
  }, [])

  const fetchPosts = async () => {
    try {
      const client = supabase()
      const { data, error } = await client
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        if (error.message === 'Supabase not configured') {
          setError('App is not properly configured. Please check environment variables.')
          setPosts([]) // Set empty posts array when not configured
        } else {
          setError(`Failed to load posts: ${error.message}`)
        }
        console.error('Error fetching posts:', error)
      } else if (data) {
        setPosts(data)
      } else {
        setPosts([])
      }
    } catch (err) {
      console.error('Exception in fetchPosts:', err)
      setError('Exception while fetching posts')
      setPosts([]) // Set empty posts array on exception
    }
  }

  const handleSubmit = async () => {
    if (!message.trim() && !selectedImage) return
    
    setIsLoading(true)
    setError('')
    
    try {
      let imageUrl = null
      
      // Upload image if selected
      if (selectedImage) {
        const client = supabase()
        const fileExt = selectedImage.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `post-images/${fileName}`
        
        const { error: uploadError } = await client.storage
          .from('post-images')
          .upload(filePath, selectedImage)
        
        if (uploadError) {
          setError(`Failed to upload image: ${uploadError.message}`)
          console.error('Error uploading image:', uploadError)
          setIsLoading(false)
          return
        }
        
        // Get public URL
        const { data: urlData } = client.storage
          .from('post-images')
          .getPublicUrl(filePath)
        
        imageUrl = urlData.publicUrl
      }
      
      // Create post with image URL if available
      const client = supabase()
      const { data, error } = await client
        .from('posts')
        .insert({ 
          body: message.trim(),
          image_url: imageUrl
        })
        .select()

      if (error) {
        setError(`Failed to post message: ${error.message}`)
        console.error('Error posting:', error)
      } else {
        setMessage('')
        setSelectedImage(null)
        setImagePreview(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
        // Refresh posts after successful post
        fetchPosts()
      }
    } catch (err) {
      console.error('Exception in post:', err)
      setError('Exception while posting')
    }
    setIsLoading(false)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const diffInMs = currentTime.getTime() - date.getTime()
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInDays < 7) return `${diffInDays}d ago`
    
    // Show full date and time for posts older than 7 days
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageDelete = () => {
    setSelectedImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleImageUploadClick = () => {
    fileInputRef.current?.click()
  }

  // Show loading screen while fetching initial data
  if (isPageLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Loading your wall...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-blue-600 text-white shadow-md shadow-black/20 rounded-b-lg">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-center">
            <h1 className="text-2xl font-bold">Wall</h1>
          </div>
        </div>
      </div>

      <div className="flex justify-between py-6" style={{ gap: '20px' }}>
        {/* Left Side - Profile Info */}
        <div className="w-80 flex-shrink-0" style={{ marginLeft: '15px' }}>
          <div className="bg-white rounded-lg shadow mb-4 overflow-hidden hover:shadow-blue-200 hover:shadow-lg transition-shadow duration-200">
              <div className="w-full aspect-square bg-blue-500 flex items-center justify-center overflow-hidden">
                <img 
                  src="/Hrishith.jpeg" 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to icon if image fails to load
                    const target = e.currentTarget as HTMLImageElement;
                    target.style.display = 'none';
                    const nextSibling = target.nextElementSibling as HTMLElement;
                    if (nextSibling) {
                      nextSibling.style.display = 'flex';
                    }
                  }}
                />
                <User className="w-20 h-20 text-white hidden" />
              </div>
              <div className="p-4 pb-10">
                <h3 className="font-semibold text-xl text-black mb-1">Hrishith M</h3>
                <a href="https://hrishith30.github.io/portfolio" className="text-blue-600 hover:text-blue-800 text-sm mb-4 block">View my profile</a>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Born on June 30, 2002</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">Lives in Columbia, MO</span>
                  </div>
                </div>
              </div>
            </div>


          </div>

          {/* Dividing Line */}
          <div className="w-px bg-gray-300 flex-shrink-0"></div>

          {/* Right Side - Wall Content */}
          <div className="flex-1" style={{ marginRight: '15px' }}>
            {/* Error Display */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Configuration Error
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error}</p>
                      {error.includes('environment variables') && (
                        <p className="mt-1">
                          This app requires Supabase configuration. Please check your environment variables.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Post Creation */}
            <div className="bg-white rounded-lg shadow p-4 mb-4">
              <div className="flex items-start space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <img 
                    src="/Hrishith.jpeg" 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      target.style.display = 'none';
                      const nextSibling = target.nextElementSibling as HTMLElement;
                      if (nextSibling) {
                        nextSibling.style.display = 'flex';
                      }
                    }}
                  />
                  <User className="w-5 h-5 text-white hidden" />
                </div>
                <div className="flex-1">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSubmit()
                      }
                    }}
                    placeholder="What's on your mind?"
                    className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 placeholder-font-medium text-black break-words whitespace-pre-wrap min-h-[120px] hover:border-blue-400 transition-colors duration-200"
                    rows={3}
                    maxLength={280}
                  />
                  
                  {/* Image Upload Box */}
                  <div className="mt-3">
                    <div 
                      onClick={handleImageUploadClick}
                      className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors duration-200 min-h-[120px] flex flex-col justify-center"
                    >
                      <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 text-sm">
                        Click to add photo (optional) <br />
                        JPG, PNG, GIF up to 5MB
                      </p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".jpg,.jpeg,.png,.gif,.webp"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                  </div>

                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="mt-3 relative">
                      <div className="relative inline-block">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="max-w-full max-h-64 rounded-lg object-cover"
                        />
                        <button
                          onClick={handleImageDelete}
                          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg transition-colors duration-200"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">
                        {message.length}/280
                      </span>
                    </div>
                    <button
                      onClick={handleSubmit}
                      disabled={(!message.trim() && !selectedImage) || isLoading}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2"
                    >
                      <Share className="w-4 h-4" />
                      <span>{isLoading ? 'Sharing...' : 'Share'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Posts Feed */}
            <div className="space-y-5">
              {posts.map((post) => (
                <div key={post.id} className="bg-white rounded-lg shadow p-5 hover:shadow-black/20 hover:shadow-xl transition-shadow duration-200">
                  <div className="flex items-start space-x-4 mb-3">
                    <div className="w-11 h-11 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                      <img 
                        src="/Hrishith.jpeg" 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          target.style.display = 'none';
                          const nextSibling = target.nextElementSibling as HTMLElement;
                          if (nextSibling) {
                            nextSibling.style.display = 'flex';
                          }
                        }}
                      />
                      <User className="w-5 h-5 text-white hidden" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="font-semibold text-base text-black">Hrishith M</span>
                        <span className="text-gray-500 text-sm">
                          {formatDate(post.created_at)}
                        </span>
                      </div>
                      {post.body && (
                        <p className="text-gray-800 text-base leading-relaxed mb-3 break-all whitespace-pre-wrap overflow-hidden">{post.body}</p>
                      )}
                      {post.image_url && (
                        <div className="mb-3">
                          <img 
                            src={post.image_url} 
                            alt="Post image" 
                            className="max-w-full max-h-96 rounded-lg object-cover"
                            onError={(e) => {
                              const target = e.currentTarget as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {posts.length === 0 && (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <p className="text-gray-500">No posts yet. Be the first to share something!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
  )
}
