using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TrustEze.API.Services;
using TrustEze.API.DTOs;
using TrustEze.API.Models;
using MongoDB.Driver;

namespace TrustEze.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly MongoDbService _mongoDbService;

        public UsersController(MongoDbService mongoDbService)
        {
            _mongoDbService = mongoDbService;
        }

        [HttpGet("profile")]
        public async Task<ActionResult<UserDto>> GetProfile()
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "";
            
            var user = await _mongoDbService.Users
                .Find(u => u.Id == userId)
                .FirstOrDefaultAsync();

            if (user == null)
                return NotFound();

            var userDto = new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                Name = user.Name,
                Phone = user.Phone,
                Avatar = user.Avatar,
                CreatedAt = user.CreatedAt,
                LastLoginAt = user.LastLoginAt
            };

            return Ok(userDto);
        }

        [HttpPut("profile")]
        public async Task<ActionResult<UserDto>> UpdateProfile(UpdateProfileRequest request)
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "";
            
            var user = await _mongoDbService.Users
                .Find(u => u.Id == userId)
                .FirstOrDefaultAsync();

            if (user == null)
                return NotFound();

            user.Name = request.Name;
            user.Phone = request.Phone;
            user.Avatar = request.Avatar;

            await _mongoDbService.Users.ReplaceOneAsync(u => u.Id == userId, user);

            var userDto = new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                Name = user.Name,
                Phone = user.Phone,
                Avatar = user.Avatar,
                CreatedAt = user.CreatedAt,
                LastLoginAt = user.LastLoginAt
            };

            return Ok(userDto);
        }

        [HttpGet("saved-properties")]
        public async Task<ActionResult<List<PropertyDto>>> GetSavedProperties()
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "";
            
            var savedProperties = await _mongoDbService.SavedProperties
                .Find(sp => sp.UserId == userId)
                .Sort(Builders<SavedProperty>.Sort.Descending(sp => sp.SavedAt))
                .ToListAsync();

            var propertyIds = savedProperties.Select(sp => sp.PropertyId).ToList();
            
            var properties = await _mongoDbService.Properties
                .Find(p => propertyIds.Contains(p.Id))
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

        [HttpPost("saved-properties/{propertyId}")]
        public async Task<ActionResult> SaveProperty(string propertyId)
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "";
            
            // Check if property exists
            var property = await _mongoDbService.Properties
                .Find(p => p.Id == propertyId)
                .FirstOrDefaultAsync();
            
            if (property == null)
                return NotFound();

            // Check if already saved
            var existingSaved = await _mongoDbService.SavedProperties
                .Find(sp => sp.UserId == userId && sp.PropertyId == propertyId)
                .FirstOrDefaultAsync();

            if (existingSaved != null)
                return BadRequest(new { message = "Property already saved" });

            var savedProperty = new SavedProperty
            {
                UserId = userId,
                PropertyId = propertyId,
                SavedAt = DateTime.UtcNow
            };

            await _mongoDbService.SavedProperties.InsertOneAsync(savedProperty);

            return Ok(new { message = "Property saved successfully" });
        }

        [HttpDelete("saved-properties/{propertyId}")]
        public async Task<ActionResult> RemoveSavedProperty(string propertyId)
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "";
            
            var result = await _mongoDbService.SavedProperties
                .DeleteOneAsync(sp => sp.UserId == userId && sp.PropertyId == propertyId);

            if (result.DeletedCount == 0)
                return NotFound();

            return Ok(new { message = "Property removed from saved list" });
        }

        [HttpGet("recently-viewed")]
        public async Task<ActionResult<List<PropertyDto>>> GetRecentlyViewed()
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "";
            
            var propertyViews = await _mongoDbService.PropertyViews
                .Find(pv => pv.UserId == userId)
                .Sort(Builders<PropertyView>.Sort.Descending(pv => pv.ViewedAt))
                .Limit(10)
                .ToListAsync();

            var propertyIds = propertyViews.Select(pv => pv.PropertyId).ToList();
            
            var properties = await _mongoDbService.Properties
                .Find(p => propertyIds.Contains(p.Id))
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

    public class UpdateProfileRequest
    {
        public string Name { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string? Avatar { get; set; }
    }
}