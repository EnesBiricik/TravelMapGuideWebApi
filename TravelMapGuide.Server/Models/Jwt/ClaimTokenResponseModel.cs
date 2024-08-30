namespace TravelMapGuide.Server.Models.Jwt
{
    public class ClaimTokenResponseModel
    {
        public string? UserName { get; set; }
        public string? RoleName { get; set; }
        public string? UserId { get; set; }
    }
}
