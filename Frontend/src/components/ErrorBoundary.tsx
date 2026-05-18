import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  private handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
          <div className="mx-auto max-w-md text-center">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-destructive/10 p-6">
                <AlertTriangle className="h-12 w-12 text-destructive" />
              </div>
            </div>
            
            <h1 className="mb-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Something went wrong
            </h1>
            
            <p className="mb-8 text-muted-foreground">
              An unexpected error has occurred. Our team has been notified and we are working to fix the issue.
            </p>
            
            <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0 justify-center">
              <Button 
                variant="outline" 
                size="lg" 
                onClick={this.handleReset}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
              
              <Button 
                size="lg" 
                onClick={this.handleGoHome}
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                Go to Home
              </Button>
            </div>
            
            {process.env.NODE_ENV === "development" && this.state.error && (
              <div className="mt-8 text-left bg-muted p-4 rounded-md overflow-auto max-h-48 text-xs font-mono text-muted-foreground">
                {this.state.error.toString()}
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
