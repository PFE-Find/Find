'use client'

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { verifyEmail } from "@/lib/api"
import VerificationService from "@/app/services/VerificationToken"

export default function VerifyEmailForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    if (!token) {
      setStatus('error')
      setError('Token de vérification manquant')
      return
    }

    const verify = async () => {
      try {
        setStatus('loading')
        await VerificationService.verifyEmail(token)
        setStatus('success')
      } catch (err) {
        setStatus('error')
        setError(err instanceof Error ? err.message : 'Échec de la vérification')
      }
    }

    verify()
  }, [token])

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col  p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-sm sm:shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-teal-600 p-4 text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-white">Vérification d'Email</h1>
          <p className="text-teal-100 text-sm sm:text-base">Confirmation de votre adresse email</p>
        </div>

        <div className="p-5 sm:p-8 space-y-6">
          {/* Loading State */}
          {status === 'loading' && (
            <div className="text-center py-6 space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent mx-auto"></div>
              <p className="text-gray-600 text-sm sm:text-base">Vérification en cours...</p>
            </div>
          )}

          {/* Success State */}
          {status === 'success' && (
            <div className="text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-teal-700 mb-2">Email vérifié avec succès !</h2>
              <p className="text-teal-600 text-sm sm:text-base mb-6">Votre adresse email a été confirmée.</p>
              <a 
                href="/signin" 
                className="inline-block w-full sm:w-auto bg-teal-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:bg-teal-700 transition duration-200 text-sm sm:text-base"
              >
                Se connecter
              </a>
            </div>
          )}

          {/* Error State */}
          {status === 'error' && (
            <div>
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-red-700 text-center mb-2">Échec de la vérification</h2>
              <p className="text-red-600 text-sm sm:text-base text-center mb-6">{error || "Erreur lors de la vérification."}</p>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium text-gray-700 text-sm sm:text-base mb-3">Solutions possibles :</p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-600 text-xs sm:text-sm">Vérifiez le lien de confirmation</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-600 text-xs sm:text-sm">Demandez un nouvel email</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <span className="text-gray-600 text-xs sm:text-sm">Contactez le support technique</span>
                  </li>
                </ul>
                
                <div className="flex flex-col sm:flex-row gap-2 mt-6">
                  <button 
                    onClick={() => window.location.reload()}
                    className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition duration-200 text-sm sm:text-base"
                  >
                    Réessayer
                  </button>
                  
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}