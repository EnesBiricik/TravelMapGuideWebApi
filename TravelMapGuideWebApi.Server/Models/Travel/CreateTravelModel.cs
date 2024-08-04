using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace TravelMapGuideWebApi.Server.Models.Travel
{
    public class CreateTravelModel
    {
        public string Name { get; set; }

        public string Description { get; set; }

        public string Location { get; set; }

        public DateTime Date { get; set; }

        public int StarReview { get; set; } = 0;

        public int Cost { get; set; }
    }
}
