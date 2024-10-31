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

        public async Task<IEnumerable<Travel>> GetAllAsync()
        {
            var travels = await _travelCollection
                .Find(_ => true)
                .Project(t => new Travel
                {
                    userId = t.userId,
                    user = new User
                    {
                        Username = t.user.Username,
                        Email = t.user.Email,
                        ImageUrl = t.user.ImageUrl,
                        Id = t.user.Id
                    },
                    Name = t.Name,
                    Description = t.Description,
                    Latitude = t.Latitude,
                    Longitude = t.Longitude,
                    Date = t.Date,
                    StarReview = t.StarReview,
                    Cost = t.Cost,
                    ImageUrl = t.ImageUrl,
                    IsFeatured = t.IsFeatured,
                    Id = t.Id
                })
                .ToListAsync();
            return travels;
        }
    }
}
