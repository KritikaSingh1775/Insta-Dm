import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Terms() {
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
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl mb-6">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold">1. Acceptance of Terms</h2>
              <p>By accessing or using our service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the service.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold">2. Use License</h2>
              <p>Permission is granted to temporarily download one copy of the materials (information or software) on our website for personal, non-commercial transitory viewing only.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold">3. Service Modifications</h2>
              <p>We reserve the right to modify or discontinue, temporarily or permanently, the service with or without notice to you. You agree that we shall not be liable to you or to any third party for any modification, suspension, or discontinuance of the service.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold">4. Instagram Compliance</h2>
              <p>Users must comply with Instagram's Terms of Service and Community Guidelines. We are not responsible for account bans or restrictions resulting from misuse of our automation tools.</p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
