'use client'
import Image from 'next/image'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'
import { FaFacebook, FaGoogle, FaGithub } from 'react-icons/fa'

export default function Connexion() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e : any) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password
    })

    if (result?.error) {
      console.log(result?.error);
      
     if(result?.error == "AccessDenied") {setError('Please Verify your email!')}
      else{
        setError('Identifiants incorrects')
      }
      setIsLoading(false)
    } else {
      router.push('/')
    }
  }

  // Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
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
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          {/* Header */}
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
            
            <motion.h1 className="text-2xl font-bold text-gray-800 mb-2">
              Connexion à votre compte
            </motion.h1>
            <p className="text-gray-500">
              Accédez à votre espace personnel
            </p>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="px-6 text-red-500 text-sm mb-4 text-center"
            >
              {error}
            </motion.div>
          )}

          {/* Form */}
          <motion.form 
            onSubmit={handleSubmit}
            className="px-8 pt-2 pb-8"
          >
            <motion.div variants={itemVariants} className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
                Adresse email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="email@exemple.com"
                  required
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-green-500"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-gray-500">
                  Se souvenir de moi
                </label>
              </div>
              {/* <Link href="/mot-de-passe-oublie" className="text-sm text-green-600 hover:underline">
                Mot de passe oublié ?
              </Link> */}
            </motion.div>

            <motion.button
              variants={itemVariants}
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center"
            >
              {isLoading ? (
                <span className="inline-block h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                'Se connecter'
              )}
            </motion.button>
          </motion.form>

          {/* Divider */}
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

          {/* Social Login */}
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

          {/* Sign Up Link */}
          <motion.div 
            variants={itemVariants}
            className="bg-gray-50 px-8 py-4 text-center rounded-b-xl"
          >
            <p className="text-gray-600">
              Pas encore de compte ?{' '}
              <Link href="/signup" className="text-green-600 hover:underline font-medium">
                S'inscrire
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.section>
  )
}