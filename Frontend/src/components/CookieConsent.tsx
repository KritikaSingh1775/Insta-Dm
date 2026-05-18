import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasConsented = localStorage.getItem("cookie-consent");
    if (!hasConsented) {
      // delay to avoid overwhelming user immediately on load
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-4xl rounded-lg border bg-background p-4 shadow-lg sm:bottom-8 sm:flex sm:items-center sm:justify-between sm:p-6"
        >
          <div className="pr-4 sm:pr-8">
            <h3 className="mb-2 text-lg font-semibold">We value your privacy</h3>
            <p className="text-sm text-muted-foreground">
              We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
            </p>
          </div>
          <div className="mt-4 flex flex-shrink-0 flex-col gap-2 sm:mt-0 sm:flex-row">
            <Button variant="outline" onClick={handleDecline} className="w-full sm:w-auto">
              Decline
            </Button>
            <Button onClick={handleAccept} className="w-full sm:w-auto">
              Accept All
            </Button>
            <button 
              onClick={() => setIsVisible(false)} 
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground sm:hidden"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
