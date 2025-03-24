
import { toast } from "sonner";
import { LocationData, UserDetails, FormData } from "./types";

// Simulate DVLA API for vehicle lookup
export const lookupVehicleDetails = async (registrationNumber: string): Promise<{ make?: string; model?: string }> => {
  try {
    // This is a mock function - in production, this would call the actual DVLA API
    console.log(`Looking up vehicle with reg number: ${registrationNumber}`);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // For demo purposes, return mock data based on the first letter of the reg number
    const firstChar = registrationNumber.charAt(0).toLowerCase();
    
    const mockVehicles: Record<string, { make: string; model: string }> = {
      a: { make: "Audi", model: "A4" },
      b: { make: "BMW", model: "3 Series" },
      f: { make: "Ford", model: "Focus" },
      h: { make: "Honda", model: "Civic" },
      m: { make: "Mercedes", model: "C-Class" },
      n: { make: "Nissan", model: "Qashqai" },
      t: { make: "Toyota", model: "Corolla" },
      v: { make: "Volkswagen", model: "Golf" },
    };
    
    // Return vehicle data if found, otherwise undefined
    return mockVehicles[firstChar] || { make: "Unknown", model: "Unknown" };
  } catch (error) {
    console.error("Error looking up vehicle:", error);
    toast.error("Failed to lookup vehicle details");
    return {};
  }
};

// Get current location using browser geolocation
export const getCurrentLocation = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      reject(new Error("Geolocation not supported"));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    });
  });
};

// Convert coordinates to address using reverse geocoding
export const getAddressFromCoordinates = async (
  latitude: number, 
  longitude: number
): Promise<string> => {
  try {
    // This is a mock function - in production, would use a geocoding service like Google Maps API
    console.log(`Getting address for coordinates: ${latitude}, ${longitude}`);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Return mock address
    return "123 Current Location St, London";
  } catch (error) {
    console.error("Error getting address from coordinates:", error);
    toast.error("Failed to get your address");
    return "";
  }
};

// Search for an address using text input (autocomplete)
export const searchAddressByText = async (searchText: string): Promise<{ address: string; latitude: number; longitude: number }[]> => {
  try {
    // This is a mock function - in production, would use Places API or similar
    console.log(`Searching for address: ${searchText}`);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock address results
    if (!searchText || searchText.length < 3) return [];
    
    const mockResults = [
      { address: `${searchText} Main Street, London`, latitude: 51.509865, longitude: -0.118092 },
      { address: `${searchText} High Road, Manchester`, latitude: 53.483959, longitude: -2.244644 },
      { address: `${searchText} Bridge Avenue, Birmingham`, latitude: 52.489471, longitude: -1.898575 }
    ];
    
    return mockResults;
  } catch (error) {
    console.error("Error searching for address:", error);
    toast.error("Failed to search for addresses");
    return [];
  }
};

// Submit the completed form data to your backend
export const submitForm = async (formData: FormData): Promise<{ orderId: string }> => {
  try {
    // This is a mock function - in production, would send data to your server
    console.log("Submitting form data:", formData);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate a random order ID
    const orderId = `TOW-${Math.floor(100000 + Math.random() * 900000)}`;
    
    // Mock sending confirmation emails and SMS
    console.log(`Sending confirmation email to ${formData.userDetails.email}`);
    console.log(`Sending confirmation SMS to ${formData.userDetails.phoneNumber}`);
    
    return { orderId };
  } catch (error) {
    console.error("Error submitting form:", error);
    throw new Error("Failed to submit form");
  }
};
