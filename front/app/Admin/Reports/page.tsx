'use client'
import { useEffect, useState } from 'react'
import eventService from '../../services/Offres'
import SidBar from '../../components/Admin/SideBar'
import reportService from '@/app/services/Report'
import Reports from '@/app/components/Admin/Reports'

export default function ReportPage() {
  const [reports, setReport] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchReports = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await reportService.getReports(); 
      setReport(data)
    } catch (err) {
      setError('Failed to load reports')
      console.error('Error fetching reports:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchReports()
  }, [])

  const handleRefresh = () => {
    fetchReports()
  }

  return (
    <>
    <Reports 
        reports={reports}
        isLoading={isLoading}
        error={error}
        onRefresh={handleRefresh} onDelete={function (reportId: string): void {
          throw new Error('Function not implemented.')
        } }    />
    </>
  )
}