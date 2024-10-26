namespace TravelMapGuide.Server.Models
{
    public class CreateTravelModel
    {
        public string? UserId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string? Latitude { get; set; }
        public string? Longitude { get; set; }
        public DateTime Date { get; set; }
        public int StarReview { get; set; } = 0;
        public int Cost { get; set; }
        public IFormFile Image { get; set; }
        public string? ImageUrl { get; set; }
        public bool IsFeatured { get; set; }
    }

}
