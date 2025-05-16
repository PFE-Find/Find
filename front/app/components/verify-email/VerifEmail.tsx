'use client'

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { verifyEmail } from "@/lib/api" // You'll need to implement this API call
import VerificationService from "@/app/services/VerificationToken"

export default function VerifyEmailForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    if (!token) {
      setStatus('error')
      setError('Missing verification token')
      return
    }

    const verify = async () => {
      try {
        setStatus('loading')
        await VerificationService.verifyEmail(token)
        setStatus('success')
      } catch (err) {
        setStatus('error')
        setError(err instanceof Error ? err.message : 'Verification failed')
      }
    }

    verify()
  }, [token])

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center">Verify Your Email</h1>
      
      {status === 'loading' && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
          <p>Verifying your email...</p>
        </div>
      )}

      {status === 'success' && (
        <div className="p-4 bg-green-100 text-green-700 rounded-md">
          <h2 className="font-bold mb-2">Email Verified Successfully!</h2>
          <p>Your email address has been confirmed. You can now access all features.</p>
          <a 
            href="/signin" 
            className="mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
          >
            Go to Sign-In
          </a>
        </div>
      )}

      {status === 'error' && (
        <div className="p-4 bg-red-100 text-red-700 rounded-md">
          <h2 className="font-bold mb-2">Verification Failed</h2>
          <p>{error || 'There was an error verifying your email.'}</p>
          <div className="mt-4 space-y-2">
            <p>You can try:</p>
            <ul className="list-disc pl-5">
              <li>Checking if the verification link is correct</li>
              <li>Requesting a new verification email</li>
              <li>Contacting support if the problem persists</li>
            </ul>
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 transition"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  )
}