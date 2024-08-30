using MongoDB.Driver;
using TravelMapGuide.Server.Utilities.Constants;
using TravelMapGuide.Server.Data.Context;
using TravelMapGuide.Server.Data.Entities;
using TravelMapGuide.Server.Data.Repositories.Abstract;

namespace TravelMapGuide.Server.Data.Repositories.Concrete
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
