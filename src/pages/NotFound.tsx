
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-wetow-green/30 to-white p-4">
      <div className="glass-card max-w-md w-full p-8 text-center">
        <div className="relative h-24 w-24 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full bg-wetow-beige/50 animate-pulse"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-5xl font-bold text-wetow-green">404</span>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
        <p className="text-muted-foreground mb-8">
          We couldn't find the page you were looking for. It might have been moved or doesn't exist.
        </p>
        
        <Button asChild className="w-full bg-wetow-green hover:bg-wetow-green/90 text-wetow-green-foreground">
          <a href="/">Return to Home</a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
