import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Link to="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="prose prose-sm sm:prose-base dark:prose-invert max-w-none"
        >
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl mb-6">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold">1. Information We Collect</h2>
              <p>We collect information that you provide directly to us, including your name, email address, and Instagram account details when you register for an account or connect your Instagram profile to our service.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold">2. How We Use Your Information</h2>
              <p>We use the information we collect to provide, maintain, and improve our services, specifically to automate your Instagram direct messages and manage your campaigns.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold">3. Data Security</h2>
              <p>We implement appropriate technical and organizational measures to protect the security of your personal information. However, please note that no method of transmission over the Internet is 100% secure.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold">4. Your Rights</h2>
              <p>You have the right to access, correct, or delete your personal data. You can manage these settings directly from your dashboard or by contacting our support team.</p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
