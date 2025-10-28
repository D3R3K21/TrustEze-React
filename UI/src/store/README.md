# Redux Store Setup

This project uses Redux Toolkit for state management. The store is organized into three main slices:

## Store Structure

```
store/
├── slices/
│   ├── authSlice.ts      # Authentication state (login, register, logout)
│   ├── propertiesSlice.ts # Properties data (search, fetch, filters)
│   └── userSlice.ts      # User-specific data (profile, saved properties, recently viewed)
├── store.ts              # Store configuration
└── hooks.ts              # Typed hooks for use in components
```

---

## Usage Examples

### Authentication

```typescript
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginUser, logoutUser, clearError } from '../store/slices/authSlice';

function LoginComponent() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading, error } = useAppSelector(
    (state) => state.auth
  );

  const handleLogin = async (email: string, password: string) => {
    try {
      await dispatch(loginUser({ email, password })).unwrap();
      // Login successful
    } catch (err) {
      // Handle error
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
  };
}
```

### Properties

```typescript
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { 
  fetchProperties, 
  fetchFeaturedProperties,
  setFilters 
} from '../store/slices/propertiesSlice';

function PropertiesComponent() {
  const dispatch = useAppDispatch();
  const { properties, featuredProperties, isLoading, totalCount } = useAppSelector(
    (state) => state.properties
  );

  // Fetch properties with filters
  const searchProperties = async () => {
    const params = {
      minPrice: 100000,
      maxPrice: 500000,
      bedrooms: 3,
      page: 1,
      pageSize: 10
    };
    await dispatch(fetchProperties(params)).unwrap();
  };

  // Fetch featured properties
  const getFeatured = async () => {
    await dispatch(fetchFeaturedProperties()).unwrap();
  };

  // Update filters
  const updateFilters = () => {
    dispatch(setFilters({ city: 'San Francisco', bedrooms: 2 }));
  };
}
```

### User Profile

```typescript
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchUserProfile } from '../store/slices/userSlice';

function ProfileComponent() {
  const dispatch = useAppDispatch();
  const { profile, savedProperties, recentlyViewed } = useAppSelector(
    (state) => state.user
  );

  // Fetch user profile
  const loadProfile = async () => {
    try {
      await dispatch(fetchUserProfile()).unwrap();
    } catch (err) {
      // Handle error
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);
}
```

---

## Available Slices

### Auth Slice (`authSlice.ts`)

**State:**
- `user`: Current user object
- `token`: JWT token
- `isAuthenticated`: Boolean flag
- `isLoading`: Loading state
- `error`: Error message

**Actions:**
- `loginUser(email, password)` - Login user
- `registerUser(data)` - Register new user
- `logoutUser()` - Logout user
- `clearError()` - Clear error message

### Properties Slice (`propertiesSlice.ts`)

**State:**
- `properties`: Array of properties
- `featuredProperties`: Array of featured properties
- `currentProperty`: Currently viewed property
- `totalCount`: Total number of properties
- `currentPage`: Current page number
- `pageSize`: Items per page
- `filters`: Search filters object
- `isLoading`: Loading state
- `error`: Error message

**Actions:**
- `fetchProperties(params)` - Fetch properties with filters
- `fetchFeaturedProperties()` - Fetch featured properties
- `fetchPropertyById(id)` - Fetch single property
- `setFilters(filters)` - Update search filters
- `clearFilters()` - Clear all filters
- `setCurrentPage(page)` - Set current page
- `clearCurrentProperty()` - Clear current property

### User Slice (`userSlice.ts`)

**State:**
- `profile`: User profile object
- `savedProperties`: Array of saved properties
- `recentlyViewed`: Array of recently viewed properties
- `isLoading`: Loading state
- `error`: Error message

**Actions:**
- `fetchUserProfile()` - Fetch user profile
- `updateUserProfile(data)` - Update user profile
- `fetchSavedProperties()` - Fetch saved properties
- `saveProperty(propertyId)` - Save a property
- `removeSavedProperty(propertyId)` - Remove saved property
- `fetchRecentlyViewed()` - Fetch recently viewed properties
- `setProfile(profile)` - Set user profile
- `clearProfile()` - Clear user profile

---

## API Service

The `services/api.ts` file provides pre-configured axios instance with:
- Automatic token injection
- Error handling
- Base URL configuration
- API method wrappers for each endpoint

### Example API Usage

```typescript
import { authAPI, propertiesAPI, userAPI } from '../services/api';

// Login
const { data } = await authAPI.login('user@example.com', 'password');

// Get properties
const { data } = await propertiesAPI.getAll({ city: 'San Francisco' });

// Get user profile (requires authentication)
const { data } = await userAPI.getProfile();
```

---

## Best Practices

1. **Use Typed Hooks**: Always use `useAppDispatch` and `useAppSelector` instead of plain hooks
2. **Handle Errors**: Wrap async thunks in try-catch or use `.unwrap()`
3. **Clear State**: Clear state when components unmount or when user logs out
4. **Memoization**: Use `useMemo` and `useCallback` for expensive computations
5. **Loading States**: Always show loading states for better UX

---

## Migration from AuthContext

The app maintains both AuthContext and Redux for backward compatibility. To fully migrate:

1. Replace `useAuth()` with Redux auth state
2. Update components to use Redux instead of context
3. Remove AuthProvider once migration is complete

Example migration:
```typescript
// Old (Context)
const { user, isAuthenticated } = useAuth();

// New (Redux)
const { user, isAuthenticated } = useAppSelector((state) => state.auth);
```

