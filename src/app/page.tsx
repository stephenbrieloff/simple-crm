'use client'

import { useState, useEffect } from 'react'
import { Person } from '@/lib/supabase'

export default function Home() {
  const [people, setPeople] = useState<Person[]>([])
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Fetch people on component mount
  useEffect(() => {
    fetchPeople()
  }, [])

  const fetchPeople = async () => {
    try {
      const response = await fetch('/api/people')
      const data = await response.json()
      
      if (response.ok) {
        setPeople(data.people)
      } else {
        setError(data.error || 'Failed to fetch people')
      }
    } catch (err) {
      setError('Failed to fetch people')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
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
        body: JSON.stringify({ name: name.trim() }),
      })

      const data = await response.json()

      if (response.ok) {
        setPeople([data.person, ...people])
        setName('')
      } else {
        setError(data.error || 'Failed to add person')
      }
    } catch (err) {
      setError('Failed to add person')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Simple CRM
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Add people to your contact list and view them below
          </p>
        </header>

        {/* Add Person Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
            Add New Person
          </h2>
          <form onSubmit={handleSubmit} className="flex gap-4 items-end">
            <div className="flex-1">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter person's name"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {isLoading ? 'Adding...' : 'Add Person'}
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
            People ({people.length})
          </h2>
          
          {people.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              No people added yet. Add someone above to get started!
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
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Added on {new Date(person.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-sm text-gray-400 dark:text-gray-500">
                    ID: {person.id}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
  );
}
