import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { drockAPI, DrockSearchParams } from '../../services/api';
import type { Property } from './propertiesSlice';

/** Raw property shape from drock API. */
export interface DrockPropertyRaw {
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
  lotSize?: number | null;
  yearBuilt?: number | null;
  propertyType: string;
  isForSale: boolean;
  isForRent: boolean;
  listingDate: string;
  images: string[];
  features: string[];
  realtor: {
    id?: string;
    name: string;
    phone: string;
    email: string;
    company: string;
  };
  latitude?: number;
  longitude?: number;
}

/** Raw property shape from hasdata/Zillow-style API (requestMetadata.json). */
export interface HasdataPropertyRaw {
  id: string;
  url?: string;
  homeType?: string;
  image?: string;
  status?: string;
  currency?: string;
  price: number;
  daysOnZillow?: number;
  area?: number;
  lotAreaValue?: number;
  lotAreaUnits?: string | null;
  addressRaw?: string;
  address?: { street?: string; city?: string; state?: string; zipcode?: string };
  latitude?: number;
  longitude?: number;
  listingDetails?: { isNewHome?: boolean };
  mediaDetails?: { has3DModel?: boolean; hasVideo?: boolean };
  photos?: string[];
  bedrooms?: number;
  bathrooms?: number;
  beds?: number;
  baths?: number;
}

/** Hasdata/Zillow search API response shape. */
export interface HasdataSearchResponse {
  requestMetadata?: { id?: string; status?: string; html?: string; json?: string; url?: string };
  searchInformation?: { totalResults?: number };
  properties?: HasdataPropertyRaw[];
  pagination?: { currentPage?: number; nextPage?: string; otherPages?: Record<string, string> };
}

function normalizeDrockProperty(raw: DrockPropertyRaw): Property {
  return {
    id: raw.id,
    title: raw.title,
    description: raw.description,
    price: raw.price,
    address: raw.address,
    city: raw.city,
    state: raw.state,
    zipCode: raw.zipCode,
    bedrooms: raw.bedrooms,
    bathrooms: raw.bathrooms,
    squareFeet: raw.squareFeet,
    lotSize: raw.lotSize ?? undefined,
    yearBuilt: raw.yearBuilt ?? undefined,
    propertyType: raw.propertyType,
    isForSale: raw.isForSale,
    isForRent: raw.isForRent,
    listingDate: raw.listingDate,
    images: Array.isArray(raw.images) ? raw.images : [],
    features: Array.isArray(raw.features) ? raw.features : [],
    realtor: {
      id: raw.realtor?.id ?? '',
      name: raw.realtor?.name ?? '',
      phone: raw.realtor?.phone ?? '',
      email: raw.realtor?.email ?? '',
      company: raw.realtor?.company ?? '',
    },
    latitude: raw.latitude,
    longitude: raw.longitude,
  };
}

function normalizeHasdataProperty(raw: HasdataPropertyRaw): Property {
  const addr = raw.address;
  const street = addr?.street ?? '';
  const city = addr?.city ?? '';
  const state = addr?.state ?? '';
  const zipCode = addr?.zipcode ?? '';
  const address = raw.addressRaw ?? ([street, city, state, zipCode].filter(Boolean).join(', ') || raw.id);
  const isForSale = (raw.status ?? '').toUpperCase() === 'FOR_SALE';
  const isForRent = (raw.status ?? '').toUpperCase() === 'FOR_RENT';
  const images = Array.isArray(raw.photos) && raw.photos.length > 0
    ? raw.photos
    : raw.image
      ? [raw.image]
      : [];
  const propType = (raw.homeType ?? 'SINGLE_FAMILY').toLowerCase().replace(/_/g, '');
  const propertyType =
    propType.includes('single') || propType.includes('family') || propType.includes('house')
      ? 'house'
      : propType.includes('condo')
        ? 'condo'
        : propType.includes('town')
          ? 'townhouse'
          : propType.includes('apartment') || propType.includes('apt')
            ? 'apartment'
            : 'house';

  return {
    id: String(raw.id),
    title: address,
    description: '',
    price: raw.price,
    address,
    city,
    state,
    zipCode,
    bedrooms: raw.bedrooms ?? raw.beds ?? 0,
    bathrooms: raw.bathrooms ?? raw.baths ?? 0,
    squareFeet: raw.area ?? 0,
    lotSize: raw.lotAreaValue ?? undefined,
    yearBuilt: undefined,
    propertyType,
    isForSale,
    isForRent,
    listingDate: '',
    images,
    features: [],
    realtor: { id: '', name: '', phone: '', email: '', company: '' },
    latitude: raw.latitude,
    longitude: raw.longitude,
  };
}

/** Drock search API response shape */
interface DrockSearchResponse {
  items?: DrockPropertyRaw[];
  Items?: DrockPropertyRaw[];
  totalCount?: number;
  page?: number;
  pageSize?: number;
}

export interface DrockSearchState {
  results: Property[];
  totalCount: number;
  page: number;
  pageSize: number;
  loading: boolean;
  error: string | null;
}

const initialState: DrockSearchState = {
  results: [],
  totalCount: 0,
  page: 1,
  pageSize: 10,
  loading: false,
  error: null,
};

function isHasdataResponse(data: unknown): data is HasdataSearchResponse {
  return (
    data != null &&
    typeof data === 'object' &&
    Array.isArray((data as HasdataSearchResponse).properties)
  );
}

export const fetchDrockSearch = createAsyncThunk(
  'drockSearch/fetch',
  async (params: DrockSearchParams = {}, { rejectWithValue }) => {
    try {
      const data = (await drockAPI.search(params)) as
        | DrockSearchResponse
        | HasdataSearchResponse
        | DrockPropertyRaw[];

      if (isHasdataResponse(data)) {
        const rawProperties = data.properties ?? [];
        const totalCount = data.searchInformation?.totalResults ?? rawProperties.length;
        const page = data.pagination?.currentPage ?? 1;
        const pageSize = rawProperties.length || 20;
        const items = rawProperties.map((raw) => normalizeHasdataProperty(raw));
        return { items, totalCount, page, pageSize };
      }

      const rawItems: DrockPropertyRaw[] = Array.isArray(data)
        ? data
        : (data as DrockSearchResponse)?.items ?? (data as DrockSearchResponse)?.Items ?? [];
      const totalCount =
        !Array.isArray(data) && typeof (data as DrockSearchResponse)?.totalCount === 'number'
          ? (data as DrockSearchResponse).totalCount
          : Array.isArray(data)
            ? data.length
            : rawItems.length;
      const page =
        !Array.isArray(data) && typeof (data as DrockSearchResponse)?.page === 'number'
          ? (data as DrockSearchResponse).page
          : 1;
      const pageSize =
        !Array.isArray(data) && typeof (data as DrockSearchResponse)?.pageSize === 'number'
          ? (data as DrockSearchResponse).pageSize
          : rawItems.length || 10;
      const items = rawItems.map((raw) => normalizeDrockProperty(raw));
      return { items, totalCount, page, pageSize };
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Drock search failed');
    }
  }
);

/** Load search results from a hasdata/Zillow JSON URL (e.g. requestMetadata.json). */
export const fetchHasdataByUrl = createAsyncThunk(
  'drockSearch/fetchHasdataByUrl',
  async (jsonUrl: string, { rejectWithValue }) => {
    try {
      const res = await fetch(jsonUrl);
      const data = (await res.json().catch(() => ({}))) as HasdataSearchResponse;
      if (!res.ok) {
        throw new Error((data as { message?: string })?.message ?? `Request failed: ${res.status}`);
      }
      if (!Array.isArray(data.properties)) {
        throw new Error('Invalid hasdata response: missing properties array');
      }
      const rawProperties = data.properties;
      const totalCount = data.searchInformation?.totalResults ?? rawProperties.length;
      const page = data.pagination?.currentPage ?? 1;
      const pageSize = rawProperties.length || 20;
      const items = rawProperties.map((raw) => normalizeHasdataProperty(raw));
      return { items, totalCount, page, pageSize };
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Hasdata fetch failed');
    }
  }
);

const drockSearchSlice = createSlice({
  name: 'drockSearch',
  initialState,
  reducers: {
    /** Set search results from raw hasdata/Zillow JSON (e.g. paste or import). */
    setSearchResultsFromHasdata(state, action: { payload: HasdataSearchResponse }) {
      const data = action.payload;
      const rawProperties = data.properties ?? [];
      state.results = rawProperties.map((raw) => normalizeHasdataProperty(raw));
      state.totalCount = data.searchInformation?.totalResults ?? rawProperties.length ?? 0;
      state.page = data.pagination?.currentPage ?? 1;
      state.pageSize = rawProperties.length > 0 ? rawProperties.length : 20;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDrockSearch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDrockSearch.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload.items;
        state.totalCount = action.payload.totalCount ?? 0;
        state.page = action.payload.page ?? 1;
        state.pageSize = action.payload.pageSize ?? 20;
        state.error = null;
      })
      .addCase(fetchDrockSearch.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error.message || 'Search failed';
      })
      .addCase(fetchHasdataByUrl.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHasdataByUrl.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload.items;
        state.totalCount = action.payload.totalCount ?? 0;
        state.page = action.payload.page ?? 1;
        state.pageSize = action.payload.pageSize ?? 20;
        state.error = null;
      })
      .addCase(fetchHasdataByUrl.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error.message || 'Hasdata fetch failed';
      });
  },
});

export const { setSearchResultsFromHasdata } = drockSearchSlice.actions;
export default drockSearchSlice.reducer;
