using TravelMapGuide.Server.Data.Entities;

namespace TravelMapGuide.Server.Data.Repositories.Abstract
{
    public interface IRoleRepository : IRepository<Role>
    {
        Task<Role?> GetRoleByNameAsync(string roleName);
    }
}
