'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiCheckCircle } from 'react-icons/fi'
import { FaFacebook, FaGoogle, FaGithub } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { API_URL } from ".././services/URLService";

export default function SignUp() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [passwordErrors, setPasswordErrors] = useState<string[]>([])

  const validatePassword = (password: string) => {
    const errors = []
    if (password.length < 8) {
      errors.push('Le mot de passe doit contenir au moins 8 caractères')
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins une majuscule')
    }
    
    if (!/[0-9]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins un chiffre')
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins un caractère spécial')
    }
    return errors
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    
    // Validation du mot de passe en temps réel
    if (name === 'password') {
      const errors = validatePassword(value)
      setPasswordErrors(errors)
    }
    
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation finale du mot de passe avant soumission
    const passwordValidationErrors = validatePassword(formData.password)
    if (passwordValidationErrors.length > 0) {
      setPasswordErrors(passwordValidationErrors)
      return
    }
    
    setIsSubmitting(true)
    setError('')
    
    try {
      const res = await fetch(`${API_URL}/auth/signup/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Une erreur est survenue')
      
      // Afficher le message de succès
      setSuccess(true)
      
      // Redirection vers la page de connexion après 2 secondes
      setTimeout(() => {
        router.push('/signin')
      }, 2000)
      
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Variantes d'animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  }

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 flex items-center justify-center p-4"
    >
      <motion.div 
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="w-full max-w-md"
      >
        {/* Message de succès */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start"
            >
              <FiCheckCircle className="text-green-500 text-xl mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-green-800 font-medium">Compte créé avec succès !</h3>
                <p className="text-green-600 text-sm mt-1">Un email de vérification a été envoyé !</p>
                <p className="text-green-600 text-sm mt-1">Redirection vers la page de connexion...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          {/* En-tête */}
          <motion.div 
            variants={itemVariants}
            className="p-8 pb-6 text-center"
          >
            <Link href="/" className="inline-flex items-center mb-6">
              <Image
                src="/assets/logo.png"
                alt="Logo Find"
                width={40}
                height={40}
                className="mr-2 rounded-lg"
              />
              <span className="text-2xl font-bold text-green-600">Find</span>
            </Link>
            
            <motion.h1 
              className="text-2xl font-bold text-gray-800 mb-2"
            >
              Créer votre compte
            </motion.h1>
            <p className="text-gray-500">
              Rejoignez notre plateforme pour découvrir les meilleures offres agricoles
            </p>
          </motion.div>

          {/* Message d'erreur */}
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="px-6 py-3 bg-red-50 text-red-500 text-sm mb-4 flex items-start"
              >
                <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Formulaire (masqué en cas de succès) */}
          <AnimatePresence>
            {!success && (
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.form 
                  onSubmit={handleSubmit}
                  className="px-8 pt-2 pb-8"
                >
                  <motion.div variants={itemVariants} className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="name">
                      Nom Complet
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiUser className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="Jean Dupont"
                        required
                      />
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
                      Adresse Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiMail className="text-gray-400" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="email@exemple.com"
                        required
                      />
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">
                      Mot De Passe
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiLock className="text-gray-400" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? <FiEyeOff className="text-gray-400" /> : <FiEye className="text-gray-400" />}
                      </button>
                    </div>
                    {passwordErrors.length > 0 && (
                      <div className="mt-2 text-sm text-red-500">
                        <ul className="list-disc pl-5 space-y-1">
                          {passwordErrors.map((error, index) => (
                            <li key={index}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </motion.div>

                  <motion.button
                    variants={itemVariants}
                    type="submit"
                    disabled={isSubmitting || passwordErrors.length > 0}
                    whileHover={{ scale: passwordErrors.length > 0 ? 1 : 1.02 }}
                    whileTap={{ scale: passwordErrors.length > 0 ? 1 : 0.98 }}
                    className={`w-full ${passwordErrors.length > 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center`}
                  >
                    {isSubmitting ? (
                      <span className="inline-block h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <>
                        S'inscrire <FiArrowRight className="ml-2" />
                      </>
                    )}
                  </motion.button>
                </motion.form>

                {/* Séparateur */}
                <motion.div variants={itemVariants} className="px-8 mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">
                        Ou continuer avec
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Connexion sociale */}
                <motion.div 
                  variants={containerVariants}
                  className="grid grid-cols-2 gap-3 px-8 pb-8"
                >
                  <motion.button
                    variants={itemVariants}
                    type="button"
                    whileHover={{ y: -2 }}
                    onClick={() => signIn('google', { callbackUrl: '/' })}
                    className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <FaGoogle className="text-red-600 text-xl" />
                  </motion.button>
                  
                  <motion.button
                    variants={itemVariants}
                    type="button"
                    whileHover={{ y: -2 }}
                    onClick={() => signIn('github', { callbackUrl: '/' })}
                    className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <FaGithub className="text-gray-800 text-xl" />
                  </motion.button>
                </motion.div>

                {/* Lien de connexion */}
                <motion.div 
                  variants={itemVariants}
                  className="bg-gray-50 px-8 py-4 text-center rounded-b-xl"
                >
                  <p className="text-gray-600">
                    Vous avez déjà un compte ?{' '}
                    <Link href="/signin" className="text-green-600 hover:underline font-medium">
                      Se connecter
                    </Link>
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </motion.section>
  )
}