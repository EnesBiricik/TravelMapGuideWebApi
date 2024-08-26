using TravelMapGuideWebApi.Server.Data.Entities;

namespace TravelMapGuideWebApi.Server.Data.Repositories.Abstract
{
    public interface IRoleRepository : IRepository<UserRole>
    {
        Task<UserRole?> GetRoleByNameAsync(string roleName);
    }
}
