import { toast } from "sonner";
import { LocationData, UserDetails, FormData } from "./types";

// Get current location using browser geolocation with maximum accuracy
export const getCurrentLocation = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      reject(new Error("Geolocation not supported"));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 15000, // Increased timeout for more accurate results
      maximumAge: 0 // Always get fresh position
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
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&zoom=18&namedetails=1`,
      {
        headers: {
          "Accept-Language": "en",
          "User-Agent": "WeTow Application/1.0"
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

// Search for an address using text input (autocomplete), limited to UK addresses
export const searchAddressByText = async (searchText: string): Promise<{ address: string; latitude: number; longitude: number }[]> => {
  try {
    console.log(`Searching for address in UK: ${searchText}`);
    
    if (!searchText || searchText.length < 3) return [];
    
    // Using OpenStreetMap Nominatim API for geocoding address search
    // Adding countrycodes=gb to limit results to UK only
    // Adding bounded=1 to prioritize results in the viewbox (UK area)
    // Increasing limit to find more potential matches
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchText)}&format=json&addressdetails=1&limit=10&countrycodes=gb&bounded=1&viewbox=-10.5,49.5,1.8,61&dedupe=1`,
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
    console.log("Nominatim UK search response:", data);
    
    // If no results found, try a more general search within UK
    if (data.length === 0) {
      console.log("No results found, trying broader search within UK");
      const broadResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchText)}, UK&format=json&addressdetails=1&limit=10&countrycodes=gb`,
        {
          headers: {
            "Accept-Language": "en",
            "User-Agent": "WeTow Application/1.0"
          }
        }
      );
      
      if (broadResponse.ok) {
        const broadData = await broadResponse.json();
        console.log("Nominatim broader UK search response:", broadData);
        data.push(...broadData);
      }
    }
    
    // Filter to ensure only UK results
    const ukResults = data.filter((item: any) => {
      const country = item.address?.country || '';
      return country.toLowerCase().includes('kingdom') || 
             country.toLowerCase().includes('uk') || 
             country.toLowerCase() === 'gb' ||
             country.toLowerCase() === 'great britain';
    });
    
    // Map the response to our expected format
    return ukResults.map((item: any) => ({
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

// Use DVLA API for vehicle lookup
export const lookupVehicleDetails = async (registrationNumber: string): Promise<{ make?: string; model?: string }> => {
  try {
    // Make sure we have a registration number
    if (!registrationNumber || registrationNumber.trim() === "") {
      return {};
    }
    
    console.log(`Looking up vehicle with reg number: ${registrationNumber}`);
    
    // Format the registration number (remove spaces)
    const formattedRegNumber = registrationNumber.trim().replace(/\s+/g, "").toUpperCase();
    
    // Using the DVLA Open Data API
    const response = await fetch(
      `https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles`, 
      {
        method: 'POST',
        headers: {
          'x-api-key': 'klRFwNPmQdzfIyF3XSIeaX6wv47eUGM1V7kQgNof',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          registrationNumber: formattedRegNumber
        })
      }
    );
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("DVLA API error:", errorData);
      
      // Handle specific error codes
      if (response.status === 400) {
        toast.error("Please enter a valid vehicle registration number");
      } else if (response.status === 404) {
        toast.error("Vehicle not found. Please check registration number");
      } else {
        toast.error("Failed to lookup vehicle details");
      }
      
      return {};
    }
    
    const data = await response.json();
    console.log("DVLA API response:", data);
    
    // Extract make and model from the response
    return {
      make: data.make || "Unknown",
      model: data.model || "Unknown"
    };
  } catch (error) {
    console.error("Error looking up vehicle:", error);
    toast.error("Failed to lookup vehicle details");
    
    // For development fallback, use the mocked data if the API fails
    if (process.env.NODE_ENV !== 'production') {
      console.log("Using fallback mock data for development");
      
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
      
      return mockVehicles[firstChar] || { make: "Unknown", model: "Unknown" };
    }
    
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
