'use client'
import { useEffect, useState } from 'react'
import Offres from '../../components/Admin/Offres'
import eventService from '../../services/Offres'


export default function OffrePage() {
  const [offres, setOffres] = useState<Offer[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOffres = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await eventService.getOffres2()
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
    <Offres 
      offres={offres} 
      isLoading={isLoading} 
      error={error}
      onRefresh={handleRefresh}
    />
  )
}