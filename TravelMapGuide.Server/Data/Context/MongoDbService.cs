using Microsoft.Extensions.Options;
using MongoDB.Driver;
using NLog;
using TravelMapGuide.Server.Configuration;
using TravelMapGuide.Server.Utilities.Constants;
using TravelMapGuide.Server.Data.Entities;
using TravelMapGuide.Server.Utilities.Enums;
using TravelMapGuide.Server.Utilities.Helpers;

namespace TravelMapGuide.Server.Data.Context
{
    public class MongoDbService
    {
        private readonly IMongoDatabase _database;
        private readonly IMongoCollection<Role> _rolesCollection;
        private readonly IMongoCollection<User> _usersCollection;
        private readonly IMongoCollection<Travel> _travelCollection;
        //add tables.
        private static readonly Logger Logger = LogManager.GetCurrentClassLogger();
        public MongoDbService(IOptions<DatabaseConfiguration> configuration)
        {
            try
            {
                var connectionStrings = configuration.Value.LocalConnection;
                var mongoUrl = MongoUrl.Create(connectionStrings);
                var mongoClient = new MongoClient(mongoUrl);

                var databaseExists = mongoClient.ListDatabaseNames().ToList().Contains(configuration.Value.DatabaseName);
                if (!databaseExists)
                {
                    Logger.Info("Database not found, new database will be created.");
                }
                _database = mongoClient.GetDatabase(configuration.Value.DatabaseName);

                _rolesCollection = CheckAndCreateCollection<Role>(CollectionNames.Roles);
                _usersCollection = CheckAndCreateCollection<User>(CollectionNames.Users);
                _travelCollection = CheckAndCreateCollection<Travel>(CollectionNames.Travels);
                //create table.

                CreateDefaultRolesIfNotExists();
                CreateAdminUserIfNotExists();
            }
            catch (Exception ex)
            {
                Logger.Error(ex, "An error occurred while creating the MongoDbService.");
                throw;
            }
        }
        public IMongoDatabase? Database => _database;
        private IMongoCollection<T> CheckAndCreateCollection<T>(string collectionName)
        {
            try
            {
                var collections = _database.ListCollectionNames().ToList();
                if (!collections.Contains(collectionName))
                {
                    _database.CreateCollection(collectionName);
                    Logger.Info($"{collectionName} Collection created successfully.");
                }
                else
                {
                    Logger.Info($"{collectionName} collection already exists.");
                }
            }
            catch (Exception ex)
            {
                Logger.Error(ex, $"{collectionName} An error occurred while creating the collection.");
                throw;
            }

            return _database.GetCollection<T>(collectionName);
        }
        private void CreateDefaultRolesIfNotExists()
        {
            try
            {
                var userRole = Roles.User;
                var adminRole = Roles.Admin;

                var existingUserRole = _rolesCollection.Find(role => role.Name == userRole).FirstOrDefault();
                var existingAdminRole = _rolesCollection.Find(role => role.Name == adminRole).FirstOrDefault();

                if (existingUserRole == null)
                {
                    var newUserRole = new Role
                    {
                        Name = userRole,
                        NormalizedName = userRole.ToUpper()
                    };
                    _rolesCollection.InsertOne(newUserRole);
                }

                if (existingAdminRole == null)
                {
                    var newAdminRole = new Role
                    {
                        Name = adminRole,
                        NormalizedName = adminRole.ToUpper()
                    };
                    _rolesCollection.InsertOne(newAdminRole);
                }
            }
            catch (Exception ex)
            {
                Logger.Error(ex, "An error occurred while creating default roles.");
                throw;
            }
        }
        private void CreateAdminUserIfNotExists()
        {
            try
            {
                var existingAdminUser = _usersCollection.Find(user => user.Username == "deneme").FirstOrDefault();

                if (existingAdminUser == null)
                {
                    var adminRole = _rolesCollection.Find(role => role.NormalizedName == Roles.Admin.ToUpper()).FirstOrDefault();

                    if (adminRole != null)
                    {
                        var newUser = new User
                        {
                            Username = "deneme",
                            Password = PasswordHasher.HashPassword("123"),
                            Email = "deneme@gmail.com",
                            RoleId = adminRole.Id,
                            Role = adminRole,
                            ImageUrl = "DefaultUser.png"
                        };

                        _usersCollection.InsertOne(newUser);
                        Logger.Info("Admin user created.");
                    }
                }
            }
            catch (Exception ex)
            {
                Logger.Error(ex, "An error occurred while creating the admin user.");
                throw;
            }
        }
    }
}