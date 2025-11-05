using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using TrustEze.API.Services;
using TrustEze.API.DTOs;
using TrustEze.API.Models;
using MongoDB.Driver;

namespace TrustEze.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly MongoDbService _mongoDbService;
        private readonly EnvironmentVariables _environmentVariables;

        public AuthController(MongoDbService mongoDbService, EnvironmentVariables environmentVariables)
        {
            _mongoDbService = mongoDbService;
            _environmentVariables = environmentVariables;
        }

        [HttpPost("login")]
        public async Task<ActionResult<LoginResponse>> Login(LoginRequest request)
        {
            var user = await _mongoDbService.Users
                .Find(u => u.Email == request.Email)
                .FirstOrDefaultAsync();

            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                return Unauthorized(new { message = "Invalid email or password" });
            }

            // Update last login
            user.LastLoginAt = DateTime.UtcNow;
            await _mongoDbService.Users.ReplaceOneAsync(u => u.Id == user.Id, user);

            var token = GenerateJwtToken(user);
            var userDto = new UserDto(user);

            return Ok(new LoginResponse
            {
                Token = token,
                User = userDto,
                ExpiresAt = DateTime.UtcNow.AddDays(7)
            });
        }

        [HttpPost("register")]
        public async Task<ActionResult<LoginResponse>> Register(RegisterRequest request)
        {
            // Check if user already exists
            var existingUser = await _mongoDbService.Users
                .Find(u => u.Email == request.Email)
                .FirstOrDefaultAsync();
            
            if (existingUser != null)
            {
                return BadRequest(new { message = "User with this email already exists" });
            }

            // Create new user
            var user = new User
            {
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Name = request.Name,
                Phone = request.Phone,
                Avatar = request.Avatar
            };

            await _mongoDbService.Users.InsertOneAsync(user);

            var token = GenerateJwtToken(user);
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

            return Ok(new LoginResponse
            {
                Token = token,
                User = userDto,
                ExpiresAt = DateTime.UtcNow.AddDays(7)
            });
        }

        private string GenerateJwtToken(User user)
        {
            var key = Encoding.ASCII.GetBytes(_environmentVariables.Jwt.JwtKey);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Name, user.Name)
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                Issuer = _environmentVariables.Jwt.Issuer,
                Audience = _environmentVariables.Jwt.Audience,
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }

    public class RegisterRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string? Avatar { get; set; }
        public List<string> Roles { get; set; } = [];
    }
}
