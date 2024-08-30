namespace TravelMapGuide.Server.Data.Entities
{
    public class User : BaseEntity
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public Role Role { get; set; }
        public string RoleId { get; set; }
    }
}
