namespace TrustEze.API.DTOs
{
    public class PropertyDto
    {
        public string Id { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string Address { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        public string ZipCode { get; set; } = string.Empty;
        public int Bedrooms { get; set; }
        public decimal Bathrooms { get; set; }
        public int SquareFeet { get; set; }
        public decimal? LotSize { get; set; }
        public int? YearBuilt { get; set; }
        public string PropertyType { get; set; } = string.Empty;
        public bool IsForSale { get; set; }
        public bool IsForRent { get; set; }
        public DateTime ListingDate { get; set; }
        public List<string> Images { get; set; } = new();
        public List<string> Features { get; set; } = new();
        public RealtorDto Realtor { get; set; } = new();
    }

    public class RealtorDto
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Company { get; set; } = string.Empty;
    }
}
