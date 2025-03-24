
import { useState } from "react";
import { FormData, FormStep, LocationData, VehicleData, UserDetails } from "@/lib/types";
import FormProgressBar from "./FormProgressBar";
import LocationStep from "./LocationStep";
import VehicleStep from "./VehicleStep";
import UserDetailsStep from "./UserDetailsStep";
import ConfirmationStep from "./ConfirmationStep";

const TowForm = () => {
  const [currentStep, setCurrentStep] = useState<FormStep>(FormStep.LOCATION);
  const [formData, setFormData] = useState<FormData>({
    location: {
      address: "",
      latitude: null,
      longitude: null,
      isEmergency: false,
      vehicleRegNumber: ""
    },
    vehicle: {
      engineWorks: false,
      canMove: false
    },
    userDetails: {
      fullName: "",
      email: "",
      phoneNumber: ""
    }
  });

  // Update location data
  const updateLocationData = (data: Partial<LocationData>) => {
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        ...data
      }
    }));
  };

  // Update vehicle data
  const updateVehicleData = (data: Partial<VehicleData>) => {
    setFormData(prev => ({
      ...prev,
      vehicle: {
        ...prev.vehicle,
        ...data
      }
    }));
  };

  // Update user details
  const updateUserDetails = (data: Partial<UserDetails>) => {
    setFormData(prev => ({
      ...prev,
      userDetails: {
        ...prev.userDetails,
        ...data
      }
    }));
  };

  // Go to next step
  const goToNextStep = () => {
    setCurrentStep(prev => prev + 1 as FormStep);
  };

  // Go to previous step
  const goToPreviousStep = () => {
    setCurrentStep(prev => prev - 1 as FormStep);
  };

  // Handle form completion
  const handleFormComplete = (orderId: string) => {
    setFormData(prev => ({
      ...prev,
      orderId
    }));
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      <div className="my-10">
        <FormProgressBar currentStep={currentStep} />
      </div>

      <div className="min-h-[500px]">
        {currentStep === FormStep.LOCATION && (
          <LocationStep
            data={formData.location}
            onUpdate={updateLocationData}
            onNext={goToNextStep}
          />
        )}

        {currentStep === FormStep.VEHICLE && (
          <VehicleStep
            data={formData.vehicle}
            onUpdate={updateVehicleData}
            onNext={goToNextStep}
            onBack={goToPreviousStep}
          />
        )}

        {currentStep === FormStep.USER_DETAILS && (
          <UserDetailsStep
            data={formData.userDetails}
            isEmergency={formData.location.isEmergency}
            onUpdate={updateUserDetails}
            onNext={goToNextStep}
            onBack={goToPreviousStep}
          />
        )}

        {currentStep === FormStep.CONFIRMATION && (
          <ConfirmationStep
            data={formData}
            onBack={goToPreviousStep}
            onComplete={handleFormComplete}
          />
        )}
      </div>
    </div>
  );
};

export default TowForm;
