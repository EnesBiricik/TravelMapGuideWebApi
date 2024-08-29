using TravelMapGuide.Server.Data.Repositories.Abstract;

namespace TravelMapGuide.Server.Services
{
    public class BlacklistService : IBlacklistService
    {
        private readonly IBlacklistRepository _blacklistRepository;

        public BlacklistService(IBlacklistRepository blacklistRepository)
        {
            _blacklistRepository = blacklistRepository;
        }

        public async Task BlacklistTokenAsync(string token)
        {
            await _blacklistRepository.AddTokenAsync(token);
        }

        public async Task<bool> IsTokenBlacklistedAsync(string token)
        {
            return await _blacklistRepository.IsTokenExistsAsync(token);
        }
    }
}
