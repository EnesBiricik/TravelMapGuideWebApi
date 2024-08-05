using Microsoft.VisualBasic;
using MongoDB.Driver;
using TravelMapGuideWebApi.Server.Constants;
using TravelMapGuideWebApi.Server.Data.Context;
using TravelMapGuideWebApi.Server.Data.Entities;
using TravelMapGuideWebApi.Server.Data.Repositories.Abstract;

namespace TravelMapGuideWebApi.Server.Data.Repositories.Concrete
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
