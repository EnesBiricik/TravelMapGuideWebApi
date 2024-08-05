using TravelMapGuideWebApi.Server.Data.Entities;
using TravelMapGuideWebApi.Server.Helpers;
using TravelMapGuideWebApi.Server.Models.Travel;

namespace TravelMapGuideWebApi.Server.Services
{
    public interface ITravelService
    {
        Task<Result<IEnumerable<Travel>>> GetAllAsync();
        Task<Result> CreateAsync(CreateTravelModel model);
        Task<Result> UpdateAsync(UpdateTravelModel travel);
        Task<Result<Travel>> GetByIdAsync(string id);
        Task<Result> DeleteAsync(string id);
    }
}
