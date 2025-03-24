
import { useState, useEffect } from "react";
import TowForm from "@/components/TowForm";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Index = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleGetStarted = () => {
    setIsFormVisible(true);
    
    // Scroll to form with smooth animation
    const formSection = document.getElementById("form-section");
    if (formSection) {
      formSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header 
        className={cn(
          "fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300",
          isScrolled 
            ? "bg-white/80 backdrop-blur-md shadow-sm" 
            : "bg-transparent"
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="font-semibold text-xl">TowAssist</div>
            <div className="flex items-center space-x-6">
              <a href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">
                How It Works
              </a>
              <a href="#services" className="text-sm font-medium hover:text-primary transition-colors">
                Services
              </a>
              <Button onClick={handleGetStarted} size="sm">
                Get Help Now
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center pt-16 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex-1 space-y-6">
              <div className="inline-block bg-primary/10 text-primary rounded-full px-4 py-1 text-sm font-medium animate-fade-in">
                Roadside Assistance Made Simple
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight animate-slide-in">
                Stranded? <br />
                <span className="text-primary">We'll get you moving</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg animate-slide-in" style={{ animationDelay: "100ms" }}>
                Our trusted tow truck network connects you with reliable service when you need it most. Quick, efficient, and hassle-free.
              </p>
              <div className="pt-4 animate-slide-in" style={{ animationDelay: "200ms" }}>
                <Button onClick={handleGetStarted} size="lg" className="rounded-full px-8">
                  Request Assistance Now
                </Button>
              </div>
              <div className="flex items-center space-x-4 pt-4 animate-slide-in" style={{ animationDelay: "300ms" }}>
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-8 w-8 rounded-full bg-gray-300 border-2 border-white" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">4,500+</span> satisfied customers this month
                </p>
              </div>
            </div>
            <div className="flex-1 hidden md:block">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-blue-400/20 rounded-3xl blur-xl opacity-70" />
                <div className="relative aspect-video bg-gray-200 rounded-2xl overflow-hidden shadow-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-100/50 to-gray-800/50" />
                  <div className="absolute inset-0 flex items-center justify-center text-white font-medium text-xl">
                    Vehicle Assistance Image
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">How TowAssist Works</h2>
            <p className="text-muted-foreground">
              We've streamlined the process to get you back on the road as quickly as possible
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Request Assistance",
                description: "Fill out our simple form with your location and vehicle details"
              },
              {
                step: "2",
                title: "Get Connected",
                description: "We match you with the nearest available tow service in our network"
              },
              {
                step: "3",
                title: "Problem Solved",
                description: "The service provider arrives promptly to assist you with your vehicle"
              }
            ].map((item, index) => (
              <div 
                key={index} 
                className="glass-card p-6 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 bg-primary/10 text-primary font-bold text-lg w-12 h-12 flex items-center justify-center">
                  {item.step}
                </div>
                <h3 className="text-xl font-medium mt-6 mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 to-primary/0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Services</h2>
            <p className="text-muted-foreground">
              We offer a range of services to meet your vehicle assistance needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Towing",
                description: "Local and long-distance towing services for all vehicle types"
              },
              {
                title: "Roadside Assistance",
                description: "Jump starts, tire changes, and other quick roadside fixes"
              },
              {
                title: "Lockout Service",
                description: "Help when you're locked out of your vehicle"
              },
              {
                title: "Fuel Delivery",
                description: "Emergency fuel delivery when you run out on the road"
              }
            ].map((service, index) => (
              <div key={index} className="glass-card p-6 hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-xl font-medium mb-3">{service.title}</h3>
                <p className="text-muted-foreground">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section 
        id="form-section" 
        className="py-24 bg-gradient-to-b from-white to-blue-50"
      >
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl font-bold mb-4">
              {isFormVisible 
                ? "Request Assistance" 
                : "Need Help With Your Vehicle?"}
            </h2>
            <p className="text-muted-foreground mb-8">
              {isFormVisible 
                ? "Please fill out the form below to request assistance" 
                : "Our network of trusted tow truck providers is ready to help"}
            </p>
            
            {!isFormVisible && (
              <Button onClick={handleGetStarted} size="lg" className="rounded-full px-8">
                Get Started
              </Button>
            )}
          </div>
          
          {isFormVisible && <TowForm />}
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">TowAssist</h3>
              <p className="text-gray-400">
                Connecting you with reliable towing services when you need them most.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-medium mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#services" className="text-gray-400 hover:text-white transition-colors">Services</a></li>
                <li><a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-medium mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>123 Assistance Way</li>
                <li>London, UK</li>
                <li>support@towassist.com</li>
                <li>+44 20 1234 5678</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} TowAssist. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
