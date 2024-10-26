namespace TravelMapGuide.Server.Models
{
    public class UpdateTravelModel
    {
        public string Id { get; set; }
        public string Name { get; set; }

        public string Description { get; set; }

        public string Location { get; set; }

        public DateTime Date { get; set; }

        public int StarReview { get; set; } = 0;

        public int Cost { get; set; }
        public bool IsFeatured { get; set; }
    }
}
