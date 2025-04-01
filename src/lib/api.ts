
import { toast } from "sonner";
import { LocationData, UserDetails, FormData } from "./types";

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
      timeout: 10000, // Increased timeout for more accurate results
      maximumAge: 0
    });
  });
};

// Format address components into a readable string
const formatAddress = (addressData: any): string => {
  if (!addressData || !addressData.address) {
    return "Address not found";
  }
  
  const components = [];
  const addr = addressData.address;
  
  // Add building number and road
  if (addr.house_number) {
    components.push(`${addr.house_number} ${addr.road || addr.pedestrian || addr.street || ''}`);
  } else if (addr.road || addr.pedestrian || addr.street) {
    components.push(addr.road || addr.pedestrian || addr.street);
  }
  
  // Add neighborhood or suburb
  if (addr.neighbourhood || addr.suburb) {
    components.push(addr.neighbourhood || addr.suburb);
  }
  
  // Add city/town
  if (addr.city || addr.town || addr.village) {
    components.push(addr.city || addr.town || addr.village);
  }
  
  // Add state/county
  if (addr.state || addr.county) {
    components.push(addr.state || addr.county);
  }
  
  // Add postal code
  if (addr.postcode) {
    components.push(addr.postcode);
  }
  
  // Add country
  if (addr.country) {
    components.push(addr.country);
  }
  
  // Join all components with commas
  return components.filter(Boolean).join(", ");
};

// Convert coordinates to address using reverse geocoding with OpenStreetMap Nominatim
export const getAddressFromCoordinates = async (
  latitude: number, 
  longitude: number
): Promise<string> => {
  try {
    console.log(`Getting address for coordinates: ${latitude}, ${longitude}`);
    
    // Using OpenStreetMap Nominatim API for reverse geocoding with more detailed data
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&zoom=18`,
      {
        headers: {
          "Accept-Language": "en",
          "User-Agent": "WeTow Application/1.0" // More professional user agent
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to get address: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log("Nominatim response:", data);
    
    // Use the structured formatter to create a cleaner address
    const formattedAddress = formatAddress(data);
    
    return formattedAddress || data.display_name || `Location at ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
  } catch (error) {
    console.error("Error getting address from coordinates:", error);
    toast.error("Failed to get your precise address. Using approximate location.");
    return `Location near: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
  }
};

// Search for an address using text input (autocomplete)
export const searchAddressByText = async (searchText: string): Promise<{ address: string; latitude: number; longitude: number }[]> => {
  try {
    console.log(`Searching for address: ${searchText}`);
    
    if (!searchText || searchText.length < 3) return [];
    
    // Using OpenStreetMap Nominatim API for geocoding address search
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchText)}&format=json&addressdetails=1&limit=5`,
      {
        headers: {
          "Accept-Language": "en",
          "User-Agent": "WeTow Application/1.0"
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to search addresses: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log("Nominatim search response:", data);
    
    // Map the response to our expected format
    return data.map((item: any) => ({
      address: item.display_name || formatAddress(item),
      latitude: parseFloat(item.lat),
      longitude: parseFloat(item.lon)
    }));
  } catch (error) {
    console.error("Error searching for address:", error);
    toast.error("Failed to search for addresses");
    return [];
  }
};

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
