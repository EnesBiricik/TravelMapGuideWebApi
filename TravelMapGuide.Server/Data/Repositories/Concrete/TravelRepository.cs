using MongoDB.Driver;
using TravelMapGuide.Server.Utilities.Constants;
using TravelMapGuide.Server.Data.Context;
using TravelMapGuide.Server.Data.Entities;
using TravelMapGuide.Server.Data.Repositories.Abstract;

namespace TravelMapGuide.Server.Data.Repositories.Concrete
{
    public class TravelRepository : Repository<Travel, string>, ITravelRepository
    {
        private readonly IMongoCollection<Travel> _travelCollection;

        public TravelRepository(MongoDbService mongoDbService) : base(mongoDbService, CollectionNames.Travels)
        {
            _travelCollection = mongoDbService.Database.GetCollection<Travel>(CollectionNames.Travels);
        }

        public async Task<List<Travel>> GetByUserIdAsync(string userId)
        {
            return await _travelCollection.Find(travel => travel.userId == userId).ToListAsync();
        }
    }
}
