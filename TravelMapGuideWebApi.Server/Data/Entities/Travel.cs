﻿using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Text.Json.Serialization;

namespace TravelMapGuideWebApi.Server.Data.Entities
{
    public class Travel : BaseEntity
    {
        public string Name { get; set; }

        public string Description { get; set; }

        public string Location { get; set; }

        public DateTime Date { get; set; }

        public int StarReview { get; set; } = 0;

        public int Cost { get; set; }
    }
}
