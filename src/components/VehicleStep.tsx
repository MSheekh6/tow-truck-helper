
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { VehicleData } from "@/lib/types";
import { toast } from "sonner";
import { ArrowLeftIcon, ArrowRightIcon, CarIcon } from "lucide-react";
import VehicleRegistration from "./VehicleRegistration";

interface VehicleStepProps {
  data: VehicleData;
  onUpdate: (data: Partial<VehicleData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const VehicleStep: React.FC<VehicleStepProps> = ({ data, onUpdate, onNext, onBack }) => {
  // Update engine status
  const handleEngineStatusChange = (checked: boolean) => {
    onUpdate({ engineWorks: checked });
  };
  
  // Update if the car can move
  const handleCanMoveChange = (checked: boolean) => {
    onUpdate({ canMove: checked });
  };
  
  // Update vehicle weight
  const handleWeightChange = (value: string) => {
    onUpdate({ weight: value });
  };
  
  // Update vehicle registration
  const handleRegNumberChange = (value: string) => {
    onUpdate({ regNumber: value });
  };
  
  // Handle vehicle found from lookup
  const handleVehicleFound = (make: string, model: string) => {
    onUpdate({ 
      make: make,
      model: model
    });
  };
  
  // Validate and proceed to next step
  const handleNext = () => {
    // Both checkboxes are required, but weight is optional
    if (data.engineWorks === undefined || data.canMove === undefined) {
      toast.error("Please answer all required questions");
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
                <CarIcon className="h-8 w-8 text-primary" />
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-medium text-center mb-6">Vehicle Details</h2>
              <p className="text-muted-foreground text-center mb-8">
                Please provide information about your vehicle
              </p>
              
              <div className="space-y-6">
                {/* Vehicle Registration Lookup */}
                <div className="p-4 rounded-lg bg-secondary/30 space-y-4">
                  <VehicleRegistration 
                    value={data.regNumber || ''}
                    onChange={handleRegNumberChange}
                    onVehicleFound={handleVehicleFound}
                  />
                  
                  {(data.make || data.model) && (
                    <div className="mt-4 p-3 bg-white/60 rounded-md">
                      <p className="text-sm font-medium">Vehicle Details:</p>
                      <p className="text-sm">
                        {data.make && <span className="font-semibold">Make: </span>}{data.make}
                      </p>
                      <p className="text-sm">
                        {data.model && <span className="font-semibold">Model: </span>}{data.model}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="flex items-start space-x-3 p-4 rounded-lg bg-secondary/50">
                  <Checkbox 
                    id="engineWorks" 
                    checked={data.engineWorks}
                    onCheckedChange={handleEngineStatusChange}
                    className="mt-1"
                  />
                  <div>
                    <Label 
                      htmlFor="engineWorks" 
                      className="text-lg font-medium cursor-pointer"
                    >
                      Does the engine work?
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Can you start the vehicle and keep it running?
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-4 rounded-lg bg-secondary/50">
                  <Checkbox 
                    id="canMove" 
                    checked={data.canMove}
                    onCheckedChange={handleCanMoveChange}
                    className="mt-1"
                  />
                  <div>
                    <Label 
                      htmlFor="canMove" 
                      className="text-lg font-medium cursor-pointer"
                    >
                      Can the car still move?
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Is the vehicle able to roll or drive, even if with difficulty?
                    </p>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Label htmlFor="weight" className="text-lg font-medium mb-2 block">
                    Approximate vehicle weight (optional)
                  </Label>
                  <p className="text-sm text-muted-foreground mb-4">
                    If you know the weight of your vehicle, please provide it to help us send the appropriate equipment
                  </p>
                  <Input
                    id="weight"
                    placeholder="e.g. 1500kg"
                    value={data.weight || ""}
                    onChange={(e) => handleWeightChange(e.target.value)}
                  />
                </div>
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
                <span>Continue</span>
                <ArrowRightIcon className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VehicleStep;
