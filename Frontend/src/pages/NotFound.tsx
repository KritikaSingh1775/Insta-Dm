import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FileQuestion, ArrowLeft, Home } from "lucide-react";
import { motion } from "framer-motion";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-md text-center"
      >
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-primary/10 p-6">
            <FileQuestion className="h-12 w-12 text-primary" />
          </div>
        </div>
        
        <h1 className="mb-2 text-4xl font-extrabold tracking-tight sm:text-5xl">
          Page Not Found
        </h1>
        
        <p className="mb-8 text-lg text-muted-foreground">
          We couldn't find the page you were looking for. It might have been moved, deleted, or never existed.
        </p>
        
        <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0 justify-center">
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
          
          <Button 
            size="lg" 
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            Return to Dashboard
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
