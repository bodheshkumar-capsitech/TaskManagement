using Projects.Common;

namespace Projects.Models
{
    public class Users
    {
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;

        public string Role { get; set; } = "User";
        public string Status { get; set; } = "Active";
    }
}
