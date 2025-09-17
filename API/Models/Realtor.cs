using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;

namespace TrustEze.API.Models
{
    public class Realtor
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;
        
        [Required]
        [BsonElement("name")]
        public string Name { get; set; } = string.Empty;
        
        [Required]
        [BsonElement("phone")]
        public string Phone { get; set; } = string.Empty;
        
        [Required]
        [EmailAddress]
        [BsonElement("email")]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        [BsonElement("company")]
        public string Company { get; set; } = string.Empty;
        
        [BsonElement("licenseNumber")]
        public string? LicenseNumber { get; set; }
        
        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
