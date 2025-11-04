using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;

namespace TrustEze.API.Models
{
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.String)]
        public string Id { get; set; } = string.Empty;
        
        [Required]
        [EmailAddress]
        [BsonElement("email")]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        [BsonElement("passwordHash")]
        public string PasswordHash { get; set; } = string.Empty;
        
        [Required]
        [BsonElement("name")]
        public string Name { get; set; } = string.Empty;
        
        [BsonElement("phone")]
        public string? Phone { get; set; }
        
        [BsonElement("avatar")]
        public string? Avatar { get; set; }
        
        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        [BsonElement("lastLoginAt")]
        public DateTime? LastLoginAt { get; set; }

        [BsonElement("roles")]
        public List<Role> Roles { get; set; } = new List<Role>();
    }
}
