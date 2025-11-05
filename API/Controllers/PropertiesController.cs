using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TrustEze.API.Services;
using TrustEze.API.DTOs;
using TrustEze.API.Models;
using MongoDB.Driver;
using RestSharp;

namespace TrustEze.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PropertiesController : ControllerBase
    {
        private readonly MongoDbService _mongoDbService;
        private readonly EnvironmentVariables _environmentVariables;

        public PropertiesController(MongoDbService mongoDbService, EnvironmentVariables environmentVariables)
        {
            _mongoDbService = mongoDbService;
            _environmentVariables = environmentVariables;
        }

        [Authorize]
        [HttpGet("search")]
        public async Task<ActionResult> Search([FromQuery] SearchRequest searchRequest)
        {
            var client = new RestClient(_environmentVariables.HasData.BaseUrl + searchRequest.ToQueryString());
            var request = new RestRequest();
            request.AddHeader("x-api-key", _environmentVariables.HasData.ApiKey);
            request.AddHeader("Content-Type", "application/json");
            var response = await client.ExecuteAsync<SearchResponse>(request);
            if (!response.IsSuccessful) 
            {
                return BadRequest(response.ErrorMessage);
            }
            return new JsonResult(response.Data);
            //var requestUrl = "https://api.hasdata.com/scrape/zillow/listing?" +
            //    "keyword=Phoenix%2C+AZ" +
            //    "&type=forSale" +
            //    "&sort=verifiedSource" +
            //    "&price.min=100000" +
            //    "&price.max=500001" +
            //    "&beds.min=3" +
            //    "&beds.max=5" +
            //    "&baths.min=2" +
            //    "&baths.max=5" +
            //    "&yearBuilt.min=2000" +
            //    "&yearBuilt.max=2025" +
            //    "&lotSize.min=1000" +
            //    "&lotSize.max=9998" +
            //    "&squareFeet.min=999" +
            //    "&squareFeet.max=3998" +
            //    "&homeTypes=house" +
            //    "&homeTypes=townhome" +
            //    "&homeTypes=multiFamily" +
            //    "&homeTypes=lot" +
            //    "&homeTypes=condo" +
            //    "&homeTypes=apartment" +
            //    "&homeTypes=manufactured";

        }
        [HttpGet]
        public async Task<ActionResult<PagedResult<PropertyDto>>> GetProperties([FromQuery] PropertySearchRequest request)
        {
            var filterBuilder = Builders<Property>.Filter;
            var filters = new List<FilterDefinition<Property>>();

            // Apply filters
            if (request.MinPrice.HasValue)
                filters.Add(filterBuilder.Gte(p => p.Price, request.MinPrice.Value));

            if (request.MaxPrice.HasValue)
                filters.Add(filterBuilder.Lte(p => p.Price, request.MaxPrice.Value));

            if (request.Bedrooms.HasValue)
                filters.Add(filterBuilder.Gte(p => p.Bedrooms, request.Bedrooms.Value));

            if (request.Bathrooms.HasValue)
                filters.Add(filterBuilder.Gte(p => p.Bathrooms, request.Bathrooms.Value));

            if (request.MinSquareFeet.HasValue)
                filters.Add(filterBuilder.Gte(p => p.SquareFeet, request.MinSquareFeet.Value));

            if (request.MaxSquareFeet.HasValue)
                filters.Add(filterBuilder.Lte(p => p.SquareFeet, request.MaxSquareFeet.Value));

            if (!string.IsNullOrEmpty(request.PropertyType))
                filters.Add(filterBuilder.Eq(p => p.PropertyType.ToString(), request.PropertyType));

            if (!string.IsNullOrEmpty(request.City))
                filters.Add(filterBuilder.Regex(p => p.City, new MongoDB.Bson.BsonRegularExpression(request.City, "i")));

            if (!string.IsNullOrEmpty(request.State))
                filters.Add(filterBuilder.Regex(p => p.State, new MongoDB.Bson.BsonRegularExpression(request.State, "i")));

            if (!string.IsNullOrEmpty(request.ZipCode))
                filters.Add(filterBuilder.Regex(p => p.ZipCode, new MongoDB.Bson.BsonRegularExpression(request.ZipCode, "i")));

            var filter = filters.Count > 0 ? filterBuilder.And(filters) : filterBuilder.Empty;

            // Apply sorting
            SortDefinition<Property> sort = request.SortBy switch
            {
                "price-asc" => Builders<Property>.Sort.Ascending(p => p.Price),
                "price-desc" => Builders<Property>.Sort.Descending(p => p.Price),
                "oldest" => Builders<Property>.Sort.Ascending(p => p.ListingDate),
                _ => Builders<Property>.Sort.Descending(p => p.ListingDate) // newest
            };

            var totalCount = await _mongoDbService.Properties.CountDocumentsAsync(filter);

            var properties = await _mongoDbService.Properties
                .Find(filter)
                .Sort(sort)
                .Skip((request.Page - 1) * request.PageSize)
                .Limit(request.PageSize)
                .ToListAsync();

            var propertyDtos = properties.Select(p => new PropertyDto
            {
                Id = p.Id,
                Title = p.Title,
                Description = p.Description,
                Price = p.Price,
                Address = p.Address,
                City = p.City,
                State = p.State,
                ZipCode = p.ZipCode,
                Bedrooms = p.Bedrooms,
                Bathrooms = p.Bathrooms,
                SquareFeet = p.SquareFeet,
                LotSize = p.LotSize,
                YearBuilt = p.YearBuilt,
                PropertyType = p.PropertyType.ToString(),
                IsForSale = p.IsForSale,
                IsForRent = p.IsForRent,
                ListingDate = p.ListingDate,
                Images = p.Images.OrderBy(i => i.DisplayOrder).Select(i => i.Url).ToList(),
                Features = p.Features.Select(f => f.Name).ToList(),
                Realtor = new RealtorDto
                {
                    Id = p.Realtor.Id,
                    Name = p.Realtor.Name,
                    Phone = p.Realtor.Phone,
                    Email = p.Realtor.Email,
                    Company = p.Realtor.Company
                }
            }).ToList();

            return Ok(new PagedResult<PropertyDto>
            {
                Items = propertyDtos,
                TotalCount = (int)totalCount,
                Page = request.Page,
                PageSize = request.PageSize
            });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PropertyDto>> GetProperty(string id)
        {
            var property = await _mongoDbService.Properties
                .Find(p => p.Id == id)
                .FirstOrDefaultAsync();

            if (property == null)
                return NotFound();

            // Track property view
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (userId != null)
            {
                var propertyView = new PropertyView
                {
                    PropertyId = id,
                    UserId = userId,
                    ViewedAt = DateTime.UtcNow,
                    UserAgent = Request.Headers.UserAgent.ToString(),
                    IpAddress = HttpContext.Connection.RemoteIpAddress?.ToString()
                };
                await _mongoDbService.PropertyViews.InsertOneAsync(propertyView);
            }

            var propertyDto = new PropertyDto
            {
                Id = property.Id,
                Title = property.Title,
                Description = property.Description,
                Price = property.Price,
                Address = property.Address,
                City = property.City,
                State = property.State,
                ZipCode = property.ZipCode,
                Bedrooms = property.Bedrooms,
                Bathrooms = property.Bathrooms,
                SquareFeet = property.SquareFeet,
                LotSize = property.LotSize,
                YearBuilt = property.YearBuilt,
                PropertyType = property.PropertyType.ToString(),
                IsForSale = property.IsForSale,
                IsForRent = property.IsForRent,
                ListingDate = property.ListingDate,
                Images = property.Images.OrderBy(i => i.DisplayOrder).Select(i => i.Url).ToList(),
                Features = property.Features.Select(f => f.Name).ToList(),
                Realtor = new RealtorDto
                {
                    Id = property.Realtor.Id,
                    Name = property.Realtor.Name,
                    Phone = property.Realtor.Phone,
                    Email = property.Realtor.Email,
                    Company = property.Realtor.Company
                }
            };

            return Ok(propertyDto);
        }

        [HttpGet("featured")]
        public async Task<ActionResult<List<PropertyDto>>> GetFeaturedProperties()
        {
            var properties = await _mongoDbService.Properties
                .Find(Builders<Property>.Filter.Empty)
                .Sort(Builders<Property>.Sort.Descending(p => p.ListingDate))
                .Limit(6)
                .ToListAsync();

            var propertyDtos = properties.Select(p => new PropertyDto
            {
                Id = p.Id,
                Title = p.Title,
                Description = p.Description,
                Price = p.Price,
                Address = p.Address,
                City = p.City,
                State = p.State,
                ZipCode = p.ZipCode,
                Bedrooms = p.Bedrooms,
                Bathrooms = p.Bathrooms,
                SquareFeet = p.SquareFeet,
                LotSize = p.LotSize,
                YearBuilt = p.YearBuilt,
                PropertyType = p.PropertyType.ToString(),
                IsForSale = p.IsForSale,
                IsForRent = p.IsForRent,
                ListingDate = p.ListingDate,
                Images = p.Images.OrderBy(i => i.DisplayOrder).Select(i => i.Url).ToList(),
                Features = p.Features.Select(f => f.Name).ToList(),
                Realtor = new RealtorDto
                {
                    Id = p.Realtor.Id,
                    Name = p.Realtor.Name,
                    Phone = p.Realtor.Phone,
                    Email = p.Realtor.Email,
                    Company = p.Realtor.Company
                }
            }).ToList();

            return Ok(propertyDtos);
        }
    }
}