'use client'
import { useEffect, useState } from 'react'
import Offres from '../../components/Admin/Offres'
import eventService from '../../services/Offres'
// Define this type (see below)
import SidBar from '../../components/Admin/SideBar'

export default function OffrePage() {
  const [offres, setOffres] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOffres = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await eventService.getOffres()
      setOffres(data)
    } catch (err) {
      setError('Failed to load offers')
      console.error('Error fetching offres:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchOffres()
  }, [])

  const handleRefresh = () => {
    fetchOffres()
  }

  return (
    <>
    <Offres 
      offres={offres} 
      isLoading={isLoading} 
      error={error}
      onRefresh={handleRefresh}
    />
    </>
  )
}