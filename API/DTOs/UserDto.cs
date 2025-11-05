using TrustEze.API.Models;

namespace TrustEze.API.DTOs
{
    public class UserDto
    {
        public string Id { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string? Avatar { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? LastLoginAt { get; set; }
        public List<RoleDto> Roles { get; set; } = new();

        public UserDto()
        {
        }
        public UserDto(User user)
        {
            if (user == null)return;
            Id = user.Id;
            Email = user.Email;
            Name = user.Name;
            Phone = user.Phone;
            Avatar = user.Avatar;
            CreatedAt = user.CreatedAt;
            LastLoginAt = user.LastLoginAt;
            Roles = user.Roles?.Select(r => new RoleDto(r)).ToList() ?? [];
        }
    }
}
