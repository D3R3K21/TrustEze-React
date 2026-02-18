// Export Redux types for use across the app
export type { 
  User as AuthUser, 
  AuthState 
} from '../store/slices/authSlice';

export type { 
  Property, 
  Realtor, 
  PagedResult 
} from '../store/slices/propertiesSlice';

export type { 
  UserProfile, 
  UserState 
} from '../store/slices/userSlice';

// Legacy types for backward compatibility with existing code
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  lotSize?: number;
  yearBuilt?: number;
  propertyType: 'house' | 'condo' | 'townhouse' | 'apartment';
  images: string[];
  features: string[];
  isForSale: boolean;
  isForRent: boolean;
  listingDate: string;
  realtor: {
    name: string;
    phone: string;
    email: string;
    company: string;
  };
  latitude?: number;
  longitude?: number;
}

/** Risk level for filter (matches utils/riskRating). */
export type SearchFilterRiskLevel = 'high' | 'medium' | 'low';

export interface SearchFilters {
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  minSquareFeet?: number;
  maxSquareFeet?: number;
  propertyType?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  /** Keyword search (title, address, city). */
  keyword?: string;
  /** Multi-state filter. */
  states?: string[];
  /** Risk levels to include. */
  riskLevels?: SearchFilterRiskLevel[];
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}
