using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Text.Json.Serialization;

namespace TravelMapGuideWebApi.Server.Data.Entities
{
    [BsonIgnoreExtraElements]
    public class Travel
    {

        [BsonId]
        [BsonElement("_id")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; } // Nullable 

        [BsonElement("name")]
        public string Name { get; set; }

        [BsonElement("description")]
        public string Description { get; set; }

        [BsonElement("location")]
        public string Location { get; set; }

        [BsonElement("date")]
        public DateTime Date { get; set; }

        [BsonElement("review_star")]
        public int StarReview { get; set; } = 0;

        [BsonElement("cost")]
        public int Cost { get; set; }
    }
}
