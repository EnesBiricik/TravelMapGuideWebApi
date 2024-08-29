namespace TravelMapGuide.Server.Data.Repositories.Abstract
{
    public interface IBlacklistRepository
    {
        Task AddTokenAsync(string token);
        Task<bool> IsTokenExistsAsync(string token);
    }

}
