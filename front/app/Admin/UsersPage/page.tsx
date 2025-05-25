'use client'
import { useEffect, useState } from 'react'
import Users from '../../components/Admin/Users'
import UserstService from '../../services/User'


export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await UserstService.getUsers()
      setUsers(data)
    } catch (err) {
      setError('Failed to load users')
      console.error('Error fetching users:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleRefresh = () => {
    fetchUsers()
  }

  return (
    <Users 
      users={users}
      isLoading={isLoading}
      error={error}
      onRefresh={handleRefresh} onEdit={function (userId: string): void {
        throw new Error('Function not implemented.')
      } } onDelete={function (userId: string): void {
        throw new Error('Function not implemented.')
      } }    />
  )
}