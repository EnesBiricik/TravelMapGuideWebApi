using TravelMapGuideWebApi.Server.Data.Entities;

namespace TravelMapGuideWebApi.Server.Data.Repositories.Abstract
{
    public interface IUserRepository : IRepository<User>
    {
        Task<User> GetUserByUsernameAsync(string username);
        Task<User> GetUserByEmailAsync(string email);
    }
}
