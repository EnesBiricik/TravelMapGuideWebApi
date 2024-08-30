using MongoDB.Driver;
using TravelMapGuide.Server.Utilities.Constants;
using TravelMapGuide.Server.Data.Context;
using TravelMapGuide.Server.Data.Entities;
using TravelMapGuide.Server.Data.Repositories.Abstract;

namespace TravelMapGuide.Server.Data.Repositories.Concrete
{
    public class TravelRepository : Repository<Travel, string>, ITravelRepository
    {

        public TravelRepository(MongoDbService mongoDbService) : base(mongoDbService, CollectionNames.Travels)
        {

        }

        //misal girilen konuma göre seyahat getirme -- arama kutucuğu eklenir sorgu atılır zınk.
        public async Task<IEnumerable<Travel>> GetTravelsByLocationAsync(string location)
        {
            return await _collection.Find(travel => travel.Location == location).ToListAsync();
        }
    }
}
