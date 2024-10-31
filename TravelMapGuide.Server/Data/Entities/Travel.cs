namespace TravelMapGuide.Server.Data.Entities
{
    public class Travel : BaseEntity
    {
        public string userId { get; set; }
        public User? user { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string? Latitude { get; set; }
        public string? Longitude { get; set; }
        public DateTime Date { get; set; }
        public int StarReview { get; set; } = 0;
        public int Cost { get; set; }
        public string ImageUrl { get; set; }
        public bool IsFeatured { get; set; }
    }
}
