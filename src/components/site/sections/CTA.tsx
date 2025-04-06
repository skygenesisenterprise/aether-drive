import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export default function CTA() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section ref={ref} className="py-20 bg-gradient-to-r from-indigo-600 to-blue-500 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-white/20 rounded-full" />
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-white/20 rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2
            className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            Ready to take control of your cloud?
          </motion.h2>

          <motion.p
            className="mt-4 text-lg text-indigo-100"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Get started with Aether Drive today and experience the perfect balance of security and productivity.
          </motion.p>

          <motion.div
            className="mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <a
              href="/signup"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Sign Up
            </a>

            <a
              href="#features"
              className="ml-4 inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-700 bg-opacity-60 hover:bg-opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
            >
              Learn More
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
