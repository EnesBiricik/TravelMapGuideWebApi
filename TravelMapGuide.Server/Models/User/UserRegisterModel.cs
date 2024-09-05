namespace TravelMapGuide.Server.Models
{
    public class UserRegisterModel
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public IFormFile Image { get; set; }
        public string? ImageUrl { get; set; }
    }
}
