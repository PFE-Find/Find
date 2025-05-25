'use client'
import { useEffect, useState } from 'react'
import eventService from '../../services/Offres'
import SidBar from '../../components/Admin/SideBar'
import Commentervice from '@/app/services/Comment'
import Comment from '@/app/components/Admin/Comment'

export default function CommentPage() {
  const [comments, setReport] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

 

  return (
    <>
    <Comment />
    </>
  )
}