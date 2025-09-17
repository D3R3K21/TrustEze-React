using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace TrustEze.API.Models
{
    public class PropertyView
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;
        
        [BsonElement("viewedAt")]
        public DateTime ViewedAt { get; set; } = DateTime.UtcNow;
        
        [BsonElement("userAgent")]
        public string? UserAgent { get; set; }
        
        [BsonElement("ipAddress")]
        public string? IpAddress { get; set; }
        
        [BsonElement("userId")]
        public string? UserId { get; set; }
        
        [BsonElement("propertyId")]
        public string PropertyId { get; set; } = string.Empty;
    }
}
