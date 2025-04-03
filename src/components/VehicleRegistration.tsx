
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { lookupVehicleDetails } from "@/lib/api";
import { toast } from "sonner";
import { CarIcon, SearchIcon, RefreshCwIcon } from "lucide-react";

interface VehicleRegistrationProps {
  value: string;
  onChange: (value: string) => void;
  onVehicleFound: (make: string, model: string) => void;
}

const VehicleRegistration: React.FC<VehicleRegistrationProps> = ({
  value,
  onChange,
  onVehicleFound,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastLookup, setLastLookup] = useState("");

  const handleLookup = async () => {
    if (!value || value.trim() === "") {
      toast.error("Please enter a vehicle registration number");
      return;
    }

    // Format registration number
    const formattedReg = value.trim().toUpperCase();
    
    // Don't duplicate lookups unless forced
    if (formattedReg === lastLookup) {
      toast.info("Already looked up this registration number");
      return;
    }

    setIsLoading(true);
    setLastLookup(formattedReg);
    
    try {
      toast.info(`Looking up ${formattedReg}...`);
      console.log(`Starting lookup for vehicle: ${formattedReg}`);
      
      const vehicleData = await lookupVehicleDetails(formattedReg);
      console.log("Vehicle data returned:", vehicleData);
      
      if (vehicleData.make && vehicleData.model) {
        // Successfully found vehicle data
        onVehicleFound(vehicleData.make, vehicleData.model);
        toast.success(`Vehicle found: ${vehicleData.make} ${vehicleData.model}`);
      } else {
        // No data returned
        toast.error("Vehicle not found or registration number is invalid");
      }
    } catch (error) {
      console.error("Error during vehicle lookup:", error);
      toast.error("Error looking up vehicle details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const forceRefresh = () => {
    setLastLookup(""); // Clear last lookup to force a new one
    handleLookup();
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="registration" className="font-medium">
          Vehicle Registration
        </Label>
        <div className="flex gap-2">
          <div className="relative w-full">
            <Input
              id="registration"
              placeholder="Enter registration number"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="pl-10"
              maxLength={8}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleLookup();
                }
              }}
            />
            <CarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          </div>
          <Button 
            onClick={handleLookup} 
            disabled={isLoading}
            type="button"
          >
            {isLoading ? "Searching..." : "Search"}
            {!isLoading && <SearchIcon className="ml-2 h-4 w-4" />}
          </Button>
          {lastLookup && (
            <Button
              onClick={forceRefresh}
              variant="outline"
              type="button"
              title="Refresh lookup"
              disabled={isLoading}
            >
              <RefreshCwIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          Enter your vehicle registration to automatically lookup the make and model
        </p>
      </div>
    </div>
  );
};

export default VehicleRegistration;
