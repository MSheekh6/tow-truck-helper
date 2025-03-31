import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { LocationData, LocationOption } from "@/lib/types";
import { MapPinIcon, SearchIcon, PenIcon, ArrowRightIcon, AlertTriangleIcon } from "lucide-react";
import { 
  getCurrentLocation, 
  getAddressFromCoordinates, 
  searchAddressByText,
  lookupVehicleDetails
} from "@/lib/api";

interface LocationStepProps {
  data: LocationData;
  onUpdate: (data: Partial<LocationData>) => void;
  onNext: () => void;
}

const LocationStep: React.FC<LocationStepProps> = ({ data, onUpdate, onNext }) => {
  const [locationOption, setLocationOption] = useState<LocationOption>(LocationOption.CURRENT);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{ address: string; latitude: number; longitude: number }[]>([]);
  const [isLookingUpVehicle, setIsLookingUpVehicle] = useState(false);
  const [regNumber, setRegNumber] = useState(data.vehicleRegNumber || "");
  const destinationOptions = [
    "Garage or repair center",
    "Home address",
    "Dealership",
    "Custom location"
  ];
  const [customDestination, setCustomDestination] = useState("");
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);

  // Effect for address search debounce
  useEffect(() => {
    if (searchQuery.length < 3) {
      setSearchResults([]);
      return;
    }

    const handler = setTimeout(async () => {
      const results = await searchAddressByText(searchQuery);
      setSearchResults(results);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Get current location using browser geolocation
  const handleGetCurrentLocation = async () => {
    setIsLoadingLocation(true);
    try {
      const position = await getCurrentLocation();
      const { latitude, longitude } = position.coords;
      
      toast.success("Location detected, fetching address...");
      
      const address = await getAddressFromCoordinates(latitude, longitude);
      
      onUpdate({ 
        address, 
        latitude, 
        longitude 
      });
      
      toast.success("Your location has been successfully detected");
    } catch (error) {
      console.error("Error getting current location:", error);
      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            toast.error("Location permission denied. Please allow location access and try again.");
            break;
          case error.POSITION_UNAVAILABLE:
            toast.error("Location information is unavailable.");
            break;
          case error.TIMEOUT:
            toast.error("Location request timed out.");
            break;
          default:
            toast.error("Failed to get your location. Please try another method.");
        }
      } else {
        toast.error("Failed to get your location. Please try another method.");
      }
    } finally {
      setIsLoadingLocation(false);
    }
  };

  // Select a location from search results
  const handleSelectLocation = (result: { address: string; latitude: number; longitude: number }) => {
    onUpdate({ 
      address: result.address, 
      latitude: result.latitude, 
      longitude: result.longitude 
    });
    setSearchResults([]);
    setSearchQuery(result.address);
    toast.success("Location selected");
  };

  // Update manual address
  const handleManualAddressChange = (address: string) => {
    onUpdate({ 
      address, 
      latitude: null, 
      longitude: null 
    });
  };

  // Look up vehicle by registration number
  const handleLookupVehicle = async () => {
    if (!regNumber.trim()) {
      toast.error("Please enter a vehicle registration number");
      return;
    }
    
    setIsLookingUpVehicle(true);
    try {
      const vehicleDetails = await lookupVehicleDetails(regNumber);
      
      if (vehicleDetails.make && vehicleDetails.model) {
        onUpdate({ 
          vehicleRegNumber: regNumber,
          vehicleMake: vehicleDetails.make,
          vehicleModel: vehicleDetails.model
        });
        toast.success(`Vehicle found: ${vehicleDetails.make} ${vehicleDetails.model}`);
      } else {
        onUpdate({ vehicleRegNumber: regNumber });
        toast.warning("Vehicle details not found. You can continue anyway.");
      }
    } catch (error) {
      console.error("Error looking up vehicle:", error);
      toast.error("Failed to lookup vehicle details");
    } finally {
      setIsLookingUpVehicle(false);
    }
  };

  // Handle destination selection
  const handleDestinationSelect = (destination: string) => {
    if (destination === "Custom location") {
      setSelectedDestination(destination);
    } else {
      setSelectedDestination(destination);
      onUpdate({ destinationAddress: destination });
      setCustomDestination("");
    }
  };

  // Handle custom destination input
  const handleCustomDestinationChange = (value: string) => {
    setCustomDestination(value);
    onUpdate({ destinationAddress: value });
  };

  // Handle emergency checkbox
  const handleEmergencyChange = (checked: boolean) => {
    onUpdate({ isEmergency: checked });
  };

  // Validate and proceed to next step
  const handleNext = () => {
    if (!data.address) {
      toast.error("Please provide your current location");
      return;
    }
    
    if (!data.vehicleRegNumber) {
      toast.error("Please enter your vehicle registration number");
      return;
    }
    
    onNext();
  };

  return (
    <div className="animate-fade-in">
      <Card className="glass-card overflow-hidden">
        <CardContent className="p-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-medium mb-1">Where are you located?</h2>
              <p className="text-muted-foreground mb-4">
                We need your location to send assistance to you
              </p>
              
              <Tabs 
                defaultValue={locationOption} 
                onValueChange={(value) => setLocationOption(value as LocationOption)}
                className="w-full"
              >
                <TabsList className="grid grid-cols-3 mb-6">
                  <TabsTrigger value={LocationOption.CURRENT} className="flex items-center gap-1.5">
                    <MapPinIcon className="h-4 w-4" />
                    <span>Current Location</span>
                  </TabsTrigger>
                  <TabsTrigger value={LocationOption.SEARCH} className="flex items-center gap-1.5">
                    <SearchIcon className="h-4 w-4" />
                    <span>Search</span>
                  </TabsTrigger>
                  <TabsTrigger value={LocationOption.MANUAL} className="flex items-center gap-1.5">
                    <PenIcon className="h-4 w-4" />
                    <span>Manual Entry</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value={LocationOption.CURRENT} className="mt-0">
                  <div className="space-y-4">
                    <Button
                      onClick={handleGetCurrentLocation}
                      disabled={isLoadingLocation}
                      className="w-full"
                    >
                      {isLoadingLocation ? "Detecting Location..." : "Detect My Current Location"}
                    </Button>
                    
                    {data.address && data.latitude && data.longitude && (
                      <div className="rounded-md bg-secondary p-3 animate-fade-in">
                        <p className="font-medium">Detected Location:</p>
                        <p className="text-muted-foreground">{data.address}</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value={LocationOption.SEARCH} className="mt-0">
                  <div className="space-y-4">
                    <div className="relative">
                      <Input
                        placeholder="Start typing your address..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full"
                      />
                      
                      {searchResults.length > 0 && (
                        <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto border animate-fade-in">
                          {searchResults.map((result, index) => (
                            <div 
                              key={index} 
                              className="p-2 hover:bg-muted cursor-pointer"
                              onClick={() => handleSelectLocation(result)}
                            >
                              {result.address}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {data.address && (
                      <div className="rounded-md bg-secondary p-3 animate-fade-in">
                        <p className="font-medium">Selected Location:</p>
                        <p className="text-muted-foreground">{data.address}</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value={LocationOption.MANUAL} className="mt-0">
                  <div className="space-y-4">
                    <Input
                      placeholder="Enter your address manually"
                      value={data.address || ""}
                      onChange={(e) => handleManualAddressChange(e.target.value)}
                      className="w-full"
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="pt-4 border-t">
              <h3 className="text-lg font-medium mb-3">Where would you like to go?</h3>
              <p className="text-muted-foreground mb-4">
                Select a destination (optional)
              </p>
              
              <div className="grid grid-cols-2 gap-2 mb-4">
                {destinationOptions.map((option) => (
                  <Button
                    key={option}
                    variant={selectedDestination === option ? "default" : "outline"}
                    className="justify-start"
                    onClick={() => handleDestinationSelect(option)}
                  >
                    {option}
                  </Button>
                ))}
              </div>
              
              {selectedDestination === "Custom location" && (
                <Input
                  placeholder="Enter custom destination"
                  value={customDestination}
                  onChange={(e) => handleCustomDestinationChange(e.target.value)}
                  className="w-full mt-2"
                />
              )}
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center space-x-2 mb-6">
                <Checkbox 
                  id="emergency" 
                  checked={data.isEmergency}
                  onCheckedChange={handleEmergencyChange}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label 
                    htmlFor="emergency" 
                    className="flex items-center font-medium cursor-pointer"
                  >
                    <AlertTriangleIcon className="h-4 w-4 mr-1.5 text-destructive" />
                    This is an emergency
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Check this if you require immediate assistance
                  </p>
                </div>
              </div>
              
              <h3 className="text-lg font-medium mb-3">Vehicle Information</h3>
              <div className="flex space-x-2">
                <Input
                  placeholder="Vehicle Registration Number"
                  value={regNumber}
                  onChange={(e) => setRegNumber(e.target.value.toUpperCase())}
                  className="w-full"
                />
                <Button 
                  onClick={handleLookupVehicle} 
                  disabled={isLookingUpVehicle}
                  variant="secondary"
                >
                  {isLookingUpVehicle ? "Looking up..." : "Lookup"}
                </Button>
              </div>
              
              {data.vehicleMake && data.vehicleModel && (
                <div className="rounded-md bg-secondary p-3 mt-4 animate-fade-in">
                  <p className="font-medium">Vehicle Details:</p>
                  <p className="text-muted-foreground">
                    {data.vehicleMake} {data.vehicleModel}
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex justify-end pt-4">
              <Button onClick={handleNext} className="group">
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

export default LocationStep;
