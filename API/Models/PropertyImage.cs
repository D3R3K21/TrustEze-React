using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;

namespace TrustEze.API.Models
{
    public class PropertyImage
    {
        [BsonElement("url")]
        public string Url { get; set; } = string.Empty;
        
        [BsonElement("altText")]
        public string AltText { get; set; } = string.Empty;
        
        [BsonElement("displayOrder")]
        public int DisplayOrder { get; set; } = 0;
        
        [BsonElement("isPrimary")]
        public bool IsPrimary { get; set; } = false;
        
        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
