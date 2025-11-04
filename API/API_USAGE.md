# TrustEze API Usage Guide

## Base URL
- **Local Development**: `http://localhost:5002`
- **Swagger UI**: `http://localhost:5002` (when running in development mode)

---

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer {your-jwt-token}
```

---

## API Endpoints

### 1. Authentication (`/api/auth`)

#### Register a New User
**POST** `/api/auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "phone": "+1234567890",
  "avatar": "https://example.com/avatar.jpg"  // optional
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe",
    "phone": "+1234567890",
    "avatar": "https://example.com/avatar.jpg",
    "createdAt": "2024-01-01T00:00:00Z",
    "lastLoginAt": null
  },
  "expiresAt": "2024-01-08T00:00:00Z"
}
```

#### Login
**POST** `/api/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe",
    "phone": "+1234567890",
    "avatar": "https://example.com/avatar.jpg",
    "createdAt": "2024-01-01T00:00:00Z",
    "lastLoginAt": "2024-01-01T12:00:00Z"
  },
  "expiresAt": "2024-01-08T00:00:00Z"
}
```

---

### 2. Users (`/api/users`) - Requires Authentication

#### Get User Profile
**GET** `/api/users/profile`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "name": "John Doe",
  "phone": "+1234567890",
  "avatar": "https://example.com/avatar.jpg",
  "createdAt": "2024-01-01T00:00:00Z",
  "lastLoginAt": "2024-01-01T12:00:00Z"
}
```

#### Update User Profile
**PUT** `/api/users/profile`

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "name": "John Doe Updated",
  "phone": "+1234567890",
  "avatar": "https://example.com/new-avatar.jpg"
}
```

**Response:** Updated user profile (same format as Get Profile)

#### Get Saved Properties
**GET** `/api/users/saved-properties`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** Array of PropertyDto objects

#### Save a Property
**POST** `/api/users/saved-properties/{propertyId}`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "message": "Property saved successfully"
}
```

#### Remove Saved Property
**DELETE** `/api/users/saved-properties/{propertyId}`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "message": "Property removed from saved list"
}
```

#### Get Recently Viewed Properties
**GET** `/api/users/recently-viewed`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** Array of PropertyDto objects (last 10 viewed)

---

### 3. Properties (`/api/properties`)

#### Search Properties
**GET** `/api/properties`

**Query Parameters:**
- `minPrice` (decimal, optional)
- `maxPrice` (decimal, optional)
- `bedrooms` (int, optional)
- `bathrooms` (decimal, optional)
- `minSquareFeet` (int, optional)
- `maxSquareFeet` (int, optional)
- `propertyType` (string, optional): "House", "Apartment", "Condo", "Townhouse", etc.
- `city` (string, optional)
- `state` (string, optional)
- `zipCode` (string, optional)
- `page` (int, default: 1)
- `pageSize` (int, default: 10)
- `sortBy` (string, default: "newest"): "newest", "oldest", "price-asc", "price-desc"

**Example:**
```
GET /api/properties?minPrice=100000&maxPrice=500000&bedrooms=3&page=1&pageSize=10&sortBy=price-asc
```

**Response:**
```json
{
  "items": [
    {
      "id": "507f1f77bcf86cd799439011",
      "title": "Modern Family Home",
      "description": "Beautiful 3-bedroom home...",
      "price": 350000,
      "address": "123 Main St",
      "city": "San Francisco",
      "state": "CA",
      "zipCode": "94102",
      "bedrooms": 3,
      "bathrooms": 2.5,
      "squareFeet": 1500,
      "lotSize": 0.25,
      "yearBuilt": 2010,
      "propertyType": "House",
      "isForSale": true,
      "isForRent": false,
      "listingDate": "2024-01-01T00:00:00Z",
      "images": ["https://example.com/image1.jpg"],
      "features": ["Garden", "Garage"],
      "realtor": {
        "id": "realtor1",
        "name": "Jane Smith",
        "phone": "+1234567890",
        "email": "jane@realtor.com",
        "company": "ABC Realty"
      }
    }
  ],
  "totalCount": 42,
  "page": 1,
  "pageSize": 10
}
```

#### Get Property by ID
**GET** `/api/properties/{id}`

**Optional Headers (to track view):**
```
Authorization: Bearer {token}
```

**Response:** Single PropertyDto object

**Note:** If authenticated, this endpoint automatically tracks the property view.

#### Get Featured Properties
**GET** `/api/properties/featured`

**Response:** Array of 6 latest PropertyDto objects

---

## PropertyDto Structure

```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "price": 0,
  "address": "string",
  "city": "string",
  "state": "string",
  "zipCode": "string",
  "bedrooms": 0,
  "bathrooms": 0,
  "squareFeet": 0,
  "lotSize": 0,
  "yearBuilt": 0,
  "propertyType": "string",
  "isForSale": true,
  "isForRent": false,
  "listingDate": "2024-01-01T00:00:00Z",
  "images": ["string"],
  "features": ["string"],
  "realtor": {
    "id": "string",
    "name": "string",
    "phone": "string",
    "email": "string",
    "company": "string"
  }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Error description"
}
```

### 401 Unauthorized
```json
{
  "message": "Invalid email or password"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

---

## Example Usage with cURL

### Register a User
```bash
curl -X POST http://localhost:5002/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User",
    "phone": "+1234567890"
  }'
```

### Login
```bash
curl -X POST http://localhost:5002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get Properties (with filters)
```bash
curl "http://localhost:5002/api/properties?minPrice=100000&maxPrice=500000&bedrooms=3&page=1&pageSize=10"
```

### Get User Profile (with authentication)
```bash
curl http://localhost:5002/api/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Testing with Swagger

When running the API in development mode, you can access Swagger UI at:
```
http://localhost:5002
```

This provides an interactive interface to test all endpoints.

---

## JWT Token Expiration

Tokens expire after **7 days**. Store the token securely and include it in the Authorization header for authenticated requests.

---

## Environment Configuration

The API is configured via environment variables in `docker-compose.yml`:
- `MongoConnectionString`: MongoDB connection string
- `MongoDatabase`: Database name
- `ENABLE_SEED_DATA`: Whether to seed sample data on startup
- `JwtKey`: Secret key for JWT tokens
- `JwtIssuer`: JWT issuer name
- `JwtAudience`: JWT audience name


