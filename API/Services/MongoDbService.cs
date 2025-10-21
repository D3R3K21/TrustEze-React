using MongoDB.Driver;
using TrustEze.API.Models;

namespace TrustEze.API.Services
{
    public class MongoDbService
    {
        private readonly IMongoDatabase _database;

        public MongoDbService(IConfiguration configuration)
        {
            var connectionString = configuration.GetConnectionString("MongoDB");
            var databaseName = configuration["MongoDB:DatabaseName"] ?? "TrustEzeDb";
            
            var client = new MongoClient(connectionString);
            _database = client.GetDatabase(databaseName);
        }

        public IMongoCollection<User> Users => _database.GetCollection<User>("users");
        public IMongoCollection<Property> Properties => _database.GetCollection<Property>("properties");
        public IMongoCollection<Realtor> Realtors => _database.GetCollection<Realtor>("realtors");
        public IMongoCollection<SavedProperty> SavedProperties => _database.GetCollection<SavedProperty>("savedProperties");
        public IMongoCollection<PropertyView> PropertyViews => _database.GetCollection<PropertyView>("propertyViews");
    }
}

