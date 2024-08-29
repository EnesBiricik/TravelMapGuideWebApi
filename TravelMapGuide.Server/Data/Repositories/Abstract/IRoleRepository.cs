using TravelMapGuideWebApi.Server.Data.Entities;

namespace TravelMapGuideWebApi.Server.Data.Repositories.Abstract
{
    public interface IRoleRepository : IRepository<Role>
    {
        Task<Role?> GetRoleByNameAsync(string roleName);
    }
}
