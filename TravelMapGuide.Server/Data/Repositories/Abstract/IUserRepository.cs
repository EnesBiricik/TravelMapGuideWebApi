using TravelMapGuide.Server.Data.Entities;

namespace TravelMapGuide.Server.Data.Repositories.Abstract
{
    public interface IUserRepository : IRepository<User>
    {
        Task<User> GetUserByUsernameAsync(string username);
        Task<User> GetUserByEmailAsync(string email);
        Task<bool> IsUserExistsByUsernameAsync(string identifier);
        Task<bool> IsUserExistsByEmailAsync(string identifier);
    }
}
