using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace TrustEze.API.Models
{
    public class SavedProperty
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;
        
        [BsonElement("savedAt")]
        public DateTime SavedAt { get; set; } = DateTime.UtcNow;
        
        [BsonElement("userId")]
        public string UserId { get; set; } = string.Empty;
        
        [BsonElement("propertyId")]
        public string PropertyId { get; set; } = string.Empty;
    }
}
