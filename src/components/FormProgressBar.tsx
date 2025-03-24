
import React from "react";
import { FormStep } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";

interface FormProgressBarProps {
  currentStep: FormStep;
}

const FormProgressBar: React.FC<FormProgressBarProps> = ({ currentStep }) => {
  const steps = [
    { id: FormStep.LOCATION, label: "Location" },
    { id: FormStep.VEHICLE, label: "Vehicle" },
    { id: FormStep.USER_DETAILS, label: "Your Details" },
    { id: FormStep.CONFIRMATION, label: "Confirmation" }
  ];

  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep >= step.id;
          
          return (
            <React.Fragment key={step.id}>
              {/* Step indicator */}
              <div className="flex flex-col items-center relative">
                <div
                  className={cn(
                    "h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out",
                    isCompleted 
                      ? "bg-primary text-primary-foreground" 
                      : isActive 
                        ? "bg-primary/90 text-primary-foreground ring-4 ring-primary/20" 
                        : "bg-secondary text-secondary-foreground"
                  )}
                >
                  {isCompleted ? (
                    <CheckIcon className="h-5 w-5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <span 
                  className={cn(
                    "text-sm mt-2 absolute -bottom-6 transform -translate-x-1/2 whitespace-nowrap",
                    isActive ? "font-medium text-primary" : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
              </div>
              
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div 
                  className={cn(
                    "h-0.5 flex-1 mx-2 transition-colors duration-300 ease-in-out",
                    currentStep > index ? "bg-primary" : "bg-secondary"
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default FormProgressBar;
