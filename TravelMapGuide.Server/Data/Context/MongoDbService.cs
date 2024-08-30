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
        //tabloları ekle.
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
                    Logger.Info("Veritabanı bulunamadı, yeni veritabanı oluşturulacak.");
                }
                _database = mongoClient.GetDatabase(configuration.Value.DatabaseName);

                _rolesCollection = CheckAndCreateCollection<Role>(CollectionNames.Roles);
                _usersCollection = CheckAndCreateCollection<User>(CollectionNames.Users);
                _travelCollection = CheckAndCreateCollection<Travel>(CollectionNames.Travels);
                //tabloyu oluşturr.

                CreateDefaultRolesIfNotExists();
                CreateAdminUserIfNotExists();
            }
            catch (Exception ex)
            {
                Logger.Error(ex, "MongoDbService oluşturulurken bir hata meydana geldi.");
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
                    Logger.Info($"{collectionName} koleksiyonu başarıyla oluşturuldu.");
                }
                else
                {
                    Logger.Info($"{collectionName} koleksiyonu zaten mevcut.");
                }
            }
            catch (Exception ex)
            {
                Logger.Error(ex, $"{collectionName} koleksiyonu oluşturulurken bir hata meydana geldi.");
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

                var existingUserRole = _rolesCollection.Find(role => role.NormalizedName == userRole.ToUpper()).FirstOrDefault();
                var existingAdminRole = _rolesCollection.Find(role => role.NormalizedName == adminRole.ToUpper()).FirstOrDefault();

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
                Logger.Error(ex, "Varsayılan roller oluşturulurken bir hata meydana geldi.");
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
                            Role = adminRole
                        };

                        _usersCollection.InsertOne(newUser);
                        Logger.Info("Admin kullanıcı oluşturuldu.");
                    }
                }
            }
            catch (Exception ex)
            {
                Logger.Error(ex, "Admin kullanıcı oluşturulurken bir hata meydana geldi.");
                throw;
            }
        }
    }
}
