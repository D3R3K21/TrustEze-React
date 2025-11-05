using MongoDB.Driver;
using TrustEze.API.Models;

namespace TrustEze.API.Services
{
    public class MongoDbService
    {
        private readonly IMongoDatabase _database;

        public MongoDbService(EnvironmentVariables environmentVariables)
        {
            var client = new MongoClient(environmentVariables.Mongo.ConnectionString);
            _database = client.GetDatabase(environmentVariables.Mongo.Database);
        }

        public IMongoCollection<User> Users => _database.GetCollection<User>("users");
        public IMongoCollection<Property> Properties => _database.GetCollection<Property>("properties");
        public IMongoCollection<Realtor> Realtors => _database.GetCollection<Realtor>("realtors");
        public IMongoCollection<SavedProperty> SavedProperties => _database.GetCollection<SavedProperty>("savedProperties");
        public IMongoCollection<PropertyView> PropertyViews => _database.GetCollection<PropertyView>("propertyViews");
    }
}
