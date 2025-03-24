
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserDetails } from "@/lib/types";
import { toast } from "sonner";
import { ArrowLeftIcon, ArrowRightIcon, UserIcon, MailIcon, PhoneIcon, ClockIcon } from "lucide-react";

interface UserDetailsStepProps {
  data: UserDetails;
  isEmergency: boolean;
  onUpdate: (data: Partial<UserDetails>) => void;
  onNext: () => void;
  onBack: () => void;
}

const UserDetailsStep: React.FC<UserDetailsStepProps> = ({ 
  data, 
  isEmergency, 
  onUpdate, 
  onNext, 
  onBack 
}) => {
  // Update user name
  const handleNameChange = (value: string) => {
    onUpdate({ fullName: value });
  };
  
  // Update email
  const handleEmailChange = (value: string) => {
    onUpdate({ email: value });
  };
  
  // Update phone number
  const handlePhoneChange = (value: string) => {
    onUpdate({ phoneNumber: value });
  };
  
  // Update service length
  const handleServiceLengthChange = (value: string) => {
    onUpdate({ serviceLength: value });
  };
  
  // Validate email format
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  // Validate and proceed to next step
  const handleNext = () => {
    // Check required fields
    if (!data.fullName || !data.email || !data.phoneNumber) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // Validate email format
    if (!isValidEmail(data.email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    // Check phone number format (basic validation)
    if (data.phoneNumber.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }
    
    // For non-emergency, service length is required
    if (!isEmergency && !data.serviceLength) {
      toast.error("Please select how long you'll need the service");
      return;
    }
    
    onNext();
  };

  return (
    <div className="animate-fade-in">
      <Card className="glass-card overflow-hidden">
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center">
                <UserIcon className="h-8 w-8 text-primary" />
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-medium text-center mb-6">Your Details</h2>
              <p className="text-muted-foreground text-center mb-8">
                Please provide your contact information so we can reach you
              </p>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sm font-medium">
                    Full Name
                  </Label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="fullName"
                      placeholder="John Smith"
                      value={data.fullName || ""}
                      onChange={(e) => handleNameChange(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      placeholder="john.smith@example.com"
                      type="email"
                      value={data.email || ""}
                      onChange={(e) => handleEmailChange(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="text-sm font-medium">
                    Phone Number
                  </Label>
                  <div className="relative">
                    <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phoneNumber"
                      placeholder="07700 900000"
                      type="tel"
                      value={data.phoneNumber || ""}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                {!isEmergency && (
                  <div className="space-y-2 pt-2">
                    <Label htmlFor="serviceLength" className="text-sm font-medium flex items-center">
                      <ClockIcon className="h-4 w-4 mr-1.5" />
                      How long will you need the service?
                    </Label>
                    <Select
                      value={data.serviceLength || ""}
                      onValueChange={handleServiceLengthChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select required time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-2 hours">1-2 hours</SelectItem>
                        <SelectItem value="half day">Half day</SelectItem>
                        <SelectItem value="full day">Full day</SelectItem>
                        <SelectItem value="multiple days">Multiple days</SelectItem>
                        <SelectItem value="not sure">Not sure (we'll discuss)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-between pt-6">
              <Button 
                onClick={onBack} 
                variant="outline"
                className="group"
              >
                <ArrowLeftIcon className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                <span>Back</span>
              </Button>
              
              <Button 
                onClick={handleNext}
                className="group"
              >
                <span>Complete Request</span>
                <ArrowRightIcon className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDetailsStep;
