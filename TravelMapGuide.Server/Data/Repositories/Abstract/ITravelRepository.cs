using TravelMapGuideWebApi.Server.Data.Entities;

namespace TravelMapGuideWebApi.Server.Data.Repositories.Abstract
{
    public interface ITravelRepository : IRepository<Travel>
    {
        Task<IEnumerable<Travel>> GetTravelsByLocationAsync(string location);
    }
}
