using Microsoft.Extensions.Options;
using MongoDB.Driver;
using TravelMapGuideWebApi.Server.Data;
using TravelMapGuideWebApi.Server.Models;
namespace TravelMapGuideWebApi.Server.Services
{
    public class TravelServices
    {
        private readonly IMongoCollection<Travel> _travelCollection;

        public TravelServices(IOptions<DatabaseSettings> settings)
        {
            var mongoClient = new MongoClient(settings.Value.Connection);
            var mongoDb = mongoClient.GetDatabase(settings.Value.DatabaseName);
            _travelCollection = mongoDb.GetCollection<Travel>(settings.Value.CollectionName);
        }

        // get all travels
        public async Task<List<Travel>> GetAsync() => await _travelCollection.Find(_ => true).ToListAsync();


        // get travel by id
        public async Task<Travel> GetAsync(string id) =>
            await _travelCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

        // Add new travel
        public async Task CreateAsync(Travel newTravel) =>
            await _travelCollection.InsertOneAsync(newTravel);

        // update travel

        public async Task UpdateAsync(string id, Travel updateStudent) =>
            await _travelCollection.ReplaceOneAsync(x => x.Id == id, updateStudent);

        // delete travel
        public async Task RemoveAsync(string id) =>
            await _travelCollection.DeleteOneAsync(x => x.Id == id);

    }
}
