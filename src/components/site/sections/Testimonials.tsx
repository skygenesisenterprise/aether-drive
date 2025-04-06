import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

interface TestimonialProps {
  quote: string;
  author: string;
  jobTitle: string; // Changed from 'role' to 'jobTitle'
  company: string;
  delay: number;
}

const Testimonial = ({ quote, author, jobTitle, company, delay }: TestimonialProps) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      className="flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="flex-grow">
        <svg className="h-8 w-8 text-indigo-400 mb-3" fill="currentColor" viewBox="0 0 32 32">
          <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
        </svg>
        <p className="text-gray-600 mb-6">{quote}</p>
      </div>
      <div>
        <p className="font-medium text-gray-900">{author}</p>
        <p className="text-sm text-gray-500">{jobTitle}, {company}</p>
      </div>
    </motion.div>
  );
};

export default function Testimonials() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className="py-20 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-3xl mx-auto text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-sm font-semibold tracking-wide uppercase text-indigo-600">Testimonials</span>
          <h2 className="mt-2 text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
            Trusted by professionals worldwide
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Hear from our users about how Aether Drive has transformed the way they work and store data.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Testimonial
            quote="Aether Drive has changed the way our team collaborates. The built-in document editing combined with top-notch security gives us peace of mind when working with sensitive client data."
            author="Sarah Johnson"
            jobTitle="Director of Operations"
            company="Cloudwave Tech"
            delay={0.1}
          />

          <Testimonial
            quote="As a developer, I need a secure place to store code and collaborate with my team. Aether Drive's API integration and encryption features are unmatched."
            author="Michael Chen"
            jobTitle="Senior Developer"
            company="CodeNova"
            delay={0.2}
          />

          <Testimonial
            quote="The password manager integration sealed the deal for us. Now we have one secure platform for all our company's digital assets and credentials."
            author="Emma Rodriguez"
            jobTitle="CISO"
            company="SecureVault Inc."
            delay={0.3}
          />
        </div>

        {/* Trust logos */}
        <motion.div
          className="mt-20 pt-12 border-t border-gray-100"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <p className="text-center text-sm font-medium text-gray-500 mb-8">Trusted by forward-thinking companies</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center opacity-60">
            {/* These would be replaced with actual company logos */}
            <div className="h-8 text-gray-400 font-bold">ACME Corp</div>
            <div className="h-8 text-gray-400 font-bold">TechFlow</div>
            <div className="h-8 text-gray-400 font-bold">Quantum</div>
            <div className="h-8 text-gray-400 font-bold">Innovex</div>
            <div className="h-8 text-gray-400 font-bold">FutureWave</div>
            <div className="h-8 text-gray-400 font-bold">Stellar Inc</div>
          </div>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          className="mt-16 flex flex-wrap justify-center gap-8"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="flex items-center bg-gray-50 rounded-full px-4 py-2 border border-gray-200">
            <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 1c-1.828 0-3.623.149-5.371.435a.75.75 0 00-.629.74v5.45c0 3.007 1.395 5.79 3.707 7.602 1.51 1.181 3.162 1.895 4.806 1.895 1.644 0 3.297-.714 4.806-1.895 2.313-1.812 3.707-4.595 3.707-7.602v-5.45a.75.75 0 00-.63-.74C13.624 1.149 11.827 1 10 1zm.278 15.55c-.073.028-.146.055-.22.08-.613.223-1.28.37-1.974.37a5.55 5.55 0 01-1.973-.37 4.97 4.97 0 01-.221-.08c-.408-.154-.798-.342-1.168-.563a7.85 7.85 0 01-.94-.658.748.748 0 01-.072-.067A8.366 8.366 0 012 9.625v-4.97c1.724-.219 3.393-.327 5.05-.327 1.658 0 3.327.108 5.05.327v4.97c0 2.196-.996 4.18-2.71 5.662z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-gray-600 font-medium">SOC 2 Compliant</span>
          </div>

          <div className="flex items-center bg-gray-50 rounded-full px-4 py-2 border border-gray-200">
            <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-gray-600 font-medium">GDPR Ready</span>
          </div>

          <div className="flex items-center bg-gray-50 rounded-full px-4 py-2 border border-gray-200">
            <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M15.404 5.757a.75.75 0 00-.984-.858 5.5 5.5 0 00-3.678 8.563.75.75 0 001.05.18A7 7 0 0015.404 5.757z" />
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-1.5 0a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-gray-600 font-medium">24/7 Monitoring</span>
          </div>

          <div className="flex items-center bg-gray-50 rounded-full px-4 py-2 border border-gray-200">
            <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-gray-600 font-medium">ISO 27001 Certified</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
