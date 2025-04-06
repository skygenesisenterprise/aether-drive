import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50 py-20 sm:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute right-0 bottom-0 w-1/2 h-1/2 bg-gradient-to-l from-indigo-50 to-transparent opacity-50 rounded-tl-full" />
        <div className="absolute left-0 top-0 w-1/3 h-1/3 bg-gradient-to-br from-blue-50 to-transparent opacity-40 rounded-br-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-4xl mx-auto">
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Reclaim control<br className="hidden sm:inline"/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500"> of your cloud</span>
          </motion.h1>

          <motion.p
            className="mt-6 text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Aether Drive lets you securely store, share, and manage your data with total privacy.
          </motion.p>

          <motion.div
            className="mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <a
              href="/signup"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Sign Up
            </a>

            <a
              href="#features"
              className="inline-flex items-center justify-center ml-4 px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm transition-all duration-200"
            >
              Learn More
            </a>
          </motion.div>

          {/* Security badge */}
          <motion.div
            className="mt-12 flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200 shadow-sm">
              <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 1c-1.828 0-3.623.149-5.371.435a.75.75 0 00-.629.74v5.45c0 3.007 1.395 5.79 3.707 7.602 1.51 1.181 3.162 1.895 4.806 1.895 1.644 0 3.297-.714 4.806-1.895 2.313-1.812 3.707-4.595 3.707-7.602v-5.45a.75.75 0 00-.63-.74C13.624 1.149 11.827 1 10 1zm.278 15.55c-.073.028-.146.055-.22.08-.613.223-1.28.37-1.974.37a5.55 5.55 0 01-1.973-.37 4.97 4.97 0 01-.221-.08c-.408-.154-.798-.342-1.168-.563a7.85 7.85 0 01-.94-.658.748.748 0 01-.072-.067A8.366 8.366 0 012 9.625v-4.97c1.724-.219 3.393-.327 5.05-.327 1.658 0 3.327.108 5.05.327v4.97c0 2.196-.996 4.18-2.71 5.662z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-gray-600 font-medium">End-to-end encryption</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
