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
    }
}
