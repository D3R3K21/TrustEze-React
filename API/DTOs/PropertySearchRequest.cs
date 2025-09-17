namespace TrustEze.API.DTOs
{
    public class PropertySearchRequest
    {
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public int? Bedrooms { get; set; }
        public decimal? Bathrooms { get; set; }
        public int? MinSquareFeet { get; set; }
        public int? MaxSquareFeet { get; set; }
        public string? PropertyType { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public string? ZipCode { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string SortBy { get; set; } = "newest"; // newest, oldest, price-asc, price-desc
    }
}
