using MongoDB.Driver;
using TrustEze.API.Models;
using Microsoft.Extensions.Options;

namespace TrustEze.API.Services
{
    public class MongoDbConfig
    {
        public string ConnectionString { get; set; }
        public string Database { get; set; }
        public bool SeedData { get; set; }
    }
    public class MongoDbService(IOptions<MongoDbConfig> config)
    {
        private readonly IMongoDatabase _database = new MongoClient(config.Value.ConnectionString).GetDatabase(config.Value.Database);

        public IMongoCollection<User> Users => _database.GetCollection<User>("users");
        public IMongoCollection<Property> Properties => _database.GetCollection<Property>("properties");
        public IMongoCollection<Realtor> Realtors => _database.GetCollection<Realtor>("realtors");
        public IMongoCollection<SavedProperty> SavedProperties => _database.GetCollection<SavedProperty>("savedProperties");
        public IMongoCollection<PropertyView> PropertyViews => _database.GetCollection<PropertyView>("propertyViews");
    }
}

