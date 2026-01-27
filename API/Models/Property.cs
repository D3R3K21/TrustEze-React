using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;

namespace TrustEze.API.Models
{
    public class Property
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;
        
        [Required]
        [BsonElement("title")]
        public string Title { get; set; } = string.Empty;
        
        [Required]
        [BsonElement("description")]
        public string Description { get; set; } = string.Empty;
        
        [Required]
        [BsonElement("price")]
        public decimal Price { get; set; }
        
        [Required]
        [BsonElement("address")]
        public string Address { get; set; } = string.Empty;
        
        [Required]
        [BsonElement("city")]
        public string City { get; set; } = string.Empty;
        
        [Required]
        [BsonElement("state")]
        public string State { get; set; } = string.Empty;
        
        [Required]
        [BsonElement("zipCode")]
        public string ZipCode { get; set; } = string.Empty;
        
        [Required]
        [BsonElement("bedrooms")]
        public int Bedrooms { get; set; }
        
        [Required]
        [BsonElement("bathrooms")]
        public decimal Bathrooms { get; set; }
        
        [Required]
        [BsonElement("squareFeet")]
        public int SquareFeet { get; set; }
        
        [BsonElement("lotSize")]
        public decimal? LotSize { get; set; }
        
        [BsonElement("yearBuilt")]
        public int? YearBuilt { get; set; }
        
        [Required]
        [BsonElement("propertyType")]
        public PropertyType PropertyType { get; set; }
        
        [BsonElement("isForSale")]
        public bool IsForSale { get; set; } = true;
        
        [BsonElement("isForRent")]
        public bool IsForRent { get; set; } = false;
        
        [BsonElement("listingDate")]
        public DateTime ListingDate { get; set; } = DateTime.UtcNow;
        
        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        [BsonElement("updatedAt")]
        public DateTime? UpdatedAt { get; set; }
        
        // Embedded documents
        [BsonElement("images")]
        public List<PropertyImage> Images { get; set; } = new List<PropertyImage>();
        
        [BsonElement("features")]
        public List<PropertyFeature> Features { get; set; } = new List<PropertyFeature>();
        
        // Realtor information
        [BsonElement("realtorId")]
        public string RealtorId { get; set; } = string.Empty;
        
        [BsonElement("realtor")]
        public Realtor Realtor { get; set; } = new Realtor();
        
        [BsonElement("latitude")]
        public double? Latitude { get; set; }
        
        [BsonElement("longitude")]
        public double? Longitude { get; set; }
    }
    
    public enum PropertyType
    {
        House,
        Condo,
        Townhouse,
        Apartment
    }
}
