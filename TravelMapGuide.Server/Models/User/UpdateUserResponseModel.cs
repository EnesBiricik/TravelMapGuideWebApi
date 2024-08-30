using TravelMapGuide.Server.Data.Entities;

namespace TravelMapGuide.Server.Models
{
    public class UpdateUserResponseModel
    {
        public User? User { get; set; }
        public string? Token { get; set; }
    }
}
