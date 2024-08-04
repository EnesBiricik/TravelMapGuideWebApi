using Microsoft.Extensions.Options;
using MongoDB.Driver;
using TravelMapGuideWebApi.Server.Configuration;

namespace TravelMapGuideWebApi.Server.Data.Context
{
    public class MongoDbService
    {
        private readonly IMongoDatabase _database;
        public MongoDbService(IOptions<DatabaseConfiguration> configuration)
        {
            var connectionStrings = configuration.Value.LocalConnection;
            var mongoUrl = MongoUrl.Create(connectionStrings);
            var mongoClient = new MongoClient(mongoUrl);
            _database = mongoClient.GetDatabase(configuration.Value.DatabaseName);
        }

        public IMongoDatabase? Database => _database;

    }
}
