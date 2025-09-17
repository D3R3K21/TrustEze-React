using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;

namespace TrustEze.API.Models
{
    public class PropertyFeature
    {
        [BsonElement("name")]
        public string Name { get; set; } = string.Empty;
        
        [BsonElement("description")]
        public string? Description { get; set; }
        
        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
