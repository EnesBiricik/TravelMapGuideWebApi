using TravelMapGuide.Server.Data.Repositories.Abstract;

namespace TravelMapGuide.Server.Data.Repositories.Concrete
{
    public class BlacklistRepository : IBlacklistRepository
    {
        private readonly List<string> _blacklistedTokens = new List<string>();

        public async Task AddTokenAsync(string token)
        {
            _blacklistedTokens.Add(token);
            await Task.CompletedTask; // Async metod uyumluluğu için.
        }

        public async Task<bool> IsTokenExistsAsync(string token)
        {
            return await Task.FromResult(_blacklistedTokens.Contains(token));
        }
    }
}
