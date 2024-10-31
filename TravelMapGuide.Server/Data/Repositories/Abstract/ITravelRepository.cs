using System.Threading.Tasks;
using TravelMapGuide.Server.Data.Entities;

namespace TravelMapGuide.Server.Data.Repositories.Abstract
{
    public interface ITravelRepository : IRepository<Travel>
    {
        Task<List<Travel>> GetByUserIdAsync(string userId);
        Task<IEnumerable<Travel>> GetAllAsync();
    }
}
