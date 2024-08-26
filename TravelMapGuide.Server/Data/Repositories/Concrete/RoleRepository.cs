using MongoDB.Driver;
using TravelMapGuideWebApi.Server.Constants;
using TravelMapGuideWebApi.Server.Data.Context;
using TravelMapGuideWebApi.Server.Data.Entities;
using TravelMapGuideWebApi.Server.Data.Repositories.Abstract;

namespace TravelMapGuideWebApi.Server.Data.Repositories.Concrete
{
    public class RoleRepository : Repository<UserRole, string>, IRoleRepository
    {
        private readonly IMongoCollection<UserRole> _rolesCollection;

        public RoleRepository(MongoDbService mongoDbService)
            : base(mongoDbService, CollectionNames.Roles)
        {
            _rolesCollection = mongoDbService.Database.GetCollection<UserRole>(CollectionNames.Roles);
        }

        public async Task<UserRole?> GetRoleByNameAsync(string roleName)
        {
            return await _rolesCollection
                .Find(role => role.Name == roleName)
                .FirstOrDefaultAsync();
        }
    }
}
