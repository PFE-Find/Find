'use client'
import Image from 'next/image';
import Link from 'next/link';
import { signIn} from 'next-auth/react'

import { redirect } from "next/navigation";

export default function SignIn() {
 
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const res = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });
    if (res?.error) {
      alert("Wrong Credentials!")
    }
    if (res?.ok) {
       redirect('/');
    }
};
 
 
  return (


    <section className="bg-gray-50 dark:bg-gray-900  bg-transparent flex items-center justify-center">
      <div className="flex flex-col items-center px-6 py-8 w-full max-w-md">
        <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          <Image
            src="/assets/logo.jpeg"
            alt="logo"
            width={32}
            height={32}
            className="mr-2"
            style={{ 'borderRadius': '10px' }}
          />
          Find
        </a>
        <div className="w-full bg-transparent rounded-lg shadow dark:border dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="name@company.com"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember"
                    type="checkbox"
                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="remember" className="ml-2 text-sm text-gray-500 dark:text-gray-300">
                    Remember me
                  </label>
                </div>
                <a href="#" className="text-sm text-primary-600 dark:text-primary-500 hover:underline">
                  Forgot password?
                </a>
              </div>
              <button
                type="submit"
                className="w-full bg-primary-600 text-white rounded-lg px-5 py-2.5 text-sm text-center hover:bg-primary-700 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700"
              >
                Sign in
              </button>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Don’t have an account yet?{' '}
                <Link href="/signup"
                  className="text-primary-600 hover:underline dark:text-primary-500">
                  Sign up
               
                </Link>

              </p>
            </form>
               {/* Social login buttons */}
                        <div className="flex flex-col space-y-2 mt-4">
                          <button
                            type="button"
                            className="flex items-center justify-center w-full 
                                       bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700"
                          >
                            <Image
                              src="/assets/facebook.png"
                              alt="Facebook Icon"
                              width={30}
                              height={20}
                              className="mr-2"
                            />
                            Sign in with Facebook
                          </button>
            
                          <button
                            type="button"
                            className="flex items-center justify-center w-full 
                                       bg-red-600 text-white rounded-lg py-2 hover:bg-red-700"
                          >
                            <Image
                              src="/assets/google.png"
                              alt="Google Icon"
                              width={30}
                              height={20}
                              className="mr-2"
                            />
                            Sign in with Google
                          </button>
            
                          <button
                            type="button"
                            className="flex items-center justify-center w-full 
                                       bg-gray-800 text-white rounded-lg py-2 hover:bg-gray-900"
                            onClick={()=> signIn('github' , {redirect :true , callbackUrl :'/'}) }
                          >
                            <Image
                              src="/assets/github.png"
                              alt="GitHub Icon"
                              width={30}
                              height={20}
                              className="mr-2"
                            />
                            Sign in with GitHub
                          </button>
                        </div>
          </div>
        </div>
      </div>
    </section>

  );
}
