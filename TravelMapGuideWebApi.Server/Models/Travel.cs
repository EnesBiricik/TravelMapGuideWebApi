using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Text.Json.Serialization;

namespace TravelMapGuideWebApi.Server.Models
{
    [BsonIgnoreExtraElements]
    public class Travel
    {

        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; } // Nullable 

        [BsonElement("Name")]
        [JsonPropertyName("Name")]
        public string Name { get; set; }

        [BsonElement("Description")]
        public string Description { get; set; }

        [BsonElement("Location")]
        public string Location { get; set; }

        [BsonElement("Date")]
        public DateTime Date { get; set; }

        [BsonElement("Review")]
        [BsonDefaultValue(0)]
        public int Review { get; set; }

        [BsonElement("Cost")]
        public int Cost { get; set; }
    }
}
