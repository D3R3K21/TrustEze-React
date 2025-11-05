using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace TrustEze.API.DTOs
{
    /// <summary>
    /// The root object for the Zillow API response.
    /// </summary>
    public class SearchResponse
    {
        [JsonPropertyName("requestMetadata")]
        public RequestMetadata? RequestMetadata { get; set; }

        [JsonPropertyName("searchInformation")]
        public SearchInformation? SearchInformation { get; set; }

        [JsonPropertyName("properties")]
        public List<ZillowProperty>? Properties { get; set; }

        [JsonPropertyName("pagination")]
        public Pagination? Pagination { get; set; }
    }

    // --- Helper Classes ---

    public class RequestMetadata
    {
        [JsonPropertyName("id")]
        public string Id { get; set; }

        [JsonPropertyName("status")]
        public string Status { get; set; }

        [JsonPropertyName("html")]
        public string Html { get; set; }

        [JsonPropertyName("json")]
        public string Json { get; set; }

        [JsonPropertyName("url")]
        public string Url { get; set; }
    }

    public class SearchInformation
    {
        [JsonPropertyName("totalResults")]
        public int TotalResults { get; set; }
    }

    public class ZillowProperty
    {
        [JsonPropertyName("id")]
        public string Id { get; set; }

        [JsonPropertyName("url")]
        public string Url { get; set; }

        [JsonPropertyName("homeType")]
        public string HomeType { get; set; }

        [JsonPropertyName("image")]
        public string Image { get; set; }

        [JsonPropertyName("status")]
        public string Status { get; set; }

        [JsonPropertyName("currency")]
        public string Currency { get; set; }

        [JsonPropertyName("price")]
        public int Price { get; set; } // Using int based on '0'. Use double or decimal if price can have cents.

        [JsonPropertyName("daysOnZillow")]
        public int DaysOnZillow { get; set; }

        [JsonPropertyName("area")]
        public double Area { get; set; } // Using double as area can be fractional.

        [JsonPropertyName("lotAreaValue")]
        public double LotAreaValue { get; set; } // Using double for safety.

        [JsonPropertyName("lotAreaUnits")]
        public string LotAreaUnits { get; set; }

        [JsonPropertyName("addressRaw")]
        public string AddressRaw { get; set; }

        [JsonPropertyName("address")]
        public Address Address { get; set; }

        [JsonPropertyName("latitude")]
        public double Latitude { get; set; }

        [JsonPropertyName("longitude")]
        public double Longitude { get; set; }

        [JsonPropertyName("listingDetails")]
        public ListingDetails ListingDetails { get; set; }

        [JsonPropertyName("mediaDetails")]
        public MediaDetails MediaDetails { get; set; }

        [JsonPropertyName("photos")]
        public List<string> Photos { get; set; }
    }

    public class Address
    {
        [JsonPropertyName("street")]
        public string Street { get; set; }

        [JsonPropertyName("city")]
        public string City { get; set; }

        [JsonPropertyName("state")]
        public string State { get; set; }

        [JsonPropertyName("zipcode")]
        public string Zipcode { get; set; }
    }

    public class ListingDetails
    {
        [JsonPropertyName("isNewHome")]
        public bool IsNewHome { get; set; }
    }

    public class MediaDetails
    {
        [JsonPropertyName("has3DModel")]
        public bool Has3DModel { get; set; }

        [JsonPropertyName("hasVideo")]
        public bool HasVideo { get; set; }
    }

    public class Pagination
    {
        [JsonPropertyName("currentPage")]
        public int CurrentPage { get; set; }

        [JsonPropertyName("nextPage")]
        public string NextPage { get; set; }

        [JsonPropertyName("otherPages")]
        public Dictionary<string, string> OtherPages { get; set; }
    }
}
