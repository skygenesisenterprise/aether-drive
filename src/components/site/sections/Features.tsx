import { motion } from "framer-motion";
import { Lock, FileEdit, Key, Wifi, Code, Users } from "lucide-react";
import { useInView } from "react-intersection-observer";
import { cn } from "../utils/cn";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
  className?: string;
}

const FeatureCard = ({ icon, title, description, delay, className }: FeatureCardProps) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      className={cn(
        "relative flex flex-col p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-indigo-100 transition-all duration-300",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="p-3 mb-4 bg-indigo-50 rounded-xl w-12 h-12 flex items-center justify-center text-indigo-600">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm flex-grow">{description}</p>
    </motion.div>
  );
};

export default function Features() {
  const [sectionRef, sectionInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="features" className="py-20 bg-gray-50" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.span
            className="text-sm font-semibold tracking-wide uppercase text-indigo-600"
            initial={{ opacity: 0 }}
            animate={sectionInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            Powerful Features
          </motion.span>
          <motion.h2
            className="mt-2 text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            animate={sectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Everything you need, all in one place
          </motion.h2>
          <motion.p
            className="mt-4 text-lg text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            animate={sectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Aether Drive combines the best of cloud storage, productivity tools, and security features in one seamless platform.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Lock size={24} />}
            title="Encrypted Storage"
            description="Store your files with end-to-end encryption. Only you hold the keys to your data, ensuring total privacy and security."
            delay={0.3}
          />

          <FeatureCard
            icon={<FileEdit size={24} />}
            title="Built-in Document Editing"
            description="Create, edit, and collaborate on documents, spreadsheets, and presentations without leaving your secure environment."
            delay={0.4}
          />

          <FeatureCard
            icon={<Key size={24} />}
            title="Password Manager"
            description="Securely store and manage your passwords with integrated password management, directly within your cloud storage."
            delay={0.5}
          />

          <FeatureCard
            icon={<Wifi size={24} />}
            title="Offline Access"
            description="Access your important files even when offline. Changes sync automatically when you reconnect."
            delay={0.6}
          />

          <FeatureCard
            icon={<Code size={24} />}
            title="Enterprise API"
            description="Integrate Aether Drive with your existing systems using our comprehensive and secure API."
            delay={0.7}
          />

          <FeatureCard
            icon={<Users size={24} />}
            title="For Everyone"
            description="Whether you're an individual, developer, or enterprise, Aether Drive adapts to your unique needs."
            delay={0.8}
          />
        </div>

        {/* Stats section */}
        <div className="mt-20 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
            <motion.div
              className="p-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={sectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <p className="text-4xl font-extrabold text-indigo-600 mb-2">99.9%</p>
              <p className="text-gray-600 text-sm">Uptime guarantee</p>
            </motion.div>

            <motion.div
              className="p-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={sectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 1 }}
            >
              <p className="text-4xl font-extrabold text-indigo-600 mb-2">256-bit</p>
              <p className="text-gray-600 text-sm">Military-grade encryption</p>
            </motion.div>

            <motion.div
              className="p-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={sectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 1.1 }}
            >
              <p className="text-4xl font-extrabold text-indigo-600 mb-2">24/7</p>
              <p className="text-gray-600 text-sm">Expert support</p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
