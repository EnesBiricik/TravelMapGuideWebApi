using MongoDB.Driver;
using TravelMapGuideWebApi.Server.Constants;
using TravelMapGuideWebApi.Server.Data.Context;
using TravelMapGuideWebApi.Server.Data.Entities;
using TravelMapGuideWebApi.Server.Data.Repositories.Abstract;

namespace TravelMapGuideWebApi.Server.Data.Repositories.Concrete
{
    public class RoleRepository : Repository<Role, string>, IRoleRepository
    {
        private readonly IMongoCollection<Role> _rolesCollection;

        public RoleRepository(MongoDbService mongoDbService)
            : base(mongoDbService, CollectionNames.Roles)
        {
            _rolesCollection = mongoDbService.Database.GetCollection<Role>(CollectionNames.Roles);
        }

        public async Task<Role?> GetRoleByNameAsync(string roleName)
        {
            return await _rolesCollection
                .Find(role => role.Name.ToLower() == roleName.ToLower())
                .FirstOrDefaultAsync();
        }
    }
}
