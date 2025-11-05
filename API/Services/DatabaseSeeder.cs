using TrustEze.API.Models;
using MongoDB.Driver;

namespace TrustEze.API.Services
{
    public class DatabaseSeeder
    {
        private readonly MongoDbService _mongoDbService;
        private readonly EnvironmentVariables _settings;

        public DatabaseSeeder(MongoDbService mongoDbService, EnvironmentVariables settings)
        {
            _mongoDbService = mongoDbService;
            _settings = settings;
        }

        public async Task SeedAsync()
        {
            if (_settings.Mongo.EnableSeedData)
            {
                await SeedUsersAsync();
                await SeedRealtorsAsync();
                await SeedPropertiesAsync();
            }
        }

        private async Task SeedUsersAsync()
        {
            var defaultPW = BCrypt.Net.BCrypt.HashPassword(_settings.DefaultUserPassword);
            var buyerRole = new Role
            {
                Id = new Guid("123e4567-e89b-12d3-a456-426614174000").ToString(),
                Name = "Buyer",
                Description = "Buyer Role"
            };
            var investorRole = new Role
            {
                Id = new Guid("246e4567-e89b-12d3-a456-426614174001").ToString(),
                Name = "Investor",
                Description = "Investor Role"
            };
            var adminRole = new Role
            {
                Id = new Guid("369e4567-e89b-12d3-a456-426614174002").ToString(),
                Name = "Admin",
                Description = "Admin Role"
            };
            var users = new List<User>
            {
                new User
                {
                    Id = new Guid("123e4567-e89b-12d3-a456-426614174000").ToString(),
                    Email = "buyer@trusteze.com",
                    PasswordHash = defaultPW,
                    Name = "Buyer User",
                    Phone = "+1 (555) 123-4567",
                    Avatar = "https://via.placeholder.com/150",
                    Roles = new List<Role> { buyerRole }
                },
                new User
                {
                    Id = new Guid("246e4567-e89b-12d3-a456-426614174001").ToString(),
                    Email = "investor@trusteze.com",
                    PasswordHash = defaultPW,
                    Name = "Investor User",
                    Phone = "+1 (555) 234-5678",
                    Avatar = "https://via.placeholder.com/150",
                    Roles = new List<Role> { investorRole }
                },
                new User
                {
                    Id = new Guid("369e4567-e89b-12d3-a456-426614174002").ToString(),
                    Email = "admin@trusteze.com",
                    PasswordHash = defaultPW,
                    Name = "Admin User",
                    Phone = "+1 (555) 234-5678",
                    Avatar = "https://via.placeholder.com/150",
                    Roles = new List<Role> { adminRole, investorRole, buyerRole }
                }
            };
            foreach (var user in users)
            {
                var filter = Builders<User>.Filter.Eq(c => c.Email, user.Email);
                await _mongoDbService.Users.ReplaceOneAsync(filter, user,  new ReplaceOptions { IsUpsert = true });
            }
        }

        private async Task SeedRealtorsAsync()
        {
            var realtors = new List<Realtor>
            {
                new Realtor
                {
                    Name = "Sarah Johnson",
                    Phone = "(555) 123-4567",
                    Email = "sarah@premierrealty.com",
                    Company = "Premier Realty",
                    LicenseNumber = "IL123456"
                },
                new Realtor
                {
                    Name = "Michael Chen",
                    Phone = "(555) 234-5678",
                    Email = "michael@luxuryhomes.com",
                    Company = "Luxury Living Realty",
                    LicenseNumber = "IL234567"
                },
                new Realtor
                {
                    Name = "Emily Rodriguez",
                    Phone = "(555) 345-6789",
                    Email = "emily@heritagehomes.com",
                    Company = "Heritage Properties",
                    LicenseNumber = "IL345678"
                },
                new Realtor
                {
                    Name = "David Thompson",
                    Phone = "(555) 456-7890",
                    Email = "david@modernliving.com",
                    Company = "Modern Living Realty",
                    LicenseNumber = "IL456789"
                },
                new Realtor
                {
                    Name = "Lisa Anderson",
                    Phone = "(555) 567-8901",
                    Email = "lisa@lakeproperties.com",
                    Company = "Lake Properties Group",
                    LicenseNumber = "WI567890"
                },
                new Realtor
                {
                    Name = "James Wilson",
                    Phone = "(555) 678-9012",
                    Email = "james@urbanlofts.com",
                    Company = "Urban Living Realty",
                    LicenseNumber = "WI678901"
                }
            };

            try
            {
                await _mongoDbService.Realtors.InsertManyAsync(realtors);

            }
            catch (Exception e)
            {

            }
        }

        private async Task SeedPropertiesAsync()
        {
            var realtors = await _mongoDbService.Realtors.Find(_ => true).ToListAsync();

            var properties = new List<Property>
            {
                new Property
                {
                    Title = "Modern Family Home in Suburbia",
                    Description = "Beautiful 4-bedroom family home with modern amenities, spacious backyard, and updated kitchen. Perfect for growing families.",
                    Price = 450000,
                    Address = "123 Oak Street",
                    City = "Springfield",
                    State = "IL",
                    ZipCode = "62701",
                    Bedrooms = 4,
                    Bathrooms = 3,
                    SquareFeet = 2500,
                    LotSize = 0.5m,
                    YearBuilt = 2018,
                    PropertyType = PropertyType.House,
                    IsForSale = true,
                    IsForRent = false,
                    ListingDate = DateTime.UtcNow.AddDays(-30),
                    RealtorId = realtors[0].Id,
                    Realtor = realtors[0],
                    Images = new List<PropertyImage>
                    {
                        new PropertyImage { Url = "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800", AltText = "Modern Family Home Exterior", DisplayOrder = 1, IsPrimary = true },
                        new PropertyImage { Url = "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800", AltText = "Modern Kitchen", DisplayOrder = 2 },
                        new PropertyImage { Url = "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800", AltText = "Living Room", DisplayOrder = 3 }
                    },
                    Features = new List<PropertyFeature>
                    {
                        new PropertyFeature { Name = "Updated Kitchen" },
                        new PropertyFeature { Name = "Hardwood Floors" },
                        new PropertyFeature { Name = "Central AC" },
                        new PropertyFeature { Name = "Garage" },
                        new PropertyFeature { Name = "Backyard" }
                    }
                },
                new Property
                {
                    Title = "Downtown Luxury Condo",
                    Description = "Stunning downtown condo with city views, modern finishes, and premium amenities. Walking distance to restaurants and entertainment.",
                    Price = 325000,
                    Address = "456 City Center Blvd",
                    City = "Chicago",
                    State = "IL",
                    ZipCode = "60601",
                    Bedrooms = 2,
                    Bathrooms = 2,
                    SquareFeet = 1200,
                    YearBuilt = 2020,
                    PropertyType = PropertyType.Condo,
                    IsForSale = true,
                    IsForRent = false,
                    ListingDate = DateTime.UtcNow.AddDays(-25),
                    RealtorId = realtors[1].Id,
                    Realtor = realtors[1],
                    Images = new List<PropertyImage>
                    {
                        new PropertyImage { Url = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800", AltText = "Luxury Condo Interior", DisplayOrder = 1, IsPrimary = true },
                        new PropertyImage { Url = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800", AltText = "City Views", DisplayOrder = 2 },
                        new PropertyImage { Url = "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800", AltText = "Modern Kitchen", DisplayOrder = 3 }
                    },
                    Features = new List<PropertyFeature>
                    {
                        new PropertyFeature { Name = "City Views" },
                        new PropertyFeature { Name = "Modern Kitchen" },
                        new PropertyFeature { Name = "In-unit Laundry" },
                        new PropertyFeature { Name = "Gym Access" },
                        new PropertyFeature { Name = "Concierge" }
                    }
                },
                new Property
                {
                    Title = "Charming Victorian House",
                    Description = "Historic Victorian home with original character, updated systems, and beautiful garden. Located in a quiet neighborhood.",
                    Price = 380000,
                    Address = "789 Heritage Lane",
                    City = "Evanston",
                    State = "IL",
                    ZipCode = "60201",
                    Bedrooms = 3,
                    Bathrooms = 2,
                    SquareFeet = 1800,
                    LotSize = 0.3m,
                    YearBuilt = 1895,
                    PropertyType = PropertyType.House,
                    IsForSale = true,
                    IsForRent = false,
                    ListingDate = DateTime.UtcNow.AddDays(-20),
                    RealtorId = realtors[2].Id,
                    Realtor = realtors[2],
                    Images = new List<PropertyImage>
                    {
                        new PropertyImage { Url = "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800", AltText = "Victorian House Exterior", DisplayOrder = 1, IsPrimary = true },
                        new PropertyImage { Url = "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800", AltText = "Historic Interior", DisplayOrder = 2 },
                        new PropertyImage { Url = "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800", AltText = "Garden", DisplayOrder = 3 }
                    },
                    Features = new List<PropertyFeature>
                    {
                        new PropertyFeature { Name = "Historic Character" },
                        new PropertyFeature { Name = "Updated Systems" },
                        new PropertyFeature { Name = "Garden" },
                        new PropertyFeature { Name = "Hardwood Floors" },
                        new PropertyFeature { Name = "Fireplace" }
                    }
                },
                new Property
                {
                    Title = "Modern Townhouse",
                    Description = "Contemporary townhouse with open floor plan, modern appliances, and private patio. Part of a quiet community.",
                    Price = 295000,
                    Address = "321 Maple Court",
                    City = "Naperville",
                    State = "IL",
                    ZipCode = "60540",
                    Bedrooms = 3,
                    Bathrooms = 2.5m,
                    SquareFeet = 1600,
                    YearBuilt = 2019,
                    PropertyType = PropertyType.Townhouse,
                    IsForSale = true,
                    IsForRent = false,
                    ListingDate = DateTime.UtcNow.AddDays(-15),
                    RealtorId = realtors[3].Id,
                    Realtor = realtors[3],
                    Images = new List<PropertyImage>
                    {
                        new PropertyImage { Url = "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800", AltText = "Modern Townhouse", DisplayOrder = 1, IsPrimary = true },
                        new PropertyImage { Url = "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800", AltText = "Open Floor Plan", DisplayOrder = 2 },
                        new PropertyImage { Url = "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800", AltText = "Private Patio", DisplayOrder = 3 }
                    },
                    Features = new List<PropertyFeature>
                    {
                        new PropertyFeature { Name = "Open Floor Plan" },
                        new PropertyFeature { Name = "Modern Appliances" },
                        new PropertyFeature { Name = "Private Patio" },
                        new PropertyFeature { Name = "Attached Garage" },
                        new PropertyFeature { Name = "HOA Amenities" }
                    }
                },
                new Property
                {
                    Title = "Lakeside Retreat",
                    Description = "Beautiful lakefront property with stunning water views, private dock, and spacious deck. Perfect for nature lovers.",
                    Price = 650000,
                    Address = "555 Lakeview Drive",
                    City = "Lake Geneva",
                    State = "WI",
                    ZipCode = "53147",
                    Bedrooms = 4,
                    Bathrooms = 3,
                    SquareFeet = 2800,
                    LotSize = 1.2m,
                    YearBuilt = 2015,
                    PropertyType = PropertyType.House,
                    IsForSale = true,
                    IsForRent = false,
                    ListingDate = DateTime.UtcNow.AddDays(-10),
                    RealtorId = realtors[4].Id,
                    Realtor = realtors[4],
                    Images = new List<PropertyImage>
                    {
                        new PropertyImage { Url = "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800", AltText = "Lakeside View", DisplayOrder = 1, IsPrimary = true },
                        new PropertyImage { Url = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800", AltText = "Private Dock", DisplayOrder = 2 },
                        new PropertyImage { Url = "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800", AltText = "Spacious Deck", DisplayOrder = 3 }
                    },
                    Features = new List<PropertyFeature>
                    {
                        new PropertyFeature { Name = "Lake Views" },
                        new PropertyFeature { Name = "Private Dock" },
                        new PropertyFeature { Name = "Spacious Deck" },
                        new PropertyFeature { Name = "Fireplace" },
                        new PropertyFeature { Name = "Updated Kitchen" }
                    }
                },
                new Property
                {
                    Title = "Urban Loft Apartment",
                    Description = "Industrial-style loft with exposed brick, high ceilings, and modern amenities. Located in the heart of the arts district.",
                    Price = 275000,
                    Address = "888 Arts District Ave",
                    City = "Milwaukee",
                    State = "WI",
                    ZipCode = "53202",
                    Bedrooms = 1,
                    Bathrooms = 1,
                    SquareFeet = 900,
                    YearBuilt = 2017,
                    PropertyType = PropertyType.Apartment,
                    IsForSale = true,
                    IsForRent = false,
                    ListingDate = DateTime.UtcNow.AddDays(-5),
                    RealtorId = realtors[5].Id,
                    Realtor = realtors[5],
                    Images = new List<PropertyImage>
                    {
                        new PropertyImage { Url = "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800", AltText = "Urban Loft Interior", DisplayOrder = 1, IsPrimary = true },
                        new PropertyImage { Url = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800", AltText = "Exposed Brick", DisplayOrder = 2 },
                        new PropertyImage { Url = "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800", AltText = "High Ceilings", DisplayOrder = 3 }
                    },
                    Features = new List<PropertyFeature>
                    {
                        new PropertyFeature { Name = "Exposed Brick" },
                        new PropertyFeature { Name = "High Ceilings" },
                        new PropertyFeature { Name = "Modern Kitchen" },
                        new PropertyFeature { Name = "In-unit Laundry" },
                        new PropertyFeature { Name = "Arts District Location" }
                    }
                }
            };

            await _mongoDbService.Properties.InsertManyAsync(properties);
        }
    }
}