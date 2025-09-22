'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Person } from '@/lib/supabase'
import { AuthButton } from '@/components/AuthButton'

export default function Home() {
  const { data: session, status } = useSession()
  const [people, setPeople] = useState<Person[]>([])
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Fetch people when user is authenticated
  useEffect(() => {
    if (session?.user) {
      fetchPeople()
    }
  }, [session])

  const fetchPeople = async () => {
    if (!session?.user) return
    
    try {
      const response = await fetch('/api/people')
      const data = await response.json()
      
      if (response.ok) {
        setPeople(data.people || [])
      } else {
        setError(data.error || 'Failed to fetch people')
      }
    } catch {
      setError('Failed to fetch people')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!session?.user) {
      setError('Please sign in to add contacts')
      return
    }
    
    if (!name.trim()) {
      setError('Please enter a name')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/people', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name: name.trim(),
          company: company.trim() || null
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setPeople([data.person, ...people])
        setName('')
        setCompany('')
      } else {
        setError(data.error || 'Failed to add person')
      }
    } catch {
      setError('Failed to add person')
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                NetworkCrown
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Your simple CRM for better relationships
              </p>
            </div>
            <AuthButton />
          </div>
        </header>

        {!session?.user ? (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Welcome to NetworkCrown
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Sign in with Google to start building better professional relationships. 
                Keep track of your contacts and never lose touch with important connections.
              </p>
              <div className="flex justify-center">
                <AuthButton />
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Add Person Form */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              Add New Contact
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter person's name"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    disabled={isLoading}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Company name (optional)"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    disabled={isLoading}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {isLoading ? 'Adding...' : 'Add Contact'}
              </button>
            </form>
            {error && (
              <p className="mt-4 text-red-600 dark:text-red-400">
                {error}
              </p>
            )}
          </div>

            {/* People List */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                Your Contacts ({people.length})
              </h2>
              
              {people.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  No contacts added yet. Add someone above to get started!
                </p>
              ) : (
                <div className="space-y-3">
                  {people.map((person) => (
                    <div
                      key={person.id}
                      className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {person.name}
                        </h3>
                        {person.company && (
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {person.company}
                          </p>
                        )}
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Added on {new Date(person.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
