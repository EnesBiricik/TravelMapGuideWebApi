namespace TravelMapGuide.Server.Data.Entities
{
    public class Travel : BaseEntity
    {
        public string userId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public DateTime Date { get; set; }
        public int StarReview { get; set; } = 0;
        public int Cost { get; set; }
    }
}
