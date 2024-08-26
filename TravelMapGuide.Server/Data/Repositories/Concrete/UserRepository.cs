using MongoDB.Driver;
using TravelMapGuideWebApi.Server.Constants;
using TravelMapGuideWebApi.Server.Data.Context;
using TravelMapGuideWebApi.Server.Data.Entities;
using TravelMapGuideWebApi.Server.Data.Repositories.Abstract;
using TravelMapGuideWebApi.Server.Data.Repositories.Concrete;
public class UserRepository : Repository<User, string>, IUserRepository
{
    private readonly IMongoCollection<User> _users;

    public UserRepository(MongoDbService mongoDbService) : base(mongoDbService, CollectionNames.Users)
    {
        _users = mongoDbService.Database.GetCollection<User>(CollectionNames.Users);

    }
    public async Task<User> GetUserByUsernameAsync(string username)
    {
        return await _users.Find(u => u.Username == username).FirstOrDefaultAsync();
    }

    public async Task<User> GetUserByEmailAsync(string email)
    {
        return await _users.Find(u => u.Email == email).FirstOrDefaultAsync();
    }

    public async Task<bool> IsUserExistsByUsernameAsync(string identifier)
    {
        return await _users.Find(u => u.Username == identifier).AnyAsync();
    }

    public async Task<bool> IsUserExistsByEmailAsync(string identifier)
    {
        return await _users.Find(u => u.Email == identifier).AnyAsync();
    }
}
