import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Check } from "lucide-react";
import { cn } from "../utils/cn";

interface PricingTierProps {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
  highlighted?: boolean;
  delay: number;
}

const PricingTier = ({ name, price, description, features, cta, href, highlighted, delay }: PricingTierProps) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      className={cn(
        "flex flex-col rounded-2xl p-6 shadow-sm",
        highlighted
          ? "bg-gradient-to-b from-indigo-500 to-indigo-600 border border-indigo-500"
          : "bg-white border border-gray-200"
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="mb-8">
        <h3
          className={cn(
            "text-lg font-semibold mb-2",
            highlighted ? "text-white" : "text-gray-900"
          )}
        >
          {name}
        </h3>
        <div className={cn("mb-4", highlighted ? "text-white" : "text-gray-900")}>
          <span className="text-3xl font-extrabold">{price}</span>
          {price !== "Custom" && <span className={cn("text-sm ml-2", highlighted ? "text-indigo-100" : "text-gray-500")}>/month</span>}
        </div>
        <p className={cn("text-sm", highlighted ? "text-indigo-100" : "text-gray-500")}>
          {description}
        </p>
      </div>

      <ul className="mb-8 space-y-4 flex-grow">
        {features.map((feature) => (
          <li key={feature} className="flex items-start">
            <div
              className={cn(
                "flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center mt-1",
                highlighted ? "bg-indigo-300" : "bg-indigo-100"
              )}
            >
              <Check
                className={cn("h-3 w-3", highlighted ? "text-indigo-800" : "text-indigo-600")}
              />
            </div>
            <span
              className={cn("ml-3 text-sm", highlighted ? "text-indigo-50" : "text-gray-600")}
            >
              {feature}
            </span>
          </li>
        ))}
      </ul>

      <a
        href={href}
        className={cn(
          "inline-flex items-center justify-center px-5 py-3 border text-sm font-medium rounded-md transition-colors duration-200",
          highlighted
            ? "text-indigo-700 bg-white hover:bg-gray-50 border-transparent shadow-md"
            : "text-white bg-indigo-600 hover:bg-indigo-700 border-transparent shadow-sm"
        )}
      >
        {cta}
      </a>
    </motion.div>
  );
};

export default function Pricing() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="pricing" className="py-20 bg-gray-50" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.span
            className="text-sm font-semibold tracking-wide uppercase text-indigo-600"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            Pricing
          </motion.span>
          <motion.h2
            className="mt-2 text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Choose the plan that works for you
          </motion.h2>
          <motion.p
            className="mt-4 text-lg text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Whether you're an individual or an enterprise, we have a plan that meets your needs.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <PricingTier
            name="Personal"
            price="Free"
            description="Perfect for individual users looking for secure cloud storage."
            features={[
              "50GB encrypted storage",
              "Basic document editing",
              "Password manager",
              "Mobile app access",
              "2FA Authentication",
              "Basic support",
              "Domain Default",
            ]}
            cta="Get Started"
            href="/signup"
            delay={0.3}
          />

          <PricingTier
            name="Professional"
            price="$19.99"
            description="For professionals and small teams with advanced needs."
            features={[
              "500GB encrypted storage",
              "Advanced document editing",
              "Password manager with team sharing",
              "Mobile & offline access",
              "Domain customization",
              "Priority support",
              "API access (limited)",
            ]}
            cta="Start Free Trial"
            href="/signup"
            highlighted={true}
            delay={0.4}
          />

          <PricingTier
            name="Enterprise"
            price="Custom"
            description="Custom solutions for organizations with specialized requirements."
            features={[
              "Unlimited encrypted storage",
              "Full collaborative suite",
              "Advanced security controls",
              "SSO Integration",
              "24/7 dedicated support",
              "Custom API implementation",
              "On-premise deployment option",
            ]}
            cta="Contact Sales"
            href="/contact"
            delay={0.5}
          />
        </div>

        <motion.div
          className="mt-16 bg-white rounded-xl p-8 shadow-sm border border-gray-200 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Need a custom solution?</h3>
          <p className="text-gray-600 mb-6">
            Contact our sales team to discuss your specific requirements and get a tailored quote.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center justify-center px-5 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
          >
            Contact Sales
          </a>
        </motion.div>
      </div>
    </section>
  );
}
