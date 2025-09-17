import { Property } from '../types';

export const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Modern Family Home in Suburbia',
    description: 'Beautiful 4-bedroom family home with modern amenities, spacious backyard, and updated kitchen. Perfect for growing families.',
    price: 450000,
    address: '123 Oak Street',
    city: 'Springfield',
    state: 'IL',
    zipCode: '62701',
    bedrooms: 4,
    bathrooms: 3,
    squareFeet: 2500,
    lotSize: 0.5,
    yearBuilt: 2018,
    propertyType: 'house',
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800'
    ],
    features: ['Updated Kitchen', 'Hardwood Floors', 'Central AC', 'Garage', 'Backyard'],
    isForSale: true,
    isForRent: false,
    listingDate: '2024-01-15',
    realtor: {
      name: 'Sarah Johnson',
      phone: '(555) 123-4567',
      email: 'sarah@realestate.com',
      company: 'Premier Realty'
    }
  },
  {
    id: '2',
    title: 'Downtown Luxury Condo',
    description: 'Stunning downtown condo with city views, modern finishes, and premium amenities. Walking distance to restaurants and entertainment.',
    price: 325000,
    address: '456 City Center Blvd',
    city: 'Chicago',
    state: 'IL',
    zipCode: '60601',
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1200,
    yearBuilt: 2020,
    propertyType: 'condo',
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800'
    ],
    features: ['City Views', 'Modern Kitchen', 'In-unit Laundry', 'Gym Access', 'Concierge'],
    isForSale: true,
    isForRent: false,
    listingDate: '2024-01-10',
    realtor: {
      name: 'Michael Chen',
      phone: '(555) 234-5678',
      email: 'michael@luxuryhomes.com',
      company: 'Luxury Living Realty'
    }
  },
  {
    id: '3',
    title: 'Charming Victorian House',
    description: 'Historic Victorian home with original character, updated systems, and beautiful garden. Located in a quiet neighborhood.',
    price: 380000,
    address: '789 Heritage Lane',
    city: 'Evanston',
    state: 'IL',
    zipCode: '60201',
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 1800,
    lotSize: 0.3,
    yearBuilt: 1895,
    propertyType: 'house',
    images: [
      'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800',
      'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800',
      'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800'
    ],
    features: ['Historic Character', 'Updated Systems', 'Garden', 'Hardwood Floors', 'Fireplace'],
    isForSale: true,
    isForRent: false,
    listingDate: '2024-01-08',
    realtor: {
      name: 'Emily Rodriguez',
      phone: '(555) 345-6789',
      email: 'emily@heritagehomes.com',
      company: 'Heritage Properties'
    }
  },
  {
    id: '4',
    title: 'Modern Townhouse',
    description: 'Contemporary townhouse with open floor plan, modern appliances, and private patio. Part of a quiet community.',
    price: 295000,
    address: '321 Maple Court',
    city: 'Naperville',
    state: 'IL',
    zipCode: '60540',
    bedrooms: 3,
    bathrooms: 2.5,
    squareFeet: 1600,
    yearBuilt: 2019,
    propertyType: 'townhouse',
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800'
    ],
    features: ['Open Floor Plan', 'Modern Appliances', 'Private Patio', 'Attached Garage', 'HOA Amenities'],
    isForSale: true,
    isForRent: false,
    listingDate: '2024-01-12',
    realtor: {
      name: 'David Thompson',
      phone: '(555) 456-7890',
      email: 'david@modernliving.com',
      company: 'Modern Living Realty'
    }
  },
  {
    id: '5',
    title: 'Lakeside Retreat',
    description: 'Beautiful lakefront property with stunning water views, private dock, and spacious deck. Perfect for nature lovers.',
    price: 650000,
    address: '555 Lakeview Drive',
    city: 'Lake Geneva',
    state: 'WI',
    zipCode: '53147',
    bedrooms: 4,
    bathrooms: 3,
    squareFeet: 2800,
    lotSize: 1.2,
    yearBuilt: 2015,
    propertyType: 'house',
    images: [
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800'
    ],
    features: ['Lake Views', 'Private Dock', 'Spacious Deck', 'Fireplace', 'Updated Kitchen'],
    isForSale: true,
    isForRent: false,
    listingDate: '2024-01-05',
    realtor: {
      name: 'Lisa Anderson',
      phone: '(555) 567-8901',
      email: 'lisa@lakeproperties.com',
      company: 'Lake Properties Group'
    }
  },
  {
    id: '6',
    title: 'Urban Loft Apartment',
    description: 'Industrial-style loft with exposed brick, high ceilings, and modern amenities. Located in the heart of the arts district.',
    price: 275000,
    address: '888 Arts District Ave',
    city: 'Milwaukee',
    state: 'WI',
    zipCode: '53202',
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 900,
    yearBuilt: 2017,
    propertyType: 'apartment',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800'
    ],
    features: ['Exposed Brick', 'High Ceilings', 'Modern Kitchen', 'In-unit Laundry', 'Arts District Location'],
    isForSale: true,
    isForRent: false,
    listingDate: '2024-01-18',
    realtor: {
      name: 'James Wilson',
      phone: '(555) 678-9012',
      email: 'james@urbanlofts.com',
      company: 'Urban Living Realty'
    }
  }
];
