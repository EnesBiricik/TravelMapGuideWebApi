using TravelMapGuide.Server.Data.Entities;
using TravelMapGuide.Server.Utilities.Helpers;
using TravelMapGuide.Server.Models;

namespace TravelMapGuide.Server.Services
{
    public interface ITravelService
    {
        Task<Result<IEnumerable<Travel>>> GetAllAsync();
        Task<Result> CreateAsync(CreateTravelModel model);
        Task<Result<Travel>> UpdateAsync(UpdateTravelModel travel);
        Task<Result<Travel>> GetByIdAsync(string id);
        Task<Result> DeleteAsync(string id);
    }
}
