import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormData } from "@/lib/types";
import { ArrowLeftIcon, CheckCircleIcon, TruckIcon, PhoneIcon } from "lucide-react";
import { submitForm } from "@/lib/api";
import { toast } from "sonner";

interface ConfirmationStepProps {
  data: FormData;
  onBack: () => void;
  onComplete: (orderId: string) => void;
}

const ConfirmationStep: React.FC<ConfirmationStepProps> = ({ data, onBack, onComplete }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [countdown, setCountdown] = useState(10);
  
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const { orderId } = await submitForm(data);
      onComplete(orderId);
      setIsCompleted(true);
      toast.success("Your request has been submitted successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit your request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCall = () => {
    window.location.href = 'tel:+442012345678';
    toast.success("Calling support...");
  };

  useEffect(() => {
    if (isCompleted && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isCompleted, countdown]);

  return (
    <div className="animate-fade-in">
      <Card className="glass-card overflow-hidden">
        <CardContent className="p-6">
          {!isCompleted ? (
            <div className="space-y-6">
              <div className="flex flex-col items-center justify-center mb-6">
                <div className="h-20 w-20 rounded-full bg-secondary flex items-center justify-center mb-4">
                  <TruckIcon className="h-10 w-10 text-primary" />
                </div>
                <h2 className="text-2xl font-medium text-center">Confirm Your Request</h2>
                <p className="text-muted-foreground text-center mt-2">
                  Please review your information before submitting
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="rounded-lg border p-4">
                  <h3 className="font-medium mb-2">Location Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-muted-foreground">Current Location:</span> {data.location.address}</p>
                    {data.location.destinationAddress && (
                      <p><span className="text-muted-foreground">Destination:</span> {data.location.destinationAddress}</p>
                    )}
                    <p>
                      <span className="text-muted-foreground">Emergency Status:</span> 
                      <span className={data.location.isEmergency ? "text-destructive font-medium" : ""}>
                        {data.location.isEmergency ? " Emergency" : " Non-emergency"}
                      </span>
                    </p>
                  </div>
                </div>
                
                <div className="rounded-lg border p-4">
                  <h3 className="font-medium mb-2">Vehicle Information</h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-muted-foreground">Registration:</span> {data.location.vehicleRegNumber}
                    </p>
                    {data.location.vehicleMake && data.location.vehicleModel && (
                      <p>
                        <span className="text-muted-foreground">Vehicle:</span> {data.location.vehicleMake} {data.location.vehicleModel}
                      </p>
                    )}
                    <p>
                      <span className="text-muted-foreground">Engine Works:</span> {data.vehicle.engineWorks ? "Yes" : "No"}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Can Move:</span> {data.vehicle.canMove ? "Yes" : "No"}
                    </p>
                    {data.vehicle.weight && (
                      <p><span className="text-muted-foreground">Weight:</span> {data.vehicle.weight}</p>
                    )}
                  </div>
                </div>
                
                <div className="rounded-lg border p-4">
                  <h3 className="font-medium mb-2">Your Details</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-muted-foreground">Name:</span> {data.userDetails.fullName}</p>
                    <p><span className="text-muted-foreground">Email:</span> {data.userDetails.email}</p>
                    <p><span className="text-muted-foreground">Phone:</span> {data.userDetails.phoneNumber}</p>
                    {!data.location.isEmergency && data.userDetails.serviceLength && (
                      <p><span className="text-muted-foreground">Service Length:</span> {data.userDetails.serviceLength}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="bg-secondary/50 rounded-lg p-4 text-sm">
                <p className="text-center">
                  By submitting this request, you'll receive a confirmation email and SMS with your order details. 
                  A representative will contact you shortly.
                </p>
              </div>
              
              <div className="flex justify-between pt-4">
                <Button 
                  onClick={onBack} 
                  variant="outline"
                  className="group"
                  disabled={isSubmitting}
                >
                  <ArrowLeftIcon className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                  <span>Back</span>
                </Button>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={handleCall}
                    variant="outline"
                    className="gap-2"
                  >
                    <PhoneIcon className="h-4 w-4" />
                    Call Us
                  </Button>
                  
                  <Button 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="min-w-[140px]"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Request"}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
                <CheckCircleIcon className="h-10 w-10 text-green-600" />
              </div>
              
              <h2 className="text-2xl font-medium text-center mb-2">Request Submitted!</h2>
              <p className="text-lg font-medium text-primary mb-6">Your Order ID: {data.orderId}</p>
              
              <div className="bg-secondary rounded-lg p-6 mb-8 w-full max-w-sm">
                <p className="text-center mb-4">
                  We've sent confirmation to your email and phone number.
                </p>
                <div className="flex items-center justify-center gap-2 bg-primary/10 p-3 rounded-lg text-primary">
                  <PhoneIcon className="h-5 w-5" />
                  <p className="font-medium">Expect a call in 5-10 minutes</p>
                </div>
              </div>
              
              <p className="text-muted-foreground text-center text-sm">
                This page will automatically close in {countdown} seconds
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfirmationStep;
