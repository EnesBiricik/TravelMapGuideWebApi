namespace TravelMapGuide.Server.Services
{
    public interface IBlacklistService
    {
        Task BlacklistTokenAsync(string token);
        Task<bool> IsTokenBlacklistedAsync(string token);
    }

}
