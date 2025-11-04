# TrustEze API Endpoints

Base URL: `http://localhost:5002`

---

## 🔓 Public Endpoints (No Authentication Required)

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user account |
| POST | `/api/auth/login` | Login and receive JWT token |

### Properties

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/properties` | Search/filter properties with pagination |
| GET | `/api/properties/{id}` | Get details of a specific property |
| GET | `/api/properties/featured` | Get 6 latest featured properties |

---

## 🔒 Protected Endpoints (Requires Authentication)

### User Profile

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/profile` | Get current user's profile information |
| PUT | `/api/users/profile` | Update current user's profile |

### Saved Properties

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/saved-properties` | Get all properties saved by the user |
| POST | `/api/users/saved-properties/{id}` | Save a property to user's list |
| DELETE | `/api/users/saved-properties/{id}` | Remove a property from saved list |

### Recently Viewed

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/recently-viewed` | Get last 10 properties viewed by the user |

---

## Request Authentication

Include the JWT token in the request headers:
```
Authorization: Bearer {your-jwt-token}
```

---

## Quick Test Commands

### Register a User
```bash
curl -X POST http://localhost:5002/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123","name":"John Doe"}'
```

### Search Properties
```bash
curl "http://localhost:5002/api/properties?minPrice=100000&maxPrice=500000&bedrooms=3"
```

### Get Featured Properties
```bash
curl http://localhost:5002/api/properties/featured
```

---

For detailed documentation, see [API_USAGE.md](./API_USAGE.md)


