# TrustEze API

A RESTful Web API built with ASP.NET Core 8.0 for the TrustEze home search platform.

## Features

- 🔐 **JWT Authentication** - Secure user authentication and authorization
- 🏠 **Property Management** - CRUD operations for properties with advanced search
- 👤 **User Profiles** - User account management and preferences
- 💾 **Saved Properties** - Users can save and manage favorite properties
- 📊 **Property Analytics** - Track property views and user interactions
- 🔍 **Advanced Search** - Filter properties by multiple criteria
- 📱 **CORS Enabled** - Ready for frontend integration
- 📚 **Swagger Documentation** - Interactive API documentation

## Getting Started

### Prerequisites

- .NET 8.0 SDK
- MongoDB (local installation or MongoDB Atlas)
- Visual Studio 2022 or VS Code

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd TrustEze/API
   ```

2. **Restore packages:**
   ```bash
   dotnet restore
   ```

3. **Update MongoDB connection** in `appsettings.json` if needed:
   ```json
   {
     "ConnectionStrings": {
       "MongoDB": "mongodb://localhost:27017"
     },
     "MongoDB": {
       "DatabaseName": "TrustEzeDb"
     }
   }
   ```

4. **Run the application:**
   ```bash
   dotnet run
   ```

5. **Access Swagger UI:**
   - Navigate to `https://localhost:7000` (or the port shown in console)
   - The Swagger UI will be available at the root URL

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Properties
- `GET /api/properties` - Get properties with search filters
- `GET /api/properties/{id}` - Get property by ID
- `GET /api/properties/featured` - Get featured properties

### Users (Authenticated)
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/saved-properties` - Get saved properties
- `POST /api/users/saved-properties/{id}` - Save property
- `DELETE /api/users/saved-properties/{id}` - Remove saved property
- `GET /api/users/recently-viewed` - Get recently viewed properties

## Database Schema

### Core Entities
- **User** - User accounts and profiles
- **Property** - Real estate properties
- **Realtor** - Real estate agents
- **PropertyImage** - Property photos
- **PropertyFeature** - Property amenities
- **SavedProperty** - User's saved properties
- **PropertyView** - Property view tracking

## Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. **Login** with email/password to receive a JWT token
2. **Include token** in Authorization header: `Bearer {token}`
3. **Token expires** after 7 days

### Demo Credentials
- **Email:** demo@trusteze.com
- **Password:** password

## Search and Filtering

The properties endpoint supports advanced filtering:

```http
GET /api/properties?minPrice=100000&maxPrice=500000&bedrooms=3&city=Chicago&sortBy=price-asc&page=1&pageSize=10
```

### Available Filters
- `minPrice` / `maxPrice` - Price range
- `bedrooms` / `bathrooms` - Room count
- `minSquareFeet` / `maxSquareFeet` - Size range
- `propertyType` - House, Condo, Townhouse, Apartment
- `city` / `state` / `zipCode` - Location
- `sortBy` - newest, oldest, price-asc, price-desc
- `page` / `pageSize` - Pagination

## CORS Configuration

The API is configured to allow requests from:
- `http://localhost:3000` (React development server)
- `https://localhost:3000` (HTTPS React development server)

## Development

### MongoDB Setup
```bash
# Start MongoDB service (if running locally)
mongod

# Or use MongoDB Atlas cloud service
# Update connection string in appsettings.json
```

### Running Tests
```bash
dotnet test
```

### Building for Production
```bash
dotnet build --configuration Release
```

## Technologies Used

- **ASP.NET Core 8.0** - Web API framework
- **MongoDB** - NoSQL database
- **MongoDB.Driver** - Database access
- **JWT Bearer Authentication** - Security
- **AutoMapper** - Object mapping
- **Swagger/OpenAPI** - API documentation
- **BCrypt** - Password hashing

## Project Structure

```
API/
├── Controllers/          # API controllers
├── DTOs/                # Data transfer objects
├── Models/              # MongoDB document models
├── Services/            # MongoDB service and business logic
├── Program.cs           # Application entry point
└── appsettings.json     # Configuration
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
