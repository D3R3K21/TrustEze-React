namespace TrustEze.API.DTOs
{
    public class SearchRequest
    {
        public string Keyword { get; set; }
        public string Type { get; set; } = "forSale";
        public string? Sort { get; set; }
        public NumericRange Price { get; set; }
        public NumericRange Beds { get; set; }
        public NumericRange Baths { get; set; }
        public NumericRange YearBuilt { get; set; }
        public NumericRange LotSize { get; set; }
        public NumericRange SquareFeet { get; set; }
        public List<string> HomeTypes { get; set; }
        public int? Page { get; set; }

        public SearchRequest()
        {
            Price = new NumericRange();
            Beds = new NumericRange();
            Baths = new NumericRange();
            YearBuilt = new NumericRange();
            LotSize = new NumericRange();
            SquareFeet = new NumericRange();
            HomeTypes = new List<string>();
        }

        public string ToQueryString()
        {
            var queryParams = new List<string>();

            if (!string.IsNullOrEmpty(Keyword))
            {
                queryParams.Add($"keyword={Uri.EscapeDataString(Keyword)}");
            }

            if (!string.IsNullOrEmpty(Type))
            {
                queryParams.Add($"type={Uri.EscapeDataString(Type)}");
            }

            if (!string.IsNullOrEmpty(Sort))
            {
                queryParams.Add($"sort={Uri.EscapeDataString(Sort)}");
            }

            if (Price != null)
            {
                if (Price.Min.HasValue)
                {
                    queryParams.Add($"price.min={Price.Min.Value}");
                }
                if (Price.Max.HasValue)
                {
                    queryParams.Add($"price.max={Price.Max.Value}");
                }
            }

            if (Beds != null)
            {
                if (Beds.Min.HasValue)
                {
                    queryParams.Add($"beds.min={Beds.Min.Value}");
                }
                if (Beds.Max.HasValue)
                {
                    queryParams.Add($"beds.max={Beds.Max.Value}");
                }
            }

            if (Baths != null)
            {
                if (Baths.Min.HasValue)
                {
                    queryParams.Add($"baths.min={Baths.Min.Value}");
                }
                if (Baths.Max.HasValue)
                {
                    queryParams.Add($"baths.max={Baths.Max.Value}");
                }
            }

            if (YearBuilt != null)
            {
                if (YearBuilt.Min.HasValue)
                {
                    queryParams.Add($"yearBuilt.min={YearBuilt.Min.Value}");
                }
                if (YearBuilt.Max.HasValue)
                {
                    queryParams.Add($"yearBuilt.max={YearBuilt.Max.Value}");
                }
            }

            if (LotSize != null)
            {
                if (LotSize.Min.HasValue)
                {
                    queryParams.Add($"lotSize.min={LotSize.Min.Value}");
                }
                if (LotSize.Max.HasValue)
                {
                    queryParams.Add($"lotSize.max={LotSize.Max.Value}");
                }
            }

            if (SquareFeet != null)
            {
                if (SquareFeet.Min.HasValue)
                {
                    queryParams.Add($"squareFeet.min={SquareFeet.Min.Value}");
                }
                if (SquareFeet.Max.HasValue)
                {
                    queryParams.Add($"squareFeet.max={SquareFeet.Max.Value}");
                }
            }

            if (HomeTypes != null && HomeTypes.Any())
            {
                foreach (var homeType in HomeTypes.Where(ht => !string.IsNullOrEmpty(ht)))
                {
                    queryParams.Add($"homeTypes={Uri.EscapeDataString(homeType)}");
                }
            }
            if (Page.HasValue)
            {
                queryParams.Add($"page={Page}");
            }
            return queryParams.Any() ? "?" + string.Join("&", queryParams) : "";
        }
    }
    public class NumericRange
    {
        public int? Min { get; set; }
        public int? Max { get; set; }
    }
}
